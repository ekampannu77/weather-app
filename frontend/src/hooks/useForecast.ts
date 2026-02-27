import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ForecastResponse } from '@/types/weather';

export function useForecast(query: string | null) {
  return useQuery<ForecastResponse>({
    queryKey: ['weather', 'forecast', query],
    queryFn: async () => {
      const { data } = await api.get('/weather/forecast', { params: { q: query } });
      return data;
    },
    enabled: !!query,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
