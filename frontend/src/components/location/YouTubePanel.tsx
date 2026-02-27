'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { YouTubeVideoResult } from '@/types/historicalQuery';

interface Props {
  location: string;
}

export default function YouTubePanel({ location }: Props) {
  const [videos, setVideos] = useState<YouTubeVideoResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/media/youtube', { params: { location, maxResults: 4 } })
      .then(({ data }) => setVideos(data))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, [location]);

  if (loading) return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 transition-colors duration-300">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">📹 Videos about {location}</h3>
      <p className="text-gray-400 dark:text-gray-500 text-sm">Loading videos...</p>
    </div>
  );

  if (videos.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden w-full transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-700 text-white p-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold">📹 Explore {location}</h3>
          <span className="text-3xl">🎬</span>
        </div>
        <p className="text-white/80 text-sm">Travel &amp; weather videos from YouTube</p>
      </div>

      {/* Video list */}
      <div className="p-5 space-y-3">
        {videos.map((v) => (
          <a
            key={v.videoId}
            href={v.watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 rounded-xl border border-gray-100 dark:border-gray-700
                       hover:border-red-200 dark:hover:border-red-700
                       hover:bg-red-50 dark:hover:bg-red-900/20
                       transition-colors p-2 group"
          >
            <img
              src={v.thumbnail}
              alt={v.title}
              className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
            />
            <div className="min-w-0 flex flex-col justify-center">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400">
                {v.title}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{v.channelName}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
