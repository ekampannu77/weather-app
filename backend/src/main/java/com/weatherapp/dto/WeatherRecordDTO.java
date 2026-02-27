package com.weatherapp.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
public class WeatherRecordDTO {
    private Long id;
    private LocalDate recordDate;
    private BigDecimal tempMaxCelsius;
    private BigDecimal tempMinCelsius;
    private BigDecimal precipitationMm;
    private BigDecimal windSpeedKmh;
    private Short windDirection;
    private Short weatherCode;
    private String weatherDescription;
    private LocalTime sunrise;
    private LocalTime sunset;
}
