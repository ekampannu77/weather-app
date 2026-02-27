package com.weatherapp.dto;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Builder
public class ApiErrorResponse {
    private int status;
    private String error;
    private String message;
    private String path;
    private OffsetDateTime timestamp;
}
