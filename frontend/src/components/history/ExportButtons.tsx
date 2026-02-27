'use client';

const FORMATS = [
  { format: 'json', label: 'JSON', icon: '{}' },
  { format: 'csv', label: 'CSV', icon: '📊' },
  { format: 'xml', label: 'XML', icon: '</>' },
  { format: 'pdf', label: 'PDF', icon: '📄' },
  { format: 'markdown', label: 'MD', icon: '📝' },
];

interface Props {
  queryId?: number; // if provided, exports single; otherwise exports all
}

export default function ExportButtons({ queryId }: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

  const handleExport = (format: string) => {
    const url = queryId
      ? `${baseUrl}/export/${queryId}?format=${format}`
      : `${baseUrl}/export?format=${format}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-wrap gap-2">
      {FORMATS.map(({ format, label, icon }) => (
        <button
          key={format}
          onClick={() => handleExport(format)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 bg-white
                     text-sm text-gray-700 hover:bg-gray-50 hover:border-blue-300 transition-colors"
          title={`Export as ${label}`}
        >
          <span>{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
