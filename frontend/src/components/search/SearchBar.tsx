'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Suggestion {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading?: boolean;
}

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { loading: geoLoading, getLocation } = useGeolocation();

  // Fetch suggestions with debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (input.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await api.get('/weather/geocode', { params: { q: input.trim() } });
        setSuggestions(data ?? []);
        setShowDropdown(true);
        setActiveIndex(-1);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectSuggestion = (s: Suggestion) => {
    const label = [s.name, s.state, s.country].filter(Boolean).join(', ');
    setInput(label);
    setSuggestions([]);
    setShowDropdown(false);
    onSearch(label);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) {
      toast.error('Please enter a location');
      return;
    }
    setShowDropdown(false);
    onSearch(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const handleGeolocate = async () => {
    try {
      const coords = await getLocation();
      setInput(coords);
      setShowDropdown(false);
      onSearch(coords);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Location error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-2xl mx-auto">
      <div className="flex-1 relative" ref={containerRef}>
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg z-10">🔍</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          placeholder="Enter city, ZIP code, GPS (lat,lon), or landmark..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100
                     shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300"
          disabled={loading || geoLoading}
          autoComplete="off"
        />

        {/* Dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <ul className="absolute z-50 left-0 right-0 top-full mt-1
                         bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                         rounded-xl shadow-lg overflow-hidden">
            {suggestions.map((s, i) => {
              const isActive = i === activeIndex;
              return (
                <li
                  key={`${s.lat}-${s.lon}-${i}`}
                  onMouseDown={() => selectSuggestion(s)}
                  className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors
                    ${isActive
                      ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                >
                  <span className="text-gray-400">📍</span>
                  <div>
                    <span className="font-medium">{s.name}</span>
                    {(s.state || s.country) && (
                      <span className="text-sm text-gray-400 dark:text-gray-500 ml-1">
                        {[s.state, s.country].filter(Boolean).join(', ')}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={handleGeolocate}
        disabled={geoLoading || loading}
        title="Use my current location"
        className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600
                   bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
                   hover:bg-gray-50 dark:hover:bg-gray-700
                   shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {geoLoading ? '⏳' : '📍'}
      </button>

      <button
        type="submit"
        disabled={loading || geoLoading}
        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600
                   text-white font-semibold shadow-sm transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}
