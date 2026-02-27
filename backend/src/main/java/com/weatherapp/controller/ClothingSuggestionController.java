package com.weatherapp.controller;

import com.weatherapp.dto.ClothingSuggestionResponse;
import com.weatherapp.service.ClothingSuggestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/suggestions")
@RequiredArgsConstructor
@Tag(name = "Clothing Suggestions", description = "AI-powered outfit recommendations based on current weather")
public class ClothingSuggestionController {

    private final ClothingSuggestionService clothingSuggestionService;

    @GetMapping("/clothing")
    @Operation(summary = "Get clothing suggestions for a location",
               description = "Analyzes current weather conditions (temp, wind, rain, humidity) and recommends what to wear")
    public ResponseEntity<ClothingSuggestionResponse> getClothingSuggestion(@RequestParam String q) {
        return ResponseEntity.ok(clothingSuggestionService.getSuggestion(q));
    }
}
