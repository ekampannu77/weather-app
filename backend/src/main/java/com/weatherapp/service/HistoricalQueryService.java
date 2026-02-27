package com.weatherapp.service;

import com.weatherapp.dto.*;
import com.weatherapp.exception.ResourceNotFoundException;
import com.weatherapp.model.HistoricalQuery;
import com.weatherapp.model.WeatherRecord;
import com.weatherapp.repository.HistoricalQueryRepository;
import com.weatherapp.repository.WeatherRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class HistoricalQueryService {

    private final HistoricalQueryRepository queryRepository;
    private final WeatherRecordRepository recordRepository;
    private final GeocodingService geocodingService;
    private final HistoricalWeatherService historicalWeatherService;

    @Transactional
    public HistoricalQueryResponse createQuery(HistoricalQueryRequest request) {
        // 1. Validate date range
        historicalWeatherService.validateDateRange(request.getStartDate(), request.getEndDate());

        // 2. Geocode / validate location
        GeocodingResult geo = geocodingService.resolveLocation(request.getInputLocation());

        // 3. Build entity
        HistoricalQuery query = HistoricalQuery.builder()
                .inputLocation(request.getInputLocation())
                .resolvedCity(geo.getName())
                .resolvedCountry(geo.getCountry())
                .resolvedState(geo.getState())
                .latitude(geo.getLat())
                .longitude(geo.getLon())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .userNotes(request.getUserNotes())
                .build();

        // 4. Fetch historical data from Open-Meteo
        List<WeatherRecord> records = historicalWeatherService
                .fetchAndBuildRecords(query, geo, request.getStartDate(), request.getEndDate());

        // 5. Save
        query.setWeatherRecords(records);
        HistoricalQuery saved = queryRepository.save(query);
        log.info("Created historical query id={} for '{}'", saved.getId(), saved.getDisplayName());

        return toResponse(saved, true);
    }

    public Page<HistoricalQueryResponse> getAllQueries(int page, int size, String city) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        if (city == null || city.isBlank()) {
            return queryRepository.findAll(pageable).map(q -> toResponse(q, false));
        }
        return queryRepository.findAllWithFilter(city, pageable)
                .map(q -> toResponse(q, false));
    }

    public HistoricalQueryResponse getQueryById(Long id) {
        HistoricalQuery query = queryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Query not found with id: " + id));
        return toResponse(query, true);
    }

    @Transactional
    public HistoricalQueryResponse updateQuery(Long id, UpdateQueryRequest request) {
        HistoricalQuery query = queryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Query not found with id: " + id));

        boolean locationChanged = request.getInputLocation() != null
                && !request.getInputLocation().isBlank()
                && !request.getInputLocation().equals(query.getInputLocation());

        boolean datesChanged = (request.getStartDate() != null && !request.getStartDate().equals(query.getStartDate()))
                || (request.getEndDate() != null && !request.getEndDate().equals(query.getEndDate()));

        if (locationChanged || datesChanged) {
            // Re-validate and re-fetch
            String location = locationChanged ? request.getInputLocation() : query.getInputLocation();
            java.time.LocalDate startDate = request.getStartDate() != null ? request.getStartDate() : query.getStartDate();
            java.time.LocalDate endDate = request.getEndDate() != null ? request.getEndDate() : query.getEndDate();

            historicalWeatherService.validateDateRange(startDate, endDate);
            GeocodingResult geo = geocodingService.resolveLocation(location);

            query.setInputLocation(location);
            query.setResolvedCity(geo.getName());
            query.setResolvedCountry(geo.getCountry());
            query.setResolvedState(geo.getState());
            query.setLatitude(geo.getLat());
            query.setLongitude(geo.getLon());
            query.setStartDate(startDate);
            query.setEndDate(endDate);

            // Delete old records and fetch new ones
            recordRepository.deleteByQueryId(id);
            query.getWeatherRecords().clear();

            List<WeatherRecord> newRecords = historicalWeatherService
                    .fetchAndBuildRecords(query, geo, startDate, endDate);
            query.setWeatherRecords(newRecords);
        }

        if (request.getUserNotes() != null) {
            query.setUserNotes(request.getUserNotes());
        }

        HistoricalQuery saved = queryRepository.save(query);
        log.info("Updated historical query id={}", id);
        return toResponse(saved, true);
    }

    @Transactional
    public void deleteQuery(Long id) {
        if (!queryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Query not found with id: " + id);
        }
        queryRepository.deleteById(id);
        log.info("Deleted historical query id={}", id);
    }

    @Transactional
    public void deleteAllQueries() {
        queryRepository.deleteAll();
        log.info("Deleted all historical queries");
    }

    public List<HistoricalQuery> getAllForExport() {
        return queryRepository.findAllByOrderByCreatedAtDesc();
    }

    private HistoricalQueryResponse toResponse(HistoricalQuery query, boolean includeRecords) {
        List<WeatherRecordDTO> recordDTOs = null;
        if (includeRecords) {
            recordDTOs = query.getWeatherRecords().stream()
                    .map(this::toRecordDTO)
                    .collect(Collectors.toList());
        }

        return HistoricalQueryResponse.builder()
                .id(query.getId())
                .inputLocation(query.getInputLocation())
                .displayName(query.getDisplayName())
                .resolvedCity(query.getResolvedCity())
                .resolvedCountry(query.getResolvedCountry())
                .resolvedState(query.getResolvedState())
                .latitude(query.getLatitude())
                .longitude(query.getLongitude())
                .startDate(query.getStartDate())
                .endDate(query.getEndDate())
                .avgTempCelsius(query.getAvgTempCelsius())
                .minTempCelsius(query.getMinTempCelsius())
                .maxTempCelsius(query.getMaxTempCelsius())
                .avgPrecipitation(query.getAvgPrecipitation())
                .avgWindSpeed(query.getAvgWindSpeed())
                .userNotes(query.getUserNotes())
                .createdAt(query.getCreatedAt())
                .updatedAt(query.getUpdatedAt())
                .weatherRecords(recordDTOs)
                .build();
    }

    private WeatherRecordDTO toRecordDTO(WeatherRecord r) {
        return WeatherRecordDTO.builder()
                .id(r.getId())
                .recordDate(r.getRecordDate())
                .tempMaxCelsius(r.getTempMaxCelsius())
                .tempMinCelsius(r.getTempMinCelsius())
                .precipitationMm(r.getPrecipitationMm())
                .windSpeedKmh(r.getWindSpeedKmh())
                .windDirection(r.getWindDirection())
                .weatherCode(r.getWeatherCode())
                .weatherDescription(describeWeatherCode(r.getWeatherCode()))
                .sunrise(r.getSunrise())
                .sunset(r.getSunset())
                .build();
    }

    private String describeWeatherCode(Short code) {
        if (code == null) return "Unknown";
        int c = code;
        if (c == 0) return "Clear sky";
        if (c == 1) return "Mainly clear";
        if (c == 2) return "Partly cloudy";
        if (c == 3) return "Overcast";
        if (c >= 45 && c <= 48) return "Foggy";
        if (c >= 51 && c <= 55) return "Drizzle";
        if (c >= 56 && c <= 57) return "Freezing drizzle";
        if (c >= 61 && c <= 65) return "Rain";
        if (c >= 66 && c <= 67) return "Freezing rain";
        if (c >= 71 && c <= 77) return "Snow";
        if (c >= 80 && c <= 82) return "Rain showers";
        if (c >= 85 && c <= 86) return "Snow showers";
        if (c >= 95 && c <= 99) return "Thunderstorm";
        return "Unknown";
    }
}
