import { customToast } from '#/lib/toast';

const isDev = import.meta.env.DEV;

function formatError(error: unknown): { message: string; detail?: string } {
  if (error instanceof Error) {
    return {
      message: error.message || 'An unexpected error occurred',
      detail: isDev ? [error.message, error.stack].filter(Boolean).join('\n\n') : undefined,
    };
  }
  const message = String(error) || 'An unexpected error occurred';
  return { message, detail: isDev ? message : undefined };
}

function showErrorToast(error: unknown) {
  const { message, detail } = formatError(error);

  if (isDev && detail) {
    customToast.error('Unhandled Error', {
      description: message,
      copyText: detail,
      duration: 10000,
    });
  } else {
    customToast.error('Something went wrong', {
      description: 'An unexpected error occurred. Please try again.',
    });
  }
}

export function setupGlobalErrorHandlers() {
  const handleError = (event: ErrorEvent) => {
    // Ignore errors from browser extensions or cross-origin scripts
    if (!event.error && !event.message) return;
    event.preventDefault();
    showErrorToast(event.error ?? event.message);
  };

  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    event.preventDefault();
    showErrorToast(event.reason);
  };

  window.addEventListener('error', handleError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);

  return () => {
    window.removeEventListener('error', handleError);
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  };
}
