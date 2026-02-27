package com.weatherapp.service;

import com.weatherapp.dto.GeocodingResult;
import com.weatherapp.exception.ExternalApiException;
import com.weatherapp.exception.LocationNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class WeatherService {

    private final WebClient.Builder webClientBuilder;
    private final GeocodingService geocodingService;

    @Value("${owm.api.key}")
    private String owmApiKey;

    @Value("${owm.base.url}")
    private String owmBaseUrl;

    public Map<String, Object> getCurrentWeather(String query) {
        GeocodingResult geo = geocodingService.resolveLocation(query);
        try {
            Map result = webClientBuilder.build()
                    .get()
                    .uri(owmBaseUrl + "/data/2.5/weather?lat={lat}&lon={lon}&appid={key}&units=metric",
                            geo.getLat(), geo.getLon(), owmApiKey)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (result == null) {
                throw new ExternalApiException("Empty response from weather API");
            }

            // Inject resolved display name
            result.put("resolvedDisplayName", geo.getDisplayName());
            return result;

        } catch (WebClientResponseException e) {
            if (e.getStatusCode().value() == 404) {
                throw new LocationNotFoundException("Weather data not found for: " + query);
            }
            throw new ExternalApiException("Weather API error: " + e.getMessage());
        }
    }

    public Map<String, Object> getForecast(String query) {
        GeocodingResult geo = geocodingService.resolveLocation(query);
        try {
            Map result = webClientBuilder.build()
                    .get()
                    .uri(owmBaseUrl + "/data/2.5/forecast?lat={lat}&lon={lon}&appid={key}&units=metric&cnt=40",
                            geo.getLat(), geo.getLon(), owmApiKey)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (result == null) {
                throw new ExternalApiException("Empty response from forecast API");
            }

            result.put("resolvedDisplayName", geo.getDisplayName());
            return result;

        } catch (WebClientResponseException e) {
            throw new ExternalApiException("Forecast API error: " + e.getMessage());
        }
    }

    public List<Map> geocode(String query) {
        try {
            return webClientBuilder.build()
                    .get()
                    .uri(owmBaseUrl + "/geo/1.0/direct?q={q}&limit=5&appid={key}", query, owmApiKey)
                    .retrieve()
                    .bodyToFlux(Map.class)
                    .collectList()
                    .block();
        } catch (WebClientResponseException e) {
            throw new ExternalApiException("Geocoding API error: " + e.getMessage());
        }
    }
}
