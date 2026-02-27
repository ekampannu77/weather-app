package com.weatherapp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class GoogleMapsService {

    @Value("${googlemaps.api.key}")
    private String mapsApiKey;

    @Value("${googlemaps.embed.base.url}")
    private String embedBaseUrl;

    public Map<String, String> getEmbedUrl(double lat, double lon, int zoom) {
        String embedUrl = embedBaseUrl + "/view?key=" + mapsApiKey
                + "&center=" + lat + "," + lon
                + "&zoom=" + zoom
                + "&maptype=roadmap";
        return Map.of("embedUrl", embedUrl);
    }

    public Map<String, String> getPlaceEmbedUrl(String locationName) {
        String encodedLocation = locationName.replace(" ", "+");
        String embedUrl = embedBaseUrl + "/place?key=" + mapsApiKey
                + "&q=" + encodedLocation;
        return Map.of("embedUrl", embedUrl);
    }
}
