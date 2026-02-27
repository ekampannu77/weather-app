import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { CurrentWeather } from '@/types/weather';

export function useCurrentWeather(query: string | null) {
  return useQuery<CurrentWeather>({
    queryKey: ['weather', 'current', query],
    queryFn: async () => {
      const { data } = await api.get('/weather/current', { params: { q: query } });
      return data;
    },
    enabled: !!query,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
