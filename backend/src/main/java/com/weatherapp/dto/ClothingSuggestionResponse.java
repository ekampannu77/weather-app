package com.weatherapp.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ClothingSuggestionResponse {
    private String outfitSummary;
    private String comfortLevel;
    private String weatherEmoji;
    private String temperatureFeels;
    private List<String> outerwear;
    private List<String> topLayer;
    private List<String> bottoms;
    private List<String> footwear;
    private List<String> accessories;
    private List<String> tips;
    private String activityAdvice;
}
