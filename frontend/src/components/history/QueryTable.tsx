'use client';

import { useState } from 'react';
import { useHistoricalQueries, useDeleteQuery } from '@/hooks/useHistoricalQueries';
import { HistoricalQueryResponse } from '@/types/historicalQuery';
import { formatDate } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorAlert from '@/components/ui/ErrorAlert';
import DeleteConfirmModal from './DeleteConfirmModal';
import ExportButtons from './ExportButtons';
import toast from 'react-hot-toast';

interface Props {
  onEdit: (query: HistoricalQueryResponse) => void;
}

export default function QueryTable({ onEdit }: Props) {
  const [page, setPage] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<HistoricalQueryResponse | null>(null);
  const { data, isLoading, error } = useHistoricalQueries(page, 10);
  const deleteMutation = useDeleteQuery();

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success('Query deleted');
      setDeleteTarget(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error.message} />;
  if (!data || data.content.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-5xl mb-3">📭</div>
        <p>No weather queries yet. Create one above!</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl shadow-md">
        <table className="min-w-full bg-white text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600 font-semibold text-left">
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Start Date</th>
              <th className="px-4 py-3">End Date</th>
              <th className="px-4 py-3">Avg °C</th>
              <th className="px-4 py-3">Min °C</th>
              <th className="px-4 py-3">Max °C</th>
              <th className="px-4 py-3">Precip (mm)</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3">Export</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.content.map((q) => (
              <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800">{q.displayName}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(q.startDate)}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(q.endDate)}</td>
                <td className="px-4 py-3 text-center">{q.avgTempCelsius ?? '—'}</td>
                <td className="px-4 py-3 text-center text-blue-600">{q.minTempCelsius ?? '—'}</td>
                <td className="px-4 py-3 text-center text-red-500">{q.maxTempCelsius ?? '—'}</td>
                <td className="px-4 py-3 text-center">{q.avgPrecipitation ?? '—'}</td>
                <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{q.userNotes || '—'}</td>
                <td className="px-4 py-3">
                  <ExportButtons queryId={q.id} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(q)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setDeleteTarget(q)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50"
          >
            ← Prev
          </button>
          <span className="px-3 py-1.5 text-sm text-gray-600">
            Page {page + 1} of {data.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.totalPages - 1, p + 1))}
            disabled={page >= data.totalPages - 1}
            className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50"
          >
            Next →
          </button>
        </div>
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          locationName={deleteTarget.displayName}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
