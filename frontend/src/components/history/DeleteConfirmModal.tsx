'use client';

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
  locationName: string;
}

export default function DeleteConfirmModal({ onConfirm, onCancel, locationName }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
        <div className="text-4xl mb-3 text-center">🗑️</div>
        <h3 className="text-lg font-bold text-gray-800 text-center mb-2">Delete Query?</h3>
        <p className="text-gray-500 text-sm text-center mb-6">
          Are you sure you want to delete the query for <strong>{locationName}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
