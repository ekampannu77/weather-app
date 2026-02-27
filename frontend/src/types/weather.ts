export interface CurrentWeather {
  id: number;
  name: string;
  resolvedDisplayName?: string;
  coord: { lat: number; lon: number };
  weather: Array<{ id: number; main: string; description: string; icon: string }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: { speed: number; deg: number; gust?: number };
  visibility?: number;
  clouds: { all: number };
  sys: { country: string; sunrise: number; sunset: number };
  dt: number;
  timezone: number;
  alerts?: Array<{ event: string; description: string }>;
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: Array<{ id: number; main: string; description: string; icon: string }>;
  wind: { speed: number; deg: number };
  pop: number; // probability of precipitation
  dt_txt: string;
}

export interface DayForecast {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  weatherId: number;
  weatherMain: string;
  weatherDescription: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pop: number;
}

export interface ForecastResponse {
  list: ForecastItem[];
  city: { name: string; country: string };
  resolvedDisplayName?: string;
}
