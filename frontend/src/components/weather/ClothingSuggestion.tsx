'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ClothingSuggestionResponse {
  outfitSummary: string;
  comfortLevel: string;
  weatherEmoji: string;
  temperatureFeels: string;
  outerwear: string[];
  topLayer: string[];
  bottoms: string[];
  footwear: string[];
  accessories: string[];
  tips: string[];
  activityAdvice: string;
}

const COMFORT_COLORS: Record<string, string> = {
  'Extreme Cold': 'from-slate-700 to-slate-900',
  'Very Cold':    'from-blue-800 to-indigo-900',
  'Cold':         'from-blue-600 to-blue-800',
  'Cool':         'from-cyan-500 to-blue-600',
  'Mild':         'from-teal-400 to-cyan-600',
  'Comfortable':  'from-green-400 to-teal-500',
  'Warm':         'from-yellow-400 to-orange-500',
  'Very Hot':     'from-orange-500 to-red-600',
};

interface Props {
  query: string;
}

export default function ClothingSuggestion({ query }: Props) {
  const { data, isLoading, error } = useQuery<ClothingSuggestionResponse>({
    queryKey: ['clothing', query],
    queryFn: async () => {
      const { data } = await api.get('/suggestions/clothing', { params: { q: query } });
      return data;
    },
    enabled: !!query,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 transition-colors duration-300">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">👗 What to Wear Today</h3>
      <LoadingSpinner />
    </div>
  );

  if (error || !data) return null;

  const gradient = COMFORT_COLORS[data.comfortLevel] || 'from-blue-500 to-blue-700';

  const sections = [
    { label: '🧥 Outerwear',   items: data.outerwear },
    { label: '👕 Top Layer',   items: data.topLayer },
    { label: '👖 Bottoms',     items: data.bottoms },
    { label: '👟 Footwear',    items: data.footwear },
    { label: '🎒 Accessories', items: data.accessories },
  ].filter(s => s.items && s.items.length > 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden w-full transition-colors duration-300">
      {/* Header — gradient stays vivid in both modes */}
      <div className={`bg-gradient-to-r ${gradient} text-white p-5`}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold">👗 What to Wear Today</h3>
          <span className="text-3xl">{data.weatherEmoji}</span>
        </div>
        <p className="text-white/90 font-medium">{data.outfitSummary}</p>
        <p className="text-white/70 text-sm mt-1">🌡️ {data.temperatureFeels}</p>
        <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
          {data.comfortLevel}
        </span>
      </div>

      <div className="p-5 space-y-5">
        {/* Clothing Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sections.map(({ label, items }) => (
            <div key={label} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
              <p className="font-semibold text-gray-700 dark:text-gray-200 text-sm mb-2">{label}</p>
              <ul className="space-y-1">
                {items.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Activity Advice */}
        {data.activityAdvice && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-xl p-3 flex gap-2">
            <span className="text-xl flex-shrink-0">🗺️</span>
            <div>
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">Tourist Tip</p>
              <p className="text-sm text-blue-700 dark:text-blue-400">{data.activityAdvice}</p>
            </div>
          </div>
        )}

        {/* Tips */}
        {data.tips && data.tips.length > 0 && (
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-200 text-sm mb-2">💡 Smart Tips</p>
            <ul className="space-y-1.5">
              {data.tips.map((tip, i) => (
                <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                  <span className="text-yellow-500 flex-shrink-0">→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
