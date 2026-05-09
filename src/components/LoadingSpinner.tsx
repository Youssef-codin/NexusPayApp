import { Skeleton } from '#/components/ui/skeleton';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-black border-t-[#00ff87] animate-spin" />
        <p className="text-black font-bold uppercase tracking-wider text-sm">Loading...</p>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="border-2 border-black p-6 bg-white">
      <Skeleton className="h-6 w-32 mb-4 bg-neutral-200" />
      <Skeleton className="h-10 w-48 bg-neutral-200" />
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border-2 border-black p-4 bg-white">
          <Skeleton className="h-4 w-24 mb-2 bg-neutral-200" />
          <Skeleton className="h-6 w-32 bg-neutral-200" />
        </div>
      ))}
    </div>
  );
}
