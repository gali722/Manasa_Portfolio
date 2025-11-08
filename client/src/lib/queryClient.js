import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      onError: (error) => {
        console.error('Query error:', error);
      },
    },
    mutations: {
      retry: 0,
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});
