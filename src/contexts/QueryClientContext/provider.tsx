'use client';

import { PropsWithChildren } from 'react';
import {
  QueryClientProvider,
  QueryClient as ReactQueryClient
} from '@tanstack/react-query';

const reactQueryClient = new ReactQueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } }
});

const QueryClient: React.FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={reactQueryClient}>
    {children}
  </QueryClientProvider>
);

export default QueryClient;
