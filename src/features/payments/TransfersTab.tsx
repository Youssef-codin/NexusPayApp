import { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTransfers } from '#/hooks/use-transfers';
import { formatCurrency } from '#/lib/formatters';
import { Button } from '#/components/ui/button';
import { cn } from '#/lib/utils';
import type { Transfer } from '#/types';

interface TransfersTabProps {
  onNewTransfer: () => void;
}

function StatCard({
  label,
  value,
  valueClass = 'text-black',
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="min-w-[130px] border-2 border-black bg-white p-4 shadow-[4px_4px_0_#000000]">
      <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-400">
        {label}
      </p>
      <p className={`text-xl font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}

const STATUS_BADGE: Partial<
  Record<Transfer['status'], { background: string; color: string; borderColor: string }>
> = {
  completed: { background: '#e6fff3', color: '#006b3c', borderColor: '#00cc6a' },
  pending: { background: '#fffbe6', color: '#9a7a00', borderColor: '#f0d800' },
  failed: { background: '#fff0f0', color: '#ba1a1a', borderColor: '#ffb3b3' },
};

function TransferRow({ transfer }: { transfer: Transfer }) {
  const isDebit = transfer.direction === 'debit';
  const counterparty = isDebit ? transfer.to_user.full_name : transfer.from_user.full_name;
  const walletRef = (isDebit ? transfer.to_wallet_id : transfer.from_wallet_id).slice(0, 8);
  const amount = transfer.amount_in_piastres;
  const badge = STATUS_BADGE[transfer.status] ?? {
    background: '#f0f0f0',
    color: '#555',
    borderColor: '#aaa',
  };

  const date = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(transfer.created_at));

  return (
    <div
      className="flex items-center gap-4 border-b border-neutral-100 bg-white px-5 py-3.5 last:border-b-0"
      style={{ borderLeft: `4px solid ${isDebit ? '#ff6b6b' : '#00ff87'}` }}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-black"
        style={{ background: isDebit ? '#1a0000' : '#001a0d' }}
      >
        {isDebit ? (
          <ArrowUpRight className="h-3.5 w-3.5 stroke-[2]" style={{ color: '#ff6b6b' }} />
        ) : (
          <ArrowDownLeft className="h-3.5 w-3.5 stroke-[2]" style={{ color: '#00ff87' }} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-black">{counterparty}</span>
          <span className="font-mono text-[10px] font-bold text-neutral-400">
            NXP ••••{walletRef}
          </span>
        </div>
        <p className="mt-0.5 font-mono text-[10px] text-neutral-400">{date}</p>
      </div>

      <div className="flex items-center gap-3">
        <span
          className="border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em]"
          style={badge}
        >
          {transfer.status}
        </span>
        <span className={cn('font-bold', isDebit ? 'text-[#ba1a1a]' : 'text-[#005c2e]')}>
          {isDebit ? '-' : '+'}
          {formatCurrency(amount)}
        </span>
      </div>
    </div>
  );
}

const PAGE_SIZE = 10;

export function TransfersTab({ onNewTransfer }: TransfersTabProps) {
  const [page, setPage] = useState(1);
  const { data: transfers = [], isLoading } = useTransfers();

  const totalSent = transfers
    .filter((t) => t.direction === 'debit' && t.status === 'completed')
    .reduce((s, t) => s + t.amount_in_piastres, 0);

  const totalPages = Math.ceil(transfers.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedTransfers = [...transfers]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="flex flex-col gap-5">
      {/* Stats + CTA row */}
      <div className="flex flex-wrap items-start gap-3">
        <StatCard label="Total Sent" value={`-${formatCurrency(totalSent)}`} />
        <StatCard label="Transfers" value={String(transfers.length)} />
        <div className="flex-1" />
        <button
          type="button"
          onClick={onNewTransfer}
          className="flex shrink-0 items-center gap-2 border-4 border-black bg-[#00ff87] px-6 py-3 text-sm font-bold uppercase tracking-wider shadow-[4px_4px_0_#000000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#000000]"
        >
          <ArrowUpRight className="h-4 w-4 stroke-[3]" />
          New Transfer
        </button>
      </div>

      {/* Transfer rows */}
      <div className="border-2 border-black bg-white">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
          </div>
        ) : transfers.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm font-medium text-neutral-400">No transfers yet.</p>
          </div>
        ) : (
          <>
            {paginatedTransfers.map((t) => (
              <TransferRow key={t.id} transfer={t} />
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
