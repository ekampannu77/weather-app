'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Props {
  lat: number;
  lon: number;
  locationName?: string;
}

export default function GoogleMapEmbed({ lat, lon, locationName }: Props) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get('/media/maps/embed-url', { params: { lat, lon, zoom: 12 } })
      .then(({ data }) => setEmbedUrl(data.embedUrl))
      .catch(() => setError(true));
  }, [lat, lon]);

  if (error) return null;
  if (!embedUrl) return (
    <div className="bg-gray-100 rounded-2xl h-64 flex items-center justify-center text-gray-400">
      Loading map...
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full">
      <div className="px-5 pt-4 pb-2">
        <h3 className="text-lg font-semibold text-gray-700">
          📍 {locationName || `${lat.toFixed(2)}, ${lon.toFixed(2)}`}
        </h3>
      </div>
      <iframe
        src={embedUrl}
        width="100%"
        height="300"
        className="border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Location Map"
      />
    </div>
  );
}
