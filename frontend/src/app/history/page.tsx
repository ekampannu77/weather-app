'use client';

import { useState } from 'react';
import HistoricalQueryForm from '@/components/history/HistoricalQueryForm';
import QueryTable from '@/components/history/QueryTable';
import ExportButtons from '@/components/history/ExportButtons';
import { HistoricalQueryResponse } from '@/types/historicalQuery';

export default function HistoryPage() {
  const [showForm, setShowForm] = useState(false);
  const [editQuery, setEditQuery] = useState<HistoricalQueryResponse | null>(null);

  const handleEdit = (query: HistoricalQueryResponse) => {
    setEditQuery(query);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditQuery(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditQuery(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">📋 Historical Weather Queries</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Store and manage weather queries by location and date range
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButtons />
          {!showForm && (
            <button
              onClick={() => { setEditQuery(null); setShowForm(true); }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700
                         transition-colors shadow-sm"
            >
              ➕ New Query
            </button>
          )}
        </div>
      </div>

      {/* Form (collapsible) */}
      {showForm && (
        <HistoricalQueryForm
          editQuery={editQuery}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      {/* Table */}
      <QueryTable onEdit={handleEdit} />
    </div>
  );
}
