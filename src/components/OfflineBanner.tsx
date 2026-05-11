import { Loader2Icon, WifiOffIcon } from 'lucide-react';
import { useOnlineStatus } from '#/hooks/use-online-status';

export function OfflineBanner() {
  const { isOnline, isRetrying, retry } = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex w-[420px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden border-[3px] border-black bg-[#0a0a0a] shadow-[12px_12px_0_#00ff87]">
        {/* Header accent bar */}
        <div className="h-1.5 w-full bg-[#00ff87]" />

        <div className="flex flex-col items-center gap-8 px-10 py-10 text-center">
          {/* Icon */}
          <div className="flex size-16 items-center justify-center border-[3px] border-[#00ff87] bg-black shadow-[4px_4px_0_#00ff87]">
            <WifiOffIcon className="size-7 text-[#00ff87]" strokeWidth={2.5} />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#00ff87]">
              NexusPay · Connection
            </p>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">
              You're Offline
            </h2>
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
              Check your connection and try again
            </p>
          </div>

          {/* Button */}
          <button
            type="button"
            onClick={retry}
            disabled={isRetrying}
            className="flex w-full items-center justify-center gap-2 border-[3px] border-[#00ff87] bg-[#00ff87] px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-black shadow-[4px_4px_0_#fff] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#fff] disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-[4px_4px_0_#fff]"
          >
            {isRetrying ? (
              <>
                <Loader2Icon className="size-3.5 animate-spin" />
                Retrying…
              </>
            ) : (
              'Try Again'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
