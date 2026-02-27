'use client';

import { ForecastResponse } from '@/types/weather';
import { groupForecastByDay, formatTemp, getWeatherIcon } from '@/lib/utils';
import { useUnit } from '@/context/UnitContext';

interface Props {
  forecast: ForecastResponse;
}

export default function FiveDayForecast({ forecast }: Props) {
  const { unit } = useUnit();
  const days = groupForecastByDay(forecast.list);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 w-full transition-colors duration-300">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">5-Day Forecast</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {days.map((day) => (
          <div
            key={day.date}
            className="flex flex-col items-center bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-center"
          >
            <p className="font-semibold text-gray-600 dark:text-gray-300 text-sm">{day.dayName}</p>
            <span className="text-3xl my-2">{getWeatherIcon(day.weatherId, day.icon)}</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mb-2">{day.weatherDescription}</p>
            <p className="font-bold text-gray-800 dark:text-gray-100">{formatTemp(day.tempMax, unit)}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">{formatTemp(day.tempMin, unit)}</p>
            {day.pop > 0 && (
              <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">🌧️ {day.pop}%</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
