'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateQuery, useUpdateQuery } from '@/hooks/useHistoricalQueries';
import { HistoricalQueryResponse } from '@/types/historicalQuery';
import toast from 'react-hot-toast';

const today = new Date().toISOString().split('T')[0];
const minDate = '1940-01-01';

const schema = z.object({
  inputLocation: z.string().min(1, 'Location is required'),
  startDate: z.string()
    .min(1, 'Start date is required')
    .refine((d) => d >= minDate, 'Start date cannot be before 1940-01-01')
    .refine((d) => d < today, 'Start date must be before today'),
  endDate: z.string()
    .min(1, 'End date is required')
    .refine((d) => d < today, 'End date must be before today'),
  userNotes: z.string().optional(),
}).refine((data) => data.startDate <= data.endDate, {
  message: 'Start date must be on or before end date',
  path: ['endDate'],
});

type FormValues = z.infer<typeof schema>;

interface Props {
  editQuery?: HistoricalQueryResponse | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function HistoricalQueryForm({ editQuery, onSuccess, onCancel }: Props) {
  const isEditing = !!editQuery;
  const createMutation = useCreateQuery();
  const updateMutation = useUpdateQuery(editQuery?.id ?? 0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: editQuery
      ? {
          inputLocation: editQuery.inputLocation,
          startDate: editQuery.startDate,
          endDate: editQuery.endDate,
          userNotes: editQuery.userNotes ?? '',
        }
      : {},
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync(values);
        toast.success('Query updated successfully!');
      } else {
        await createMutation.mutateAsync(values);
        toast.success('Weather data fetched and saved!');
      }
      onSuccess();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save query');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800">
        {isEditing ? '✏️ Edit Query' : '➕ New Historical Query'}
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <input
          {...register('inputLocation')}
          placeholder="City, ZIP code, or GPS coordinates"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {errors.inputLocation && <p className="text-red-500 text-xs mt-1">{errors.inputLocation.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            {...register('startDate')}
            min={minDate}
            max={today}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            {...register('endDate')}
            min={minDate}
            max={today}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
        <textarea
          {...register('userNotes')}
          rows={2}
          placeholder="Add any notes about this query..."
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
        />
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700
                     transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Fetch & Save'}
        </button>
      </div>
    </form>
  );
}
