package com.weatherapp.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.opencsv.CSVWriter;
import com.weatherapp.model.HistoricalQuery;
import com.weatherapp.model.WeatherRecord;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExportService {

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
            .enable(SerializationFeature.INDENT_OUTPUT);

    public byte[] exportAsJson(List<HistoricalQuery> queries) {
        try {
            return objectMapper.writeValueAsBytes(queries.stream()
                    .map(this::toExportMap)
                    .toList());
        } catch (Exception e) {
            throw new RuntimeException("Failed to export as JSON", e);
        }
    }

    public byte[] exportAsCsv(List<HistoricalQuery> queries) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             CSVWriter writer = new CSVWriter(new OutputStreamWriter(baos, StandardCharsets.UTF_8))) {

            writer.writeNext(new String[]{
                    "ID", "Location", "Country", "Latitude", "Longitude",
                    "Start Date", "End Date",
                    "Avg Temp (°C)", "Min Temp (°C)", "Max Temp (°C)",
                    "Avg Precipitation (mm)", "Avg Wind Speed (km/h)",
                    "Notes", "Created At"
            });

            for (HistoricalQuery q : queries) {
                writer.writeNext(new String[]{
                        str(q.getId()),
                        q.getDisplayName(),
                        str(q.getResolvedCountry()),
                        str(q.getLatitude()),
                        str(q.getLongitude()),
                        str(q.getStartDate()),
                        str(q.getEndDate()),
                        str(q.getAvgTempCelsius()),
                        str(q.getMinTempCelsius()),
                        str(q.getMaxTempCelsius()),
                        str(q.getAvgPrecipitation()),
                        str(q.getAvgWindSpeed()),
                        str(q.getUserNotes()),
                        str(q.getCreatedAt())
                });
            }
            writer.flush();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to export as CSV", e);
        }
    }

    public byte[] exportAsXml(List<HistoricalQuery> queries) {
        StringBuilder sb = new StringBuilder();
        sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        sb.append("<weatherQueries>\n");

        for (HistoricalQuery q : queries) {
            sb.append("  <query>\n");
            appendXml(sb, "id", q.getId());
            appendXml(sb, "location", q.getDisplayName());
            appendXml(sb, "latitude", q.getLatitude());
            appendXml(sb, "longitude", q.getLongitude());
            appendXml(sb, "startDate", q.getStartDate());
            appendXml(sb, "endDate", q.getEndDate());
            appendXml(sb, "avgTempCelsius", q.getAvgTempCelsius());
            appendXml(sb, "minTempCelsius", q.getMinTempCelsius());
            appendXml(sb, "maxTempCelsius", q.getMaxTempCelsius());
            appendXml(sb, "avgPrecipitationMm", q.getAvgPrecipitation());
            appendXml(sb, "avgWindSpeedKmh", q.getAvgWindSpeed());
            appendXml(sb, "notes", q.getUserNotes());
            appendXml(sb, "createdAt", q.getCreatedAt());

            if (!q.getWeatherRecords().isEmpty()) {
                sb.append("    <dailyRecords>\n");
                for (WeatherRecord r : q.getWeatherRecords()) {
                    sb.append("      <record>\n");
                    appendXml(sb, "date", r.getRecordDate(), 8);
                    appendXml(sb, "tempMax", r.getTempMaxCelsius(), 8);
                    appendXml(sb, "tempMin", r.getTempMinCelsius(), 8);
                    appendXml(sb, "precipitation", r.getPrecipitationMm(), 8);
                    appendXml(sb, "windSpeed", r.getWindSpeedKmh(), 8);
                    sb.append("      </record>\n");
                }
                sb.append("    </dailyRecords>\n");
            }
            sb.append("  </query>\n");
        }

        sb.append("</weatherQueries>\n");
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    public byte[] exportAsPdf(List<HistoricalQuery> queries) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, BaseColor.DARK_GRAY);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.WHITE);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 8, BaseColor.BLACK);

            Paragraph title = new Paragraph("Weather Query History - PM Accelerator Weather App", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            PdfPTable table = new PdfPTable(9);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{3f, 2f, 2f, 1.5f, 1.5f, 1.5f, 1.5f, 1.5f, 2f});

            String[] headers = {"Location", "Start Date", "End Date",
                    "Avg °C", "Min °C", "Max °C", "Precip (mm)", "Wind (km/h)", "Created"};

            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
                cell.setBackgroundColor(new BaseColor(52, 73, 94));
                cell.setPadding(5);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);
            }

            for (HistoricalQuery q : queries) {
                addPdfCell(table, q.getDisplayName(), bodyFont);
                addPdfCell(table, str(q.getStartDate()), bodyFont);
                addPdfCell(table, str(q.getEndDate()), bodyFont);
                addPdfCell(table, str(q.getAvgTempCelsius()), bodyFont);
                addPdfCell(table, str(q.getMinTempCelsius()), bodyFont);
                addPdfCell(table, str(q.getMaxTempCelsius()), bodyFont);
                addPdfCell(table, str(q.getAvgPrecipitation()), bodyFont);
                addPdfCell(table, str(q.getAvgWindSpeed()), bodyFont);
                addPdfCell(table, q.getCreatedAt() != null ? q.getCreatedAt().toLocalDate().toString() : "", bodyFont);
            }

            document.add(table);
            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to export as PDF", e);
        }
    }

    public byte[] exportAsMarkdown(List<HistoricalQuery> queries) {
        StringBuilder sb = new StringBuilder();
        sb.append("# Weather Query History\n\n");
        sb.append("Generated by **PM Accelerator Weather App**\n\n");
        sb.append("---\n\n");

        sb.append("| Location | Start Date | End Date | Avg °C | Min °C | Max °C | Precip (mm) | Wind (km/h) |\n");
        sb.append("|----------|-----------|----------|--------|--------|--------|-------------|-------------|\n");

        for (HistoricalQuery q : queries) {
            sb.append(String.format("| %s | %s | %s | %s | %s | %s | %s | %s |\n",
                    escape(q.getDisplayName()),
                    str(q.getStartDate()),
                    str(q.getEndDate()),
                    str(q.getAvgTempCelsius()),
                    str(q.getMinTempCelsius()),
                    str(q.getMaxTempCelsius()),
                    str(q.getAvgPrecipitation()),
                    str(q.getAvgWindSpeed())
            ));
        }

        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    // ---- helpers ----

    private java.util.Map<String, Object> toExportMap(HistoricalQuery q) {
        java.util.Map<String, Object> map = new java.util.LinkedHashMap<>();
        map.put("id", q.getId());
        map.put("location", q.getDisplayName());
        map.put("latitude", q.getLatitude());
        map.put("longitude", q.getLongitude());
        map.put("startDate", str(q.getStartDate()));
        map.put("endDate", str(q.getEndDate()));
        map.put("avgTempCelsius", q.getAvgTempCelsius());
        map.put("minTempCelsius", q.getMinTempCelsius());
        map.put("maxTempCelsius", q.getMaxTempCelsius());
        map.put("avgPrecipitationMm", q.getAvgPrecipitation());
        map.put("avgWindSpeedKmh", q.getAvgWindSpeed());
        map.put("userNotes", q.getUserNotes());
        map.put("createdAt", str(q.getCreatedAt()));
        return map;
    }

    private void addPdfCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text != null ? text : "", font));
        cell.setPadding(4);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);
    }

    private void appendXml(StringBuilder sb, String tag, Object value) {
        appendXml(sb, tag, value, 4);
    }

    private void appendXml(StringBuilder sb, String tag, Object value, int indent) {
        String spaces = " ".repeat(indent);
        sb.append(spaces).append("<").append(tag).append(">")
          .append(value != null ? escapeXml(value.toString()) : "")
          .append("</").append(tag).append(">\n");
    }

    private String escapeXml(String s) {
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }

    private String escape(String s) {
        if (s == null) return "";
        return s.replace("|", "\\|");
    }

    private String str(Object obj) {
        return obj != null ? obj.toString() : "";
    }
}
