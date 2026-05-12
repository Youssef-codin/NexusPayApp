import React, { useState } from 'react';
import {
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
} from 'lucide-react';
import { toast } from 'sonner';
import { useScheduledTransfers, useCancelScheduled } from '#/hooks/use-scheduled';
import { useTransfers } from '#/hooks/use-transfers';
import { formatCurrency } from '#/lib/formatters';
import { Button } from '#/components/ui/button';
import { CustomToast } from '#/components/ui/custom-toast';
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

const NOTE_COLORS: Record<
  TransferNote | 'default',
  { bg: string; text: string; border: string; accent: string }
> = {
  subscription: { bg: '#FFF9DB', text: '#7C5800', border: '#FFD600', accent: '#FFD600' },
  rent: { bg: '#FFF0E6', text: '#7C2E00', border: '#FF6B00', accent: '#FF6B00' },
  food: { bg: '#E6F9F0', text: '#005C2B', border: '#00C853', accent: '#00C853' },
  transport: { bg: '#E6F0FF', text: '#003399', border: '#2979FF', accent: '#2979FF' },
  shopping: { bg: '#FFE6F0', text: '#7C0033', border: '#FF4081', accent: '#FF4081' },
  utilities: { bg: '#F3E6FF', text: '#4A0080', border: '#AA00FF', accent: '#AA00FF' },
  entertainment: { bg: '#FFE6E6', text: '#7C0000', border: '#FF1744', accent: '#FF1744' },
  other: { bg: '#F5F5F5', text: '#444444', border: '#9E9E9E', accent: '#9E9E9E' },
  default: { bg: '#F0F0FF', text: '#1a1a66', border: '#6666ff', accent: '#6666ff' },
};

type ScheduleStatus = 'upcoming' | 'sent' | 'failed' | 'cancelled';

function deriveStatus(item: EnrichedScheduled): ScheduleStatus {
  if (item.deleted_at) return 'cancelled';
  if (item.executed_at) {
    return item.transfer?.status === 'failed' ? 'failed' : 'sent';
  }
  return 'upcoming';
}

const STATUS_CONFIG: Record<
  ScheduleStatus,
  {
    label: string;
    icon: React.FC<{ className?: string; strokeWidth?: number }>;
    bg: string;
    text: string;
    border: string;
  }
> = {
  upcoming: { label: 'UPCOMING', icon: Clock, bg: '#EEF2FF', text: '#3730A3', border: '#6366F1' },
  sent: { label: 'SENT', icon: CheckCircle2, bg: '#ECFDF5', text: '#065F46', border: '#10B981' },
  failed: { label: 'FAILED', icon: XCircle, bg: '#FEF2F2', text: '#991B1B', border: '#EF4444' },
  cancelled: { label: 'CANCELLED', icon: Ban, bg: '#F9FAFB', text: '#6B7280', border: '#D1D5DB' },
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
  const colors = (note && NOTE_COLORS[note]) || NOTE_COLORS.default;

  const status = deriveStatus(item);
  const statusCfg = STATUS_CONFIG[status];
  const StatusIcon = statusCfg.icon;

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
      style={{ borderLeft: `4px solid ${colors.accent}` }}
    >
      <div
        className="flex w-[72px] shrink-0 flex-col items-center justify-center py-3.5 leading-none"
        style={{ borderRight: `1px solid ${colors.border}22`, background: `${colors.bg}` }}
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
            style={{ background: colors.bg, borderColor: colors.border, color: colors.text }}
          >
            {badgeLabel}
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#aaa]">{subtitle}</span>
      </div>

      <div className="flex shrink-0 items-center gap-3 px-5">
        {/* Status pill */}
        <div
          className="flex items-center gap-1 border px-2 py-0.5"
          style={{ background: statusCfg.bg, borderColor: statusCfg.border, color: statusCfg.text }}
        >
          <StatusIcon className="h-2.5 w-2.5" strokeWidth={2.5} />
          <span className="font-mono text-[8px] font-bold uppercase tracking-[0.14em]">
            {statusCfg.label}
          </span>
        </div>

        {t && (
          <span className="text-[15px] font-bold text-black">
            {formatCurrency(t.amount_in_piastres)}
          </span>
        )}
        {status === 'upcoming' && (
          <button
            type="button"
            onClick={onCancel}
            className="flex h-7 w-7 items-center justify-center border border-neutral-200 text-neutral-300 transition-colors hover:border-[#ba1a1a] hover:text-[#ba1a1a]"
            title="Cancel schedule"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}

const PAGE_SIZE = 10;

export function ScheduledTab({ onNewSchedule }: ScheduledTabProps) {
  const [page, setPage] = useState(1);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const { data: scheduled = [], isLoading } = useScheduledTransfers();
  const { data: transfers = [] } = useTransfers();

  const scheduledList = scheduled ?? [];
  const transfersList = transfers ?? [];
  const cancelScheduled = useCancelScheduled();

  const handleCancelConfirm = () => {
    if (!confirmId) return;
    cancelScheduled.mutate(confirmId, {
      onSuccess: () => {
        toast.custom((id) => (
          <CustomToast
            id={id}
            type="success"
            message="Transfer cancelled"
            description="The scheduled transfer has been removed."
          />
        ));
      },
      onError: () => {
        toast.custom((id) => (
          <CustomToast
            id={id}
            type="error"
            message="Failed to cancel"
            description="Something went wrong. Please try again."
          />
        ));
      },
      onSettled: () => setConfirmId(null),
    });
  };

  const enriched: EnrichedScheduled[] = scheduledList.map((s) => ({
    ...s,
    transfer: transfersList.find((t) => t.id === s.transfer_id),
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
        <StatCard label="Total Scheduled" value={String(scheduledList.length)} />
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
              <ScheduledRow key={item.id} item={item} onCancel={() => setConfirmId(item.id)} />
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

      {confirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
        >
          <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-200 w-full max-w-sm border-4 border-black bg-white p-6 shadow-[8px_8px_0_#000]">
            <div className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              CONFIRM ACTION
            </div>
            <h2 className="mb-2 text-xl font-bold tracking-tight text-black">Cancel Transfer?</h2>
            <p className="mb-6 font-mono text-[11px] leading-relaxed uppercase tracking-wider text-neutral-500">
              This scheduled transfer will be removed and will not be processed.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                className="flex-1 border-2 border-neutral-300 bg-white px-4 py-3 text-sm font-bold uppercase tracking-wider text-neutral-600 transition-colors hover:border-black hover:text-black"
              >
                Keep it
              </button>
              <button
                type="button"
                onClick={handleCancelConfirm}
                disabled={cancelScheduled.isPending}
                className="flex-1 border-2 border-black bg-black px-4 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#ba1a1a] hover:border-[#ba1a1a] disabled:opacity-60"
              >
                {cancelScheduled.isPending ? 'Cancelling…' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
