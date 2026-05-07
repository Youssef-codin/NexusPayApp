import { formatCurrency } from '#/lib/formatters';
import type { IMonthSummary } from '#/types/dashboard';

interface MonthSummaryProps {
  summary: IMonthSummary;
}

function formatSigned(piastres: number): string {
  const sign = piastres > 0 ? '+' : piastres < 0 ? '-' : '';
  return `${sign}${formatCurrency(Math.abs(piastres))}`;
}

export function MonthSummary({ summary }: MonthSummaryProps) {
  return (
    <section className="border-2 border-black bg-black p-6 text-white shadow-[6px_6px_0px_#000000]">
      <header className="border-b-2 border-white/30 pb-3">
        <h2 className="text-xl font-semibold uppercase tracking-tight">This Month</h2>
      </header>

      <div className="mt-6 space-y-6">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/50">
            Total Sent
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-white">
            {formatSigned(summary.totalSentInPiastres)}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/50">
            Total Received
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-[#00ff87]">
            {formatSigned(summary.totalReceivedInPiastres)}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/50">
            Transactions
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-white">
            {summary.transactionsCount}
          </p>
        </div>
      </div>
    </section>
  );
}
