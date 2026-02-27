package com.weatherapp.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateQueryRequest {
    private String inputLocation;
    private LocalDate startDate;
    private LocalDate endDate;
    private String userNotes;
}
