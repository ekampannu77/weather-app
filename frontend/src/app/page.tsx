'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/search/SearchBar';
import CurrentWeatherCard from '@/components/weather/CurrentWeatherCard';
import FiveDayForecast from '@/components/weather/FiveDayForecast';
import GoogleMapEmbed from '@/components/location/GoogleMapEmbed';
import YouTubePanel from '@/components/location/YouTubePanel';
import ClothingSuggestion from '@/components/weather/ClothingSuggestion';
import TemperatureTrendChart from '@/components/weather/TemperatureTrendChart';
import ErrorAlert from '@/components/ui/ErrorAlert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import WeatherBackground from '@/components/ui/WeatherBackground';
import { useCurrentWeather } from '@/hooks/useCurrentWeather';
import { useForecast } from '@/hooks/useForecast';
import { groupForecastByDay } from '@/lib/utils';

export default function Home() {
  const [query, setQuery] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lastCity');
    if (saved) setQuery(saved);
  }, []);

  const weatherQuery = useCurrentWeather(query);
  const forecastQuery = useForecast(query);

  const handleSearch = (q: string) => {
    setQuery(q);
    localStorage.setItem('lastCity', q);
  };

  const isLoading = weatherQuery.isLoading || forecastQuery.isLoading;
  const error = weatherQuery.error || forecastQuery.error;
  const weatherId = weatherQuery.data?.weather?.[0]?.id;

  return (
    <div className="space-y-6">
      {/* Animated weather background — fixed behind everything */}
      <WeatherBackground weatherId={weatherId} />

      {/* Hero / Search */}
      <div className="text-center py-8">
        <div className="inline-block w-full max-w-2xl mx-auto px-8 py-8 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-md shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            ⛅ Real-Time Weather
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Search by city, ZIP code, GPS coordinates, or landmark
          </p>
          <SearchBar onSearch={handleSearch} loading={isLoading} />
        </div>
      </div>

      {/* Error */}
      {error && (
        <ErrorAlert
          message={(error as Error).message}
          onDismiss={() => setQuery(null)}
        />
      )}

      {/* Loading */}
      {isLoading && <LoadingSpinner size="lg" />}

      {/* Weather Results */}
      {!isLoading && weatherQuery.data && (
        <>
          <CurrentWeatherCard weather={weatherQuery.data} />

          {forecastQuery.data && (
            <>
              <FiveDayForecast forecast={forecastQuery.data} />
              <TemperatureTrendChart days={groupForecastByDay(forecastQuery.data.list)} />
            </>
          )}

          {/* Clothing + YouTube side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ClothingSuggestion query={query!} />
            <YouTubePanel
              location={weatherQuery.data.resolvedDisplayName || weatherQuery.data.name}
            />
          </div>

          {/* Map full width */}
          <GoogleMapEmbed
            lat={weatherQuery.data.coord.lat}
            lon={weatherQuery.data.coord.lon}
            locationName={weatherQuery.data.resolvedDisplayName || weatherQuery.data.name}
          />
        </>
      )}

      {/* Empty state */}
      {!query && (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <div className="text-6xl mb-4">🌍</div>
          <p className="text-lg dark:text-gray-400">Search for any location to see the weather</p>
          <p className="text-sm mt-2">Try: &quot;New York&quot;, &quot;90210&quot;, &quot;40.7128,-74.0060&quot;, or &quot;Eiffel Tower&quot;</p>
        </div>
      )}
    </div>
  );
}
