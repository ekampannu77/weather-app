package com.weatherapp.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class YouTubeVideoResult {
    private String videoId;
    private String title;
    private String description;
    private String thumbnail;
    private String channelName;
    private String publishedAt;
    private String watchUrl;
}
