import {
  CircleCheckIcon,
  ClipboardCheckIcon,
  ClipboardIcon,
  InfoIcon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { cn } from '#/lib/utils.ts';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface CustomToastProps {
  id: string | number;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
  copyText?: string;
}

const config: Record<
  ToastType,
  { icon: React.ElementType; accent: string; progressColor: string; label: string }
> = {
  success: {
    icon: CircleCheckIcon,
    accent: 'bg-[#00ff87]',
    progressColor: 'bg-[#00cc6a]',
    label: 'SUCCESS',
  },
  error: {
    icon: OctagonXIcon,
    accent: 'bg-red-500',
    progressColor: 'bg-red-700',
    label: 'ERROR',
  },
  warning: {
    icon: TriangleAlertIcon,
    accent: 'bg-amber-400',
    progressColor: 'bg-amber-600',
    label: 'WARNING',
  },
  info: {
    icon: InfoIcon,
    accent: 'bg-blue-400',
    progressColor: 'bg-blue-600',
    label: 'INFO',
  },
};

export function CustomToast({
  id,
  type,
  message,
  description,
  duration = 4000,
  copyText,
}: CustomToastProps) {
  const [progress, setProgress] = useState(100);
  const [copied, setCopied] = useState(false);
  const { icon: Icon, accent, progressColor, label } = config[type];

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining === 0) {
        clearInterval(interval);
        toast.dismiss(id);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [duration, id]);

  function handleCopy() {
    if (!copyText) return;
    navigator.clipboard.writeText(copyText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="relative flex w-full overflow-hidden border-2 border-black bg-white shadow-[4px_4px_0px_#000000]">
      {/* Accent stripe */}
      <div className={cn('w-2 shrink-0', accent)} />

      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 border-b-2 border-black px-3 py-2">
          <Icon className="size-4 shrink-0 text-black" strokeWidth={2.5} />
          <span className="flex-1 font-mono text-xs font-black uppercase tracking-widest text-black">
            {label}
          </span>
          <button
            type="button"
            onClick={() => toast.dismiss(id)}
            className="flex size-5 items-center justify-center border-2 border-black bg-white hover:bg-black hover:text-white transition-colors"
          >
            <XIcon className="size-3" strokeWidth={3} />
          </button>
        </div>

        {/* Body */}
        <div className="px-3 py-2.5 space-y-1">
          <p className="text-sm font-bold leading-tight text-black">{message}</p>
          {description && <p className="text-xs text-neutral-500 leading-snug">{description}</p>}
        </div>

        {/* Copy button (dev mode only) */}
        {copyText && (
          <div className="px-3 pb-3">
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                'flex w-full items-center justify-center gap-2 border-2 border-black px-3 py-2 font-mono text-xs font-black uppercase tracking-widest transition-colors',
                copied ? 'bg-[#00ff87] text-black' : 'bg-black text-white hover:bg-neutral-800'
              )}
            >
              {copied ? (
                <ClipboardCheckIcon className="size-3.5 shrink-0" strokeWidth={2.5} />
              ) : (
                <ClipboardIcon className="size-3.5 shrink-0" strokeWidth={2.5} />
              )}
              {copied ? 'Copied!' : 'Copy Stack Trace'}
            </button>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-200">
        <div
          className={cn('h-full transition-all duration-[16ms] ease-linear', progressColor)}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
