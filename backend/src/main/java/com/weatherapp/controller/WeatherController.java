package com.weatherapp.controller;

import com.weatherapp.service.WeatherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/weather")
@RequiredArgsConstructor
@Tag(name = "Weather", description = "Real-time weather data endpoints")
public class WeatherController {

    private final WeatherService weatherService;

    @GetMapping("/current")
    @Operation(summary = "Get current weather for a location",
               description = "Accepts city name, ZIP code (US), GPS coordinates (lat,lon), or landmark")
    public ResponseEntity<Map<String, Object>> getCurrentWeather(@RequestParam String q) {
        return ResponseEntity.ok(weatherService.getCurrentWeather(q));
    }

    @GetMapping("/forecast")
    @Operation(summary = "Get 5-day weather forecast for a location")
    public ResponseEntity<Map<String, Object>> getForecast(@RequestParam String q) {
        return ResponseEntity.ok(weatherService.getForecast(q));
    }

    @GetMapping("/geocode")
    @Operation(summary = "Geocode a location query to coordinates")
    public ResponseEntity<List<Map>> geocode(@RequestParam String q) {
        return ResponseEntity.ok(weatherService.geocode(q));
    }
}
