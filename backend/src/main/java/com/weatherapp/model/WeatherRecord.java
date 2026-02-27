package com.weatherapp.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "weather_records",
        uniqueConstraints = @UniqueConstraint(columnNames = {"query_id", "record_date"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "query_id", nullable = false)
    private HistoricalQuery query;

    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate;

    @Column(name = "temp_max_celsius", precision = 5, scale = 2)
    private BigDecimal tempMaxCelsius;

    @Column(name = "temp_min_celsius", precision = 5, scale = 2)
    private BigDecimal tempMinCelsius;

    @Column(name = "precipitation_mm", precision = 6, scale = 2)
    private BigDecimal precipitationMm;

    @Column(name = "wind_speed_kmh", precision = 5, scale = 2)
    private BigDecimal windSpeedKmh;

    @Column(name = "wind_direction")
    private Short windDirection;

    @Column(name = "weather_code")
    private Short weatherCode;

    @Column(name = "sunrise")
    private LocalTime sunrise;

    @Column(name = "sunset")
    private LocalTime sunset;
}
