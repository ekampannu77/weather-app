import dayjs from 'dayjs';
import { DayForecast, ForecastItem } from '@/types/weather';

export function celsiusToFahrenheit(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

export function formatTemp(celsius: number, unit: 'C' | 'F'): string {
  if (unit === 'F') return `${celsiusToFahrenheit(celsius)}°F`;
  return `${Math.round(celsius)}°C`;
}

export function formatDate(dateStr: string): string {
  return dayjs(dateStr).format('MMM D, YYYY');
}

export function formatDay(unixTimestamp: number): string {
  return dayjs.unix(unixTimestamp).format('ddd');
}

export function formatTime(unixTimestamp: number, timezoneOffset: number): string {
  // OWM returns unix UTC + timezone offset in seconds, compute local time
  const localUnix = unixTimestamp + timezoneOffset;
  const d = new Date(localUnix * 1000);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export function groupForecastByDay(items: ForecastItem[]): DayForecast[] {
  const dayMap = new Map<string, ForecastItem[]>();

  for (const item of items) {
    const day = item.dt_txt.split(' ')[0];
    if (!dayMap.has(day)) dayMap.set(day, []);
    dayMap.get(day)!.push(item);
  }

  const result: DayForecast[] = [];
  dayMap.forEach((items, date) => {
    const tempMins = items.map((i) => i.main.temp_min);
    const tempMaxs = items.map((i) => i.main.temp_max);
    // Use midday item for weather icon if available
    const midday = items.find((i) => i.dt_txt.includes('12:00:00')) || items[Math.floor(items.length / 2)];

    result.push({
      date,
      dayName: dayjs(date).format('ddd'),
      tempMax: Math.round(Math.max(...tempMaxs)),
      tempMin: Math.round(Math.min(...tempMins)),
      weatherId: midday.weather[0].id,
      weatherMain: midday.weather[0].main,
      weatherDescription: midday.weather[0].description,
      icon: midday.weather[0].icon,
      humidity: Math.round(items.reduce((s, i) => s + i.main.humidity, 0) / items.length),
      windSpeed: Math.round(items.reduce((s, i) => s + i.wind.speed, 0) / items.length),
      pop: Math.round(Math.max(...items.map((i) => i.pop)) * 100),
    });
  });

  // Return only 5 days, skip today if we already have it
  return result.slice(0, 5);
}

export function getWeatherIcon(weatherId: number, icon?: string): string {
  // Map OWM weather condition IDs to emoji icons
  if (weatherId >= 200 && weatherId < 300) return '⛈️';
  if (weatherId >= 300 && weatherId < 400) return '🌦️';
  if (weatherId >= 500 && weatherId < 600) return '🌧️';
  if (weatherId >= 600 && weatherId < 700) return '❄️';
  if (weatherId >= 700 && weatherId < 800) return '🌫️';
  if (weatherId === 800) return icon?.includes('n') ? '🌙' : '☀️';
  if (weatherId === 801) return '🌤️';
  if (weatherId >= 802 && weatherId <= 804) return '☁️';
  return '🌡️';
}

export function getWindDirection(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

export function describeWmoCode(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code === 1) return 'Mainly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code >= 45 && code <= 48) return 'Foggy';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 56 && code <= 57) return 'Freezing drizzle';
  if (code >= 61 && code <= 65) return 'Rain';
  if (code >= 66 && code <= 67) return 'Freezing rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if (code >= 85 && code <= 86) return 'Snow showers';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return 'Unknown';
}
