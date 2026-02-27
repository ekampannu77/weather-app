package com.weatherapp.service;

import com.weatherapp.dto.ClothingSuggestionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ClothingSuggestionService {

    private final WeatherService weatherService;

    public ClothingSuggestionResponse getSuggestion(String query) {
        Map<String, Object> weather = weatherService.getCurrentWeather(query);

        double temp       = getDouble(weather, "main", "temp");
        double feelsLike  = getDouble(weather, "main", "feels_like");
        double humidity   = getDouble(weather, "main", "humidity");
        double windSpeed  = getDouble(weather, "wind", "speed") * 3.6; // m/s → km/h
        int    weatherId  = getWeatherId(weather);
        boolean isRaining = weatherId >= 300 && weatherId < 700;
        boolean isSnowing = weatherId >= 600 && weatherId < 700;
        boolean isClear   = weatherId == 800;
        boolean isFoggy   = weatherId >= 700 && weatherId < 800;
        boolean isThunder = weatherId >= 200 && weatherId < 300;

        List<String> outerwear   = new ArrayList<>();
        List<String> topLayer    = new ArrayList<>();
        List<String> bottoms     = new ArrayList<>();
        List<String> footwear    = new ArrayList<>();
        List<String> accessories = new ArrayList<>();
        List<String> tips        = new ArrayList<>();

        String comfortLevel;
        String weatherEmoji;
        String outfitSummary;
        String activityAdvice;

        // ── Temperature-based clothing ──────────────────────────────────────

        if (temp < -15) {
            comfortLevel  = "Extreme Cold";
            weatherEmoji  = "🥶";
            outfitSummary = "Extreme cold — cover every inch of skin!";
            outerwear.add("Heavy insulated parka (rated for -20°C or below)");
            outerwear.add("Waterproof shell jacket over parka");
            topLayer.add("Thermal base layer (top)");
            topLayer.add("Thick wool or fleece mid-layer");
            topLayer.add("Heavy knit sweater");
            bottoms.add("Thermal base layer (bottoms)");
            bottoms.add("Insulated snow pants or heavy wool trousers");
            footwear.add("Insulated waterproof winter boots (rated -30°C)");
            footwear.add("Thick thermal wool socks");
            accessories.add("Balaclava or face mask");
            accessories.add("Fleece-lined hat covering ears");
            accessories.add("Insulated gloves or mittens");
            accessories.add("Scarf or neck gaiter");
            tips.add("Exposed skin can get frostbite in minutes — keep it covered");
            tips.add("Layer up: base layer wicks moisture, mid layer insulates, outer layer blocks wind");
            activityAdvice = "Limit outdoor exposure. If you must be outside, plan for short trips and warm up indoors frequently.";

        } else if (temp < -5) {
            comfortLevel  = "Very Cold";
            weatherEmoji  = "🧊";
            outfitSummary = "Very cold outside — full winter gear needed.";
            outerwear.add("Heavy winter coat or parka");
            topLayer.add("Thermal undershirt");
            topLayer.add("Fleece or wool sweater");
            bottoms.add("Thermal leggings under jeans or wool trousers");
            footwear.add("Insulated waterproof winter boots");
            footwear.add("Warm wool socks");
            accessories.add("Winter hat (covering ears)");
            accessories.add("Warm gloves");
            accessories.add("Scarf");
            tips.add("Dress in layers so you can adjust indoors");
            tips.add("Hand warmers in pockets are a great idea");
            activityAdvice = "Good for skating, skiing, or winter walks — just stay dry and layered.";

        } else if (temp < 5) {
            comfortLevel  = "Cold";
            weatherEmoji  = "🌨️";
            outfitSummary = "Cold day — a proper coat and layers are a must.";
            outerwear.add("Winter coat (wool, down, or padded)");
            topLayer.add("Long-sleeve shirt or light thermal");
            topLayer.add("Sweater or hoodie");
            bottoms.add("Jeans or thick trousers");
            footwear.add("Ankle or knee-high boots");
            footwear.add("Warm socks");
            accessories.add("Beanie or warm hat");
            accessories.add("Light gloves");
            accessories.add("Scarf");
            tips.add("You'll warm up once you start moving, so avoid over-dressing");
            activityAdvice = "Comfortable for sightseeing or outdoor walks if you're dressed properly.";

        } else if (temp < 12) {
            comfortLevel  = "Cool";
            weatherEmoji  = "🍂";
            outfitSummary = "Cool and crisp — a jacket will keep you comfortable.";
            outerwear.add("Light-to-medium jacket (denim, bomber, or light wool)");
            topLayer.add("Long-sleeve shirt or light sweater");
            bottoms.add("Jeans or chinos");
            footwear.add("Sneakers or ankle boots");
            footwear.add("Normal socks");
            accessories.add("Light scarf (optional)");
            tips.add("Perfect layering weather — easy to add or remove a layer");
            tips.add("Mornings and evenings will feel noticeably cooler than midday");
            activityAdvice = "Great for walking tours, outdoor markets, or cycling.";

        } else if (temp < 18) {
            comfortLevel  = "Mild";
            weatherEmoji  = "🌤️";
            outfitSummary = "Mild and pleasant — light layers are ideal.";
            outerwear.add("Light jacket or cardigan (keep one handy)");
            topLayer.add("T-shirt or light long-sleeve");
            bottoms.add("Jeans, chinos, or a light skirt");
            footwear.add("Sneakers, loafers, or light boots");
            tips.add("You may not need the jacket during midday — keep it in your bag");
            activityAdvice = "Perfect weather for any outdoor activity — hiking, exploring, or dining al fresco.";

        } else if (temp < 24) {
            comfortLevel  = "Comfortable";
            weatherEmoji  = "😎";
            outfitSummary = "Lovely and comfortable — enjoy it!";
            topLayer.add("T-shirt or light blouse");
            topLayer.add("Short-sleeve shirt or polo");
            bottoms.add("Shorts, light trousers, or a sundress");
            footwear.add("Sneakers, sandals, or flats");
            accessories.add("Sunglasses");
            tips.add("Great weather to be outdoors — no heavy clothing needed");
            activityAdvice = "Ideal for all outdoor activities — beaches, parks, city walks, or sightseeing.";

        } else if (temp < 30) {
            comfortLevel  = "Warm";
            weatherEmoji  = "☀️";
            outfitSummary = "Warm day — keep it light and breathable.";
            topLayer.add("Lightweight t-shirt or tank top");
            topLayer.add("Breathable linen or cotton shirt");
            bottoms.add("Shorts or a light summer dress/skirt");
            footwear.add("Sandals, flip-flops, or light sneakers");
            accessories.add("Sunglasses");
            accessories.add("Cap or wide-brim hat");
            tips.add("Wear light, breathable fabrics like cotton or linen");
            tips.add("Stay in the shade during peak sun hours (11am–3pm)");
            activityAdvice = "Perfect for beaches or outdoor cafes. Stay hydrated!";

        } else {
            comfortLevel  = "Very Hot";
            weatherEmoji  = "🔥";
            outfitSummary = "Very hot — stay cool and protect yourself from the sun.";
            topLayer.add("Ultra-light tank top or moisture-wicking t-shirt");
            topLayer.add("Loose, breathable linen shirt");
            bottoms.add("Shorts or a light flowing dress/skirt");
            footwear.add("Sandals or breathable mesh sneakers");
            accessories.add("Wide-brim hat or cap — essential");
            accessories.add("UV-protection sunglasses");
            accessories.add("Sunscreen SPF 50+");
            tips.add("Avoid dark colors — they absorb heat");
            tips.add("Carry a reusable water bottle and drink every 20–30 minutes");
            tips.add("Avoid outdoor exertion between 11am–3pm");
            activityAdvice = "Plan outdoor activities for early morning or evening. Seek shade and AC midday.";
        }

        // ── Weather condition overrides ──────────────────────────────────────

        if (isRaining && !isSnowing) {
            if (!outerwear.contains("Waterproof rain jacket")) {
                outerwear.add(0, "Waterproof rain jacket or poncho");
            }
            footwear.clear();
            footwear.add("Waterproof shoes or rain boots");
            accessories.add("Compact travel umbrella");
            tips.add("Avoid suede or canvas shoes — they'll get soaked");
            tips.add("Keep electronics in a waterproof bag or zip-lock");
        }

        if (isSnowing) {
            footwear.clear();
            footwear.add("Waterproof insulated snow boots with grip soles");
            tips.add("Watch for icy patches — grip-sole boots are important");
            tips.add("Waterproof layers are critical — wet snow soaks through quickly");
        }

        if (isThunder) {
            tips.add("⚡ Thunderstorm warning — avoid open areas, tall trees, and metal objects");
            tips.add("Stay indoors if possible until the storm passes");
            activityAdvice = "Postpone outdoor plans until the storm clears. Stay indoors.";
        }

        if (isFoggy) {
            accessories.add("Bright or reflective clothing if walking near roads");
            tips.add("Visibility is low — wear bright colors if you're near traffic");
        }

        if (windSpeed > 40) {
            if (outerwear.isEmpty()) outerwear.add("Windproof jacket");
            else outerwear.add(0, "Windproof layer over your jacket");
            accessories.add("Secure hat (wind can blow it away)");
            tips.add("Strong winds — secure loose items and hold onto your hat!");
        } else if (windSpeed > 25 && temp > 15) {
            outerwear.add("Light windbreaker");
            tips.add("It's breezy — a windbreaker will make a big difference");
        }

        if (humidity > 80 && temp > 20) {
            tips.add("High humidity makes it feel hotter — wear moisture-wicking fabrics");
            tips.add("Avoid tight-fitting synthetic fabrics that trap heat");
        }

        if (isClear && temp > 18) {
            if (!accessories.contains("Sunglasses")) accessories.add("Sunglasses");
            if (temp > 22) accessories.add("Sunscreen SPF 30+");
        }

        // Feels-like note
        String temperatureFeels;
        double diff = feelsLike - temp;
        if (diff <= -3) {
            temperatureFeels = String.format("%.0f°C but feels like %.0f°C due to wind chill — dress warmer than the number suggests", temp, feelsLike);
        } else if (diff >= 3) {
            temperatureFeels = String.format("%.0f°C but feels like %.0f°C due to humidity — it'll feel stickier than expected", temp, feelsLike);
        } else {
            temperatureFeels = String.format("%.0f°C — feels about right outside", temp);
        }

        return ClothingSuggestionResponse.builder()
                .outfitSummary(outfitSummary)
                .comfortLevel(comfortLevel)
                .weatherEmoji(weatherEmoji)
                .temperatureFeels(temperatureFeels)
                .outerwear(outerwear)
                .topLayer(topLayer)
                .bottoms(bottoms)
                .footwear(footwear)
                .accessories(accessories)
                .tips(tips)
                .activityAdvice(activityAdvice)
                .build();
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    @SuppressWarnings("unchecked")
    private double getDouble(Map<String, Object> data, String section, String key) {
        try {
            Map<String, Object> sub = (Map<String, Object>) data.get(section);
            if (sub == null) return 0;
            Object val = sub.get(key);
            if (val instanceof Number) return ((Number) val).doubleValue();
        } catch (Exception ignored) {}
        return 0;
    }

    @SuppressWarnings("unchecked")
    private int getWeatherId(Map<String, Object> data) {
        try {
            List<Map<String, Object>> list = (List<Map<String, Object>>) data.get("weather");
            if (list != null && !list.isEmpty()) {
                Object id = list.get(0).get("id");
                if (id instanceof Number) return ((Number) id).intValue();
            }
        } catch (Exception ignored) {}
        return 800;
    }
}
