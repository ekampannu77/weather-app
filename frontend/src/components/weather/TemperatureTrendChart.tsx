'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { DayForecast } from '@/types/weather';
import { useUnit } from '@/context/UnitContext';
import { celsiusToFahrenheit } from '@/lib/utils';

interface Props {
  days: DayForecast[];
}

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({
  active,
  payload,
  label,
  unit,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  unit: 'C' | 'F';
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 shadow-lg text-sm">
      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{p.value}°{unit}</span>
        </p>
      ))}
    </div>
  );
}

export default function TemperatureTrendChart({ days }: Props) {
  const { unit } = useUnit();

  const data = days.map((d) => ({
    day: d.dayName,
    High: unit === 'F' ? celsiusToFahrenheit(d.tempMax) : d.tempMax,
    Low:  unit === 'F' ? celsiusToFahrenheit(d.tempMin) : d.tempMin,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 w-full transition-colors duration-300">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
        Temperature Trend
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="gradHigh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#f97316" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradLow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.6} />

          <XAxis
            dataKey="day"
            tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${v}°`}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={36}
          />

          <Tooltip content={<CustomTooltip unit={unit} />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '13px', paddingTop: '8px' }}
          />

          <Area
            type="monotone"
            dataKey="High"
            stroke="#f97316"
            strokeWidth={2.5}
            fill="url(#gradHigh)"
            dot={{ r: 4, fill: '#f97316', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
          <Area
            type="monotone"
            dataKey="Low"
            stroke="#3b82f6"
            strokeWidth={2.5}
            fill="url(#gradLow)"
            dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
