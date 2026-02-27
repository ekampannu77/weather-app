package com.weatherapp.service;

import com.weatherapp.dto.YouTubeVideoResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class YouTubeService {

    private final WebClient.Builder webClientBuilder;

    @Value("${youtube.api.key}")
    private String youtubeApiKey;

    @Value("${youtube.base.url}")
    private String youtubeBaseUrl;

    @SuppressWarnings("unchecked")
    public List<YouTubeVideoResult> searchVideos(String location, int maxResults) {
        try {
            String query = location + " travel weather guide";
            Map response = webClientBuilder.build()
                    .get()
                    .uri(youtubeBaseUrl + "/search?part=snippet&q={q}&type=video" +
                            "&videoEmbeddable=true&maxResults={max}&key={key}",
                            query, maxResults, youtubeApiKey)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response == null) return new ArrayList<>();

            List<Map> items = (List<Map>) response.get("items");
            if (items == null) return new ArrayList<>();

            List<YouTubeVideoResult> results = new ArrayList<>();
            for (Map item : items) {
                Map id = (Map) item.get("id");
                Map snippet = (Map) item.get("snippet");
                if (id == null || snippet == null) continue;

                String videoId = (String) id.get("videoId");
                if (videoId == null) continue;

                Map thumbnails = (Map) snippet.get("thumbnails");
                String thumbnail = "";
                if (thumbnails != null) {
                    Map medium = (Map) thumbnails.get("medium");
                    if (medium != null) thumbnail = (String) medium.getOrDefault("url", "");
                }

                results.add(YouTubeVideoResult.builder()
                        .videoId(videoId)
                        .title((String) snippet.getOrDefault("title", ""))
                        .description((String) snippet.getOrDefault("description", ""))
                        .thumbnail(thumbnail)
                        .channelName((String) snippet.getOrDefault("channelTitle", ""))
                        .publishedAt((String) snippet.getOrDefault("publishedAt", ""))
                        .watchUrl("https://www.youtube.com/watch?v=" + videoId)
                        .build());
            }
            return results;

        } catch (WebClientResponseException e) {
            if (e.getStatusCode().value() == 403) {
                log.warn("YouTube API quota exceeded or forbidden: {}", e.getMessage());
                return new ArrayList<>();
            }
            log.error("YouTube API error: {}", e.getMessage());
            return new ArrayList<>();
        } catch (Exception e) {
            log.error("Unexpected YouTube error: {}", e.getMessage());
            return new ArrayList<>();
        }
    }
}
