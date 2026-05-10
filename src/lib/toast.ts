import { toast } from 'sonner';
import { createElement } from 'react';
import { CustomToast } from '#/components/ui/custom-toast';

interface ToastOptions {
  description?: string;
  duration?: number;
  copyText?: string;
}

function show(
  type: 'success' | 'error' | 'warning' | 'info',
  message: string,
  options?: ToastOptions
) {
  const duration = options?.duration ?? 4000;
  toast.custom(
    (id) =>
      createElement(CustomToast, {
        id,
        type,
        message,
        description: options?.description,
        duration,
        copyText: options?.copyText,
      }),
    { duration }
  );
}

export const customToast = {
  success: (message: string, options?: ToastOptions) => show('success', message, options),
  error: (message: string, options?: ToastOptions) => show('error', message, options),
  warning: (message: string, options?: ToastOptions) => show('warning', message, options),
  info: (message: string, options?: ToastOptions) => show('info', message, options),
};
