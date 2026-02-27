package com.weatherapp.controller;

import com.weatherapp.dto.HistoricalQueryRequest;
import com.weatherapp.dto.HistoricalQueryResponse;
import com.weatherapp.dto.UpdateQueryRequest;
import com.weatherapp.service.HistoricalQueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/queries")
@RequiredArgsConstructor
@Tag(name = "Historical Queries", description = "CRUD operations for weather queries with database persistence")
public class HistoricalQueryController {

    private final HistoricalQueryService queryService;

    @PostMapping
    @Operation(summary = "Create a new weather query",
               description = "Validates location + date range, fetches historical data from Open-Meteo, stores in DB")
    public ResponseEntity<HistoricalQueryResponse> create(@Valid @RequestBody HistoricalQueryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(queryService.createQuery(request));
    }

    @GetMapping
    @Operation(summary = "Get all stored weather queries (paginated)")
    public ResponseEntity<Page<HistoricalQueryResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String city) {
        return ResponseEntity.ok(queryService.getAllQueries(page, size, city));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a single query with all daily weather records")
    public ResponseEntity<HistoricalQueryResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(queryService.getQueryById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a stored query",
               description = "If location or dates change, re-validates and re-fetches weather data")
    public ResponseEntity<HistoricalQueryResponse> update(
            @PathVariable Long id,
            @RequestBody UpdateQueryRequest request) {
        return ResponseEntity.ok(queryService.updateQuery(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a single query")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        queryService.deleteQuery(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    @Operation(summary = "Delete all queries (requires confirmation header)")
    public ResponseEntity<Void> deleteAll(
            @RequestHeader(value = "X-Confirm-Delete", defaultValue = "false") boolean confirm) {
        if (!confirm) {
            return ResponseEntity.badRequest().build();
        }
        queryService.deleteAllQueries();
        return ResponseEntity.noContent().build();
    }
}
