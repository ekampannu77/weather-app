'use client';

import { useState } from 'react';
import { CurrentWeather } from '@/types/weather';
import { formatTemp, formatTime, getWeatherIcon, getWindDirection } from '@/lib/utils';
import { useUnit } from '@/context/UnitContext';

interface Props {
  weather: CurrentWeather;
}

export default function CurrentWeatherCard({ weather }: Props) {
  const { unit } = useUnit();
  const [expanded, setExpanded] = useState(false);
  const w = weather.weather[0];
  const icon = getWeatherIcon(w.id, w.icon);
  const sunrise = formatTime(weather.sys.sunrise, weather.timezone);
  const sunset  = formatTime(weather.sys.sunset,  weather.timezone);

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-2xl shadow-lg w-full overflow-hidden">

      {/* Always-visible top section */}
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">
              {weather.resolvedDisplayName || `${weather.name}, ${weather.sys.country}`}
            </h2>
            <p className="text-blue-100 capitalize">{w.description}</p>
          </div>
          <span className="text-6xl">{icon}</span>
        </div>

        {/* Temp row */}
        <div className="flex items-end gap-6 mt-4">
          <div className="text-7xl font-thin leading-none">
            {formatTemp(weather.main.temp, unit)}
          </div>
          <div className="pb-2 text-blue-100 text-sm space-y-0.5">
            <p>Feels like {formatTemp(weather.main.feels_like, unit)}</p>
            <p>H: {formatTemp(weather.main.temp_max, unit)} &bull; L: {formatTemp(weather.main.temp_min, unit)}</p>
          </div>
        </div>

        {/* Quick stats row — always visible */}
        <div className="flex gap-4 mt-4 text-sm text-blue-100">
          <span>💧 {weather.main.humidity}%</span>
          <span>💨 {Math.round(weather.wind.speed * 3.6)} km/h {getWindDirection(weather.wind.deg)}</span>
          <span>☁️ {weather.clouds.all}%</span>
        </div>

        {/* Alerts */}
        {weather.alerts && weather.alerts.length > 0 && (
          <div className="mt-4 bg-orange-500/80 rounded-xl p-3">
            <p className="font-semibold">⚠️ {weather.alerts[0].event}</p>
            <p className="text-sm text-orange-100 mt-1 line-clamp-2">{weather.alerts[0].description}</p>
          </div>
        )}

        {/* Expand / Collapse button */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="mt-4 flex items-center gap-1.5 text-sm text-blue-200 hover:text-white transition-colors"
        >
          <span>{expanded ? '▲ Hide details' : '▼ More details'}</span>
        </button>
      </div>

      {/* Expandable details */}
      {expanded && (
        <div className="border-t border-blue-400/40 px-6 pb-6 pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-blue-600/40 rounded-xl p-4">
            <Detail label="Humidity"        value={`${weather.main.humidity}%`}                                                    icon="💧" />
            <Detail label="Wind"            value={`${Math.round(weather.wind.speed * 3.6)} km/h ${getWindDirection(weather.wind.deg)}`} icon="💨" />
            <Detail label="Pressure"        value={`${weather.main.pressure} hPa`}                                                icon="🌡️" />
            <Detail label="Visibility"      value={weather.visibility ? `${(weather.visibility / 1000).toFixed(1)} km` : 'N/A'}  icon="👁️" />
            <Detail label="Cloud Cover"     value={`${weather.clouds.all}%`}                                                      icon="☁️" />
            <Detail label="Sunrise / Sunset" value={`${sunrise} / ${sunset}`}                                                    icon="🌅" />
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="text-center">
      <div className="text-xl">{icon}</div>
      <div className="text-sm text-blue-100">{label}</div>
      <div className="font-semibold text-sm">{value}</div>
    </div>
  );
}
