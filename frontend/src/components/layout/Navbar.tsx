'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUnit } from '@/context/UnitContext';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const pathname = usePathname();
  const { unit, toggleUnit } = useUnit();
  const { theme, toggleTheme } = useTheme();

  const links = [
    { href: '/', label: '🌤️ Weather' },
    { href: '/history', label: '📋 History' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-40 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 dark:text-blue-400">
          <span>⛅</span>
          <span>WeatherApp</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-4">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${pathname === href
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
            >
              {label}
            </Link>
          ))}

          {/* °C/°F toggle */}
          <button
            onClick={toggleUnit}
            className="ml-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                       text-sm font-semibold text-gray-700 dark:text-gray-200
                       hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            title="Toggle temperature unit"
          >
            °{unit === 'C' ? 'F' : 'C'}
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                       text-sm text-gray-700 dark:text-gray-200
                       hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
}
