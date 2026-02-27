import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { HistoricalQueryRequest, UpdateQueryRequest, PageResponse, HistoricalQueryResponse } from '@/types/historicalQuery';

export function useHistoricalQueries(page = 0, size = 20, city?: string) {
  return useQuery<PageResponse<HistoricalQueryResponse>>({
    queryKey: ['queries', page, size, city],
    queryFn: async () => {
      const { data } = await api.get('/queries', { params: { page, size, city } });
      return data;
    },
    staleTime: 30 * 1000,
  });
}

export function useCreateQuery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req: HistoricalQueryRequest) => {
      const { data } = await api.post('/queries', req);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['queries'] }),
  });
}

export function useUpdateQuery(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req: UpdateQueryRequest) => {
      const { data } = await api.put(`/queries/${id}`, req);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['queries'] }),
  });
}

export function useDeleteQuery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/queries/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['queries'] }),
  });
}
