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

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeocodingService {

    private final WebClient.Builder webClientBuilder;

    @Value("${owm.api.key}")
    private String owmApiKey;

    @Value("${owm.base.url}")
    private String owmBaseUrl;

    private static final Pattern US_ZIP_PATTERN    = Pattern.compile("^\\d{5}(-\\d{4})?$");
    private static final Pattern CA_POSTAL_PATTERN  = Pattern.compile("^[A-Za-z]\\d[A-Za-z]\\s?\\d[A-Za-z]\\d$");
    private static final Pattern UK_POSTAL_PATTERN  = Pattern.compile("^[A-Za-z]{1,2}\\d{1,2}[A-Za-z]?\\s?\\d[A-Za-z]{2}$");
    private static final Pattern COORDS_PATTERN     = Pattern.compile("^-?\\d+(\\.\\d+)?,\\s*-?\\d+(\\.\\d+)?$");

    public GeocodingResult resolveLocation(String input) {
        if (input == null || input.isBlank()) {
            throw new LocationNotFoundException("Location input cannot be empty");
        }

        String trimmed = input.trim();

        if (COORDS_PATTERN.matcher(trimmed).matches()) {
            return resolveFromCoords(trimmed);
        }
        if (US_ZIP_PATTERN.matcher(trimmed).matches()) {
            return resolveFromPostalCode(trimmed, "US");
        }
        if (CA_POSTAL_PATTERN.matcher(trimmed).matches()) {
            return resolveFromPostalCode(trimmed.replace(" ", ""), "CA");
        }
        if (UK_POSTAL_PATTERN.matcher(trimmed).matches()) {
            return resolveFromPostalCode(trimmed.replace(" ", ""), "GB");
        }
        return resolveFromName(trimmed);
    }

    private GeocodingResult resolveFromCoords(String coords) {
        String[] parts = coords.split(",");
        BigDecimal lat = new BigDecimal(parts[0].trim());
        BigDecimal lon = new BigDecimal(parts[1].trim());

        // Reverse geocode to get city name
        try {
            List<Map> results = webClientBuilder.build()
                    .get()
                    .uri(owmBaseUrl + "/geo/1.0/reverse?lat={lat}&lon={lon}&limit=1&appid={key}",
                            lat, lon, owmApiKey)
                    .retrieve()
                    .bodyToFlux(Map.class)
                    .collectList()
                    .block();

            if (results != null && !results.isEmpty()) {
                Map<String, Object> r = results.get(0);
                return GeocodingResult.builder()
                        .name(getString(r, "name"))
                        .lat(lat)
                        .lon(lon)
                        .country(getString(r, "country"))
                        .state(getString(r, "state"))
                        .build();
            }
        } catch (WebClientResponseException e) {
            log.warn("Reverse geocoding failed for coords {}: {}", coords, e.getMessage());
        }

        return GeocodingResult.builder()
                .name("Custom Location")
                .lat(lat)
                .lon(lon)
                .country("Unknown")
                .build();
    }

    private GeocodingResult resolveFromPostalCode(String postalCode, String countryCode) {
        try {
            Map result = webClientBuilder.build()
                    .get()
                    .uri(owmBaseUrl + "/geo/1.0/zip?zip={zip},{country}&appid={key}",
                            postalCode, countryCode, owmApiKey)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (result != null) {
                return GeocodingResult.builder()
                        .name(getString(result, "name"))
                        .lat(getBigDecimal(result, "lat"))
                        .lon(getBigDecimal(result, "lon"))
                        .country(getString(result, "country"))
                        .build();
            }
        } catch (WebClientResponseException e) {
            if (e.getStatusCode().value() == 404) {
                // Fall through to name-based search as fallback
                log.warn("Postal code {} not found via zip endpoint, trying name search", postalCode);
                return resolveFromName(postalCode + ", " + countryCode);
            }
            throw new ExternalApiException("Geocoding API error: " + e.getMessage());
        }
        throw new LocationNotFoundException("Could not resolve postal code: " + postalCode);
    }

    private GeocodingResult resolveFromName(String name) {
        try {
            List<Map> results = webClientBuilder.build()
                    .get()
                    .uri(owmBaseUrl + "/geo/1.0/direct?q={q}&limit=5&appid={key}", name, owmApiKey)
                    .retrieve()
                    .bodyToFlux(Map.class)
                    .collectList()
                    .block();

            if (results == null || results.isEmpty()) {
                throw new LocationNotFoundException("Location not found: \"" + name + "\". Please try a different city name, ZIP code, or coordinates.");
            }

            Map<String, Object> r = results.get(0);
            return GeocodingResult.builder()
                    .name(getString(r, "name"))
                    .lat(getBigDecimal(r, "lat"))
                    .lon(getBigDecimal(r, "lon"))
                    .country(getString(r, "country"))
                    .state(getString(r, "state"))
                    .build();

        } catch (LocationNotFoundException e) {
            throw e;
        } catch (WebClientResponseException e) {
            throw new ExternalApiException("Geocoding API error: " + e.getMessage());
        } catch (Exception e) {
            throw new ExternalApiException("Failed to connect to geocoding service: " + e.getMessage());
        }
    }

    private String getString(Map<String, Object> map, String key) {
        Object val = map.get(key);
        return val != null ? val.toString() : null;
    }

    private BigDecimal getBigDecimal(Map<String, Object> map, String key) {
        Object val = map.get(key);
        if (val == null) return null;
        if (val instanceof Number) return BigDecimal.valueOf(((Number) val).doubleValue());
        return new BigDecimal(val.toString());
    }
}
