import { Button } from '#/components/ui/button';

interface ErrorFallbackProps {
  error: Error;
  resetError?: () => void;
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <div className="border-4 border-black bg-white p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-black mb-4">Error</h2>
        <p className="text-neutral-600 mb-6 font-medium">
          {error.message || 'Something went wrong'}
        </p>
        {resetError && (
          <Button
            onClick={resetError}
            className="bg-[#00ff87] text-black hover:bg-[#00cc6a] border-2 border-black"
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
