import { useState } from 'react';
import { CreditCard, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePayments } from '#/hooks/use-wallet';
import { formatCurrency } from '#/lib/formatters';
import { Button } from '#/components/ui/button';
import type { Payment } from '#/types';

interface WalletTabProps {
  onDeposit: () => void;
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

function PaymentRow({ payment }: { payment: Payment }) {
  const date = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(payment.created_at));

  return (
    <div
      className="flex items-center gap-4 border-b border-neutral-100 bg-white px-5 py-3.5 last:border-b-0"
      style={{ borderLeft: '4px solid #00ff87' }}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-black"
        style={{ background: '#001a0d' }}
      >
        <CreditCard className="h-3.5 w-3.5" style={{ color: '#00ff87' }} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-black">{payment.description}</p>
        <p className="font-mono text-[10px] text-neutral-400">{date}</p>
      </div>

      <div className="flex items-center gap-3">
        <span
          className="border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em]"
          style={
            payment.status === 'pending'
              ? { background: '#fffbe6', color: '#9a7a00', borderColor: '#f0d800' }
              : payment.status === 'failed'
                ? { background: '#fff0f0', color: '#ba1a1a', borderColor: '#ffb3b3' }
                : { background: '#e6fff3', color: '#006b3c', borderColor: '#00cc6a' }
          }
        >
          {payment.status}
        </span>
        <span className="font-bold text-[#006b3c]">+{formatCurrency(payment.amount)}</span>
      </div>
    </div>
  );
}

const PAGE_SIZE = 10;

export function WalletTab({ onDeposit }: WalletTabProps) {
  const [page, setPage] = useState(1);
  const { data: payments = [], isLoading } = usePayments();

  const totalDeposited = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPages = Math.ceil(payments.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedPayments = [...payments]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="flex flex-col gap-5">
      {/* Stats + CTA row */}
      <div className="flex flex-wrap items-start gap-3">
        <StatCard label="Total Deposited" value={formatCurrency(totalDeposited)} />
        <StatCard
          label="Pending"
          value={formatCurrency(totalPending)}
          valueClass="text-[#9a7a00]"
        />
        <StatCard label="Top-Ups" value={String(payments.length)} />
        <div className="flex-1" />
        <button
          type="button"
          onClick={onDeposit}
          className="flex shrink-0 items-center gap-2 border-4 border-black bg-[#00ff87] px-6 py-3 text-sm font-bold uppercase tracking-wider shadow-[4px_4px_0_#000000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#000000]"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          Top Up
        </button>
      </div>

      {/* Deposit history */}
      <div className="border-2 border-black bg-white">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 p-12 text-center">
            <div className="border-2 border-black bg-neutral-100 p-4">
              <CreditCard className="h-9 w-9 stroke-[1.5] text-black" />
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-black">
              No deposits yet
            </p>
            <p className="max-w-[240px] text-xs font-medium text-neutral-500">
              Top-up your wallet to get started. Your deposit history will appear here.
            </p>
          </div>
        ) : (
          <>
            {paginatedPayments.map((payment) => (
              <PaymentRow key={payment.id} payment={payment} />
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
