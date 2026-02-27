package com.weatherapp.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

@Data
@Builder
public class HistoricalQueryResponse {
    private Long id;
    private String inputLocation;
    private String displayName;
    private String resolvedCity;
    private String resolvedCountry;
    private String resolvedState;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal avgTempCelsius;
    private BigDecimal minTempCelsius;
    private BigDecimal maxTempCelsius;
    private BigDecimal avgPrecipitation;
    private BigDecimal avgWindSpeed;
    private String userNotes;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private List<WeatherRecordDTO> weatherRecords;
}
