import { useState, useLayoutEffect, useEffect } from 'react';
import { setupGlobalErrorHandlers } from './lib/global-error-handler';
import axios from 'axios';
import { decodeJwt } from 'jose';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useAuthStore } from './store/auth-store';
import { Toaster } from './components/ui/sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => setupGlobalErrorHandlers(), []);

  useLayoutEffect(() => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {}, { withCredentials: true })
      .then((res) => {
        const { jwt_token } = res.data;
        const id = decodeJwt(jwt_token).sub as string;
        const existing = useAuthStore.getState().user;
        useAuthStore.getState().login(jwt_token, {
          id,
          email: existing?.email ?? '',
          full_name: existing?.full_name ?? '',
        });
      })
      .catch(() => {
        // No valid session — router will redirect to login
      })
      .finally(() => setReady(true));
  }, []);

  if (!ready) return <LoadingSpinner />;

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  );
}
