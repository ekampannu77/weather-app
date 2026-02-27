'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { UnitProvider } from '@/context/UnitContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { retry: 1, refetchOnWindowFocus: false },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UnitProvider>
          {children}
          <Toaster position="bottom-right" />
        </UnitProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
