import { useState } from 'react';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useScheduledTransfers, useCancelScheduled } from '#/hooks/use-scheduled';
import { useTransfers } from '#/hooks/use-transfers';
import { formatCurrency } from '#/lib/formatters';
import { Button } from '#/components/ui/button';
import type { ScheduledTransfer, Transfer } from '#/types';
import type { TransferNote } from '#/types/dashboard';

interface ScheduledTabProps {
  onNewSchedule: () => void;
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[130px] border-2 border-black bg-white p-4 shadow-[4px_4px_0_#000000]">
      <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-400">
        {label}
      </p>
      <p className="text-xl font-bold text-black">{value}</p>
    </div>
  );
}

interface EnrichedScheduled extends ScheduledTransfer {
  transfer?: Transfer;
}

const NOTE_LABELS: Record<TransferNote, string> = {
  subscription: 'Recurring subscription',
  rent: 'Monthly rent',
  food: 'Food & dining',
  transport: 'Transport',
  shopping: 'Shopping',
  utilities: 'Utilities',
  entertainment: 'Entertainment',
  other: 'Scheduled transfer',
};

function ScheduledRow({ item, onCancel }: { item: EnrichedScheduled; onCancel: () => void }) {
  const t = item.transfer;
  const counterparty = t
    ? t.direction === 'debit'
      ? t.to_user.full_name
      : t.from_user.full_name
    : 'Unknown Recipient';

  const note = t?.note as TransferNote | undefined;
  const badgeLabel = note ? note.toUpperCase() : 'TRANSFER';
  const subtitle = note ? NOTE_LABELS[note] : 'Scheduled transfer';

  const date = new Date(item.scheduled_at);
  const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date).toUpperCase();
  const day = date.getDate();
  const time = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);

  return (
    <div
      className="flex items-center border-b border-neutral-100 bg-white last:border-b-0"
      style={{ borderLeft: '4px solid #6666ff' }}
    >
      <div
        className="flex w-[72px] shrink-0 flex-col items-center justify-center py-3.5 leading-none"
        style={{ borderRight: '1px solid #ede8f4', background: '#fafafa' }}
      >
        <span className="mb-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#aaa]">
          {month}
        </span>
        <span className="font-bold leading-none tracking-[-0.04em] text-[28px]">{day}</span>
        <span className="mt-0.5 font-mono text-[9px] tracking-[0.06em] text-[#bbb]">{time}</span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-[5px] px-[18px] py-3.5">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-bold text-black">{counterparty}</span>
          <span
            className="border px-[7px] py-0.5 font-mono text-[8px] font-bold uppercase tracking-[0.14em]"
            style={{ background: '#0d0d0d', borderColor: '#2a2a2a', color: '#888' }}
          >
            {badgeLabel}
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#aaa]">{subtitle}</span>
      </div>

      <div className="flex shrink-0 items-center gap-4 px-5">
        {t && (
          <span className="text-[15px] font-bold text-black">
            {formatCurrency(t.amount_in_piastres)}
          </span>
        )}
        <button
          type="button"
          onClick={onCancel}
          className="flex h-7 w-7 items-center justify-center border border-neutral-200 text-neutral-300 transition-colors hover:border-[#ba1a1a] hover:text-[#ba1a1a]"
          title="Cancel schedule"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

const PAGE_SIZE = 10;

export function ScheduledTab({ onNewSchedule }: ScheduledTabProps) {
  const [page, setPage] = useState(1);
  const { data: scheduled = [], isLoading } = useScheduledTransfers();
  const { data: transfers = [] } = useTransfers();
  const cancelScheduled = useCancelScheduled();

  const enriched: EnrichedScheduled[] = scheduled.map((s) => ({
    ...s,
    transfer: transfers.find((t) => t.id === s.transfer_id),
  }));

  const active = enriched.filter((s) => !s.executed_at && !s.deleted_at);

  const totalPages = Math.ceil(enriched.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedItems = [...enriched]
    .sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
    .slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="flex flex-col gap-5">
      {/* Stats + CTA row */}
      <div className="flex flex-wrap items-start gap-3">
        <StatCard label="Active Schedules" value={String(active.length)} />
        <StatCard label="Total Scheduled" value={String(scheduled.length)} />
        <div className="flex-1" />
        <button
          type="button"
          onClick={onNewSchedule}
          className="flex shrink-0 items-center gap-2 border-4 border-black bg-[#00ff87] px-6 py-3 text-sm font-bold uppercase tracking-wider shadow-[4px_4px_0_#000000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#000000]"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          New Schedule
        </button>
      </div>

      {/* Scheduled rows */}
      <div className="border-2 border-black bg-white">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
          </div>
        ) : enriched.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm font-medium text-neutral-400">No scheduled transfers.</p>
          </div>
        ) : (
          <>
            {paginatedItems.map((item) => (
              <ScheduledRow
                key={item.id}
                item={item}
                onCancel={() => cancelScheduled.mutate(item.id)}
              />
            ))}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t-2 border-black px-4 py-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="size-4" />
                  Previous
                </Button>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                  Page {page} of {totalPages}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
