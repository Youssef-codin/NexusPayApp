import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { ErrorFallback } from '#/components/ErrorFallback';
import { Button } from '#/components/ui/button';

import '../styles.css';

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: RootErrorBoundary,
  notFoundComponent: RootNotFound,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  );
}

function RootErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#fcf8ff] flex items-center justify-center p-6">
      <ErrorFallback error={error} resetError={reset} />
    </div>
  );
}

function RootNotFound() {
  return (
    <div className="min-h-screen bg-[#fcf8ff] flex items-center justify-center p-6">
      <div className="border-4 border-black bg-white p-8 max-w-md w-full text-center shadow-[8px_8px_0px_#000000]">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-500 mb-3">
          Error 404
        </p>
        <h1 className="text-3xl font-black text-black uppercase mb-3">Page Not Found</h1>
        <p className="text-neutral-700 mb-6">
          The route you requested does not exist or is no longer available.
        </p>
        <div className="flex flex-col gap-3">
          <Button
            asChild
            className="bg-[#00ff87] text-black hover:bg-[#00cc6a] border-2 border-black"
          >
            <Link to="/">Go Home</Link>
          </Button>
          <Button asChild variant="outline" className="border-2 border-black text-black">
            <Link to="/login">Back To Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
