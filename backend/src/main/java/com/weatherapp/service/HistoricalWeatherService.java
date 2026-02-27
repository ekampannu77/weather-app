package com.weatherapp.service;

import com.weatherapp.dto.GeocodingResult;
import com.weatherapp.exception.ExternalApiException;
import com.weatherapp.exception.InvalidDateRangeException;
import com.weatherapp.model.HistoricalQuery;
import com.weatherapp.model.WeatherRecord;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class HistoricalWeatherService {

    private final WebClient.Builder webClientBuilder;

    @Value("${openmeteo.archive.url}")
    private String openMeteoUrl;

    private static final LocalDate MIN_DATE = LocalDate.of(1940, 1, 1);
    private static final int MAX_RANGE_DAYS = 366;

    public void validateDateRange(LocalDate startDate, LocalDate endDate) {
        LocalDate today = LocalDate.now();

        if (startDate.isAfter(endDate)) {
            throw new InvalidDateRangeException("Start date must be before or equal to end date");
        }
        if (endDate.isAfter(today.minusDays(1))) {
            throw new InvalidDateRangeException("End date must be before today (historical data only)");
        }
        if (startDate.isBefore(MIN_DATE)) {
            throw new InvalidDateRangeException("Start date cannot be before 1940-01-01 (archive limit)");
        }
        long rangeDays = endDate.toEpochDay() - startDate.toEpochDay() + 1;
        if (rangeDays > MAX_RANGE_DAYS) {
            throw new InvalidDateRangeException("Date range cannot exceed " + MAX_RANGE_DAYS + " days");
        }
    }

    public List<WeatherRecord> fetchAndBuildRecords(
            HistoricalQuery query, GeocodingResult geo, LocalDate startDate, LocalDate endDate) {

        Map<String, Object> meteoData = fetchFromOpenMeteo(geo.getLat(), geo.getLon(), startDate, endDate);
        query.setRawMeteoData(meteoData);

        List<WeatherRecord> records = parseRecords(query, meteoData);
        computeAggregates(query, records);
        return records;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> fetchFromOpenMeteo(BigDecimal lat, BigDecimal lon,
                                                    LocalDate startDate, LocalDate endDate) {
        try {
            Map result = webClientBuilder.build()
                    .get()
                    .uri(openMeteoUrl +
                            "?latitude={lat}&longitude={lon}" +
                            "&start_date={start}&end_date={end}" +
                            "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum," +
                            "wind_speed_10m_max,wind_direction_10m_dominant,weather_code,sunrise,sunset" +
                            "&timezone=auto",
                            lat, lon, startDate.toString(), endDate.toString())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (result == null) {
                throw new ExternalApiException("Empty response from Open-Meteo API");
            }
            return result;
        } catch (WebClientResponseException e) {
            throw new ExternalApiException("Open-Meteo API error: " + e.getMessage());
        } catch (Exception e) {
            if (e instanceof ExternalApiException) throw e;
            throw new ExternalApiException("Failed to fetch historical weather data: " + e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    private List<WeatherRecord> parseRecords(HistoricalQuery query, Map<String, Object> data) {
        Map<String, Object> daily = (Map<String, Object>) data.get("daily");
        if (daily == null) return new ArrayList<>();

        List<String> times = (List<String>) daily.get("time");
        List<Double> tempMax = getDoubleList(daily, "temperature_2m_max");
        List<Double> tempMin = getDoubleList(daily, "temperature_2m_min");
        List<Double> precip = getDoubleList(daily, "precipitation_sum");
        List<Double> windSpeed = getDoubleList(daily, "wind_speed_10m_max");
        List<Integer> windDir = getIntList(daily, "wind_direction_10m_dominant");
        List<Integer> weatherCode = getIntList(daily, "weather_code");
        List<String> sunrises = (List<String>) daily.getOrDefault("sunrise", new ArrayList<>());
        List<String> sunsets = (List<String>) daily.getOrDefault("sunset", new ArrayList<>());

        List<WeatherRecord> records = new ArrayList<>();
        if (times == null) return records;

        for (int i = 0; i < times.size(); i++) {
            WeatherRecord record = WeatherRecord.builder()
                    .query(query)
                    .recordDate(LocalDate.parse(times.get(i)))
                    .tempMaxCelsius(getDecimal(tempMax, i))
                    .tempMinCelsius(getDecimal(tempMin, i))
                    .precipitationMm(getDecimal(precip, i))
                    .windSpeedKmh(getDecimal(windSpeed, i))
                    .windDirection(getShort(windDir, i))
                    .weatherCode(getShort(weatherCode, i))
                    .sunrise(parseTime(sunrises, i))
                    .sunset(parseTime(sunsets, i))
                    .build();
            records.add(record);
        }
        return records;
    }

    private void computeAggregates(HistoricalQuery query, List<WeatherRecord> records) {
        if (records.isEmpty()) return;

        double sumMax = 0, sumMin = 0, sumPrecip = 0, sumWind = 0;
        double overallMin = Double.MAX_VALUE, overallMax = Double.MIN_VALUE;

        for (WeatherRecord r : records) {
            if (r.getTempMaxCelsius() != null) {
                double max = r.getTempMaxCelsius().doubleValue();
                sumMax += max;
                if (max > overallMax) overallMax = max;
            }
            if (r.getTempMinCelsius() != null) {
                double min = r.getTempMinCelsius().doubleValue();
                sumMin += min;
                if (min < overallMin) overallMin = min;
            }
            if (r.getPrecipitationMm() != null) sumPrecip += r.getPrecipitationMm().doubleValue();
            if (r.getWindSpeedKmh() != null) sumWind += r.getWindSpeedKmh().doubleValue();
        }

        int n = records.size();
        query.setAvgTempCelsius(bd((sumMax + sumMin) / (2.0 * n)));
        query.setMaxTempCelsius(bd(overallMax == Double.MIN_VALUE ? 0 : overallMax));
        query.setMinTempCelsius(bd(overallMin == Double.MAX_VALUE ? 0 : overallMin));
        query.setAvgPrecipitation(bd(sumPrecip / n));
        query.setAvgWindSpeed(bd(sumWind / n));
    }

    private BigDecimal bd(double val) {
        return BigDecimal.valueOf(val).setScale(2, RoundingMode.HALF_UP);
    }

    @SuppressWarnings("unchecked")
    private List<Double> getDoubleList(Map<String, Object> map, String key) {
        Object val = map.get(key);
        if (val instanceof List) return (List<Double>) val;
        return new ArrayList<>();
    }

    @SuppressWarnings("unchecked")
    private List<Integer> getIntList(Map<String, Object> map, String key) {
        Object val = map.get(key);
        if (val instanceof List) return (List<Integer>) val;
        return new ArrayList<>();
    }

    private BigDecimal getDecimal(List<Double> list, int i) {
        if (list == null || i >= list.size() || list.get(i) == null) return null;
        return bd(list.get(i));
    }

    private Short getShort(List<Integer> list, int i) {
        if (list == null || i >= list.size() || list.get(i) == null) return null;
        return list.get(i).shortValue();
    }

    private LocalTime parseTime(List<String> list, int i) {
        if (list == null || i >= list.size() || list.get(i) == null) return null;
        try {
            String timeStr = list.get(i);
            // Format: "2024-06-01T05:30"
            if (timeStr.contains("T")) {
                timeStr = timeStr.substring(timeStr.indexOf("T") + 1);
            }
            return LocalTime.parse(timeStr, DateTimeFormatter.ofPattern("HH:mm"));
        } catch (Exception e) {
            return null;
        }
    }
}
