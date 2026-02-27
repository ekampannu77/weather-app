package com.weatherapp.controller;

import com.weatherapp.dto.YouTubeVideoResult;
import com.weatherapp.service.GoogleMapsService;
import com.weatherapp.service.YouTubeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/media")
@RequiredArgsConstructor
@Tag(name = "Media", description = "YouTube and Google Maps integration")
public class MediaController {

    private final YouTubeService youTubeService;
    private final GoogleMapsService googleMapsService;

    @GetMapping("/youtube")
    @Operation(summary = "Search YouTube videos for a location")
    public ResponseEntity<List<YouTubeVideoResult>> searchYouTube(
            @RequestParam String location,
            @RequestParam(defaultValue = "4") int maxResults) {
        return ResponseEntity.ok(youTubeService.searchVideos(location, maxResults));
    }

    @GetMapping("/maps/embed-url")
    @Operation(summary = "Get Google Maps embed URL for coordinates (API key stays server-side)")
    public ResponseEntity<Map<String, String>> getMapsEmbedUrl(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "12") int zoom) {
        return ResponseEntity.ok(googleMapsService.getEmbedUrl(lat, lon, zoom));
    }

    @GetMapping("/maps/place-embed-url")
    @Operation(summary = "Get Google Maps embed URL for a place name")
    public ResponseEntity<Map<String, String>> getMapsPlaceEmbedUrl(@RequestParam String location) {
        return ResponseEntity.ok(googleMapsService.getPlaceEmbedUrl(location));
    }
}
