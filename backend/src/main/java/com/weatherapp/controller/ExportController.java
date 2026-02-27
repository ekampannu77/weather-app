package com.weatherapp.controller;

import com.weatherapp.exception.ResourceNotFoundException;
import com.weatherapp.model.HistoricalQuery;
import com.weatherapp.repository.HistoricalQueryRepository;
import com.weatherapp.service.ExportService;
import com.weatherapp.service.HistoricalQueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/export")
@RequiredArgsConstructor
@Tag(name = "Export", description = "Export weather data in multiple formats")
public class ExportController {

    private final ExportService exportService;
    private final HistoricalQueryService queryService;
    private final HistoricalQueryRepository queryRepository;

    @GetMapping
    @Operation(summary = "Export all queries", description = "Format: json, csv, xml, pdf, markdown")
    public ResponseEntity<byte[]> exportAll(@RequestParam(defaultValue = "json") String format) {
        List<HistoricalQuery> queries = queryService.getAllForExport();
        return buildResponse(queries, format, "weather-queries-all");
    }

    @GetMapping("/{id}")
    @Operation(summary = "Export a single query by ID")
    public ResponseEntity<byte[]> exportById(
            @PathVariable Long id,
            @RequestParam(defaultValue = "json") String format) {
        HistoricalQuery query = queryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Query not found with id: " + id));
        return buildResponse(List.of(query), format, "weather-query-" + id);
    }

    private ResponseEntity<byte[]> buildResponse(List<HistoricalQuery> queries, String format, String filenameBase) {
        byte[] data;
        MediaType mediaType;
        String extension;

        switch (format.toLowerCase()) {
            case "csv" -> {
                data = exportService.exportAsCsv(queries);
                mediaType = MediaType.parseMediaType("text/csv");
                extension = "csv";
            }
            case "xml" -> {
                data = exportService.exportAsXml(queries);
                mediaType = MediaType.APPLICATION_XML;
                extension = "xml";
            }
            case "pdf" -> {
                data = exportService.exportAsPdf(queries);
                mediaType = MediaType.APPLICATION_PDF;
                extension = "pdf";
            }
            case "markdown", "md" -> {
                data = exportService.exportAsMarkdown(queries);
                mediaType = MediaType.parseMediaType("text/markdown");
                extension = "md";
            }
            default -> {
                data = exportService.exportAsJson(queries);
                mediaType = MediaType.APPLICATION_JSON;
                extension = "json";
            }
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename(filenameBase + "." + extension)
                .build());

        return ResponseEntity.ok()
                .headers(headers)
                .body(data);
    }
}
