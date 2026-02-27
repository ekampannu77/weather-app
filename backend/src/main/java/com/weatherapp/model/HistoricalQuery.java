package com.weatherapp.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "historical_queries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoricalQuery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "input_location", nullable = false)
    private String inputLocation;

    @Column(name = "resolved_city")
    private String resolvedCity;

    @Column(name = "resolved_country")
    private String resolvedCountry;

    @Column(name = "resolved_state")
    private String resolvedState;

    @Column(name = "latitude", nullable = false, precision = 9, scale = 6)
    private BigDecimal latitude;

    @Column(name = "longitude", nullable = false, precision = 9, scale = 6)
    private BigDecimal longitude;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "avg_temp_celsius", precision = 5, scale = 2)
    private BigDecimal avgTempCelsius;

    @Column(name = "min_temp_celsius", precision = 5, scale = 2)
    private BigDecimal minTempCelsius;

    @Column(name = "max_temp_celsius", precision = 5, scale = 2)
    private BigDecimal maxTempCelsius;

    @Column(name = "avg_precipitation", precision = 6, scale = 2)
    private BigDecimal avgPrecipitation;

    @Column(name = "avg_wind_speed", precision = 5, scale = 2)
    private BigDecimal avgWindSpeed;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "raw_meteo_data", columnDefinition = "jsonb")
    private Map<String, Object> rawMeteoData;

    @Column(name = "user_notes", columnDefinition = "TEXT")
    private String userNotes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "query", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<WeatherRecord> weatherRecords = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
        updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    public String getDisplayName() {
        if (resolvedCity != null && resolvedCountry != null) {
            return resolvedState != null
                    ? resolvedCity + ", " + resolvedState + ", " + resolvedCountry
                    : resolvedCity + ", " + resolvedCountry;
        }
        return inputLocation;
    }
}
