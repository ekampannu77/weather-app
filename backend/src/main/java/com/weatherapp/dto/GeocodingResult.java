package com.weatherapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeocodingResult {
    private String name;
    private BigDecimal lat;
    private BigDecimal lon;
    private String country;
    private String state;

    public String getDisplayName() {
        if (state != null && !state.isEmpty()) {
            return name + ", " + state + ", " + country;
        }
        return name + ", " + country;
    }
}
