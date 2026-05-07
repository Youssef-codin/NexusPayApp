import { createFileRoute } from '@tanstack/react-router';
import { BalanceHero } from '#/features/dashboard/BalanceHero';
import { MonthSummary } from '#/features/dashboard/MonthSummary';
import { RecentActivity } from '#/features/dashboard/RecentActivity';
import { useWallet } from '#/hooks/use-wallet';
import { useTransfers } from '#/hooks/use-transfers';
import { transformTransfersToActivity, computeMonthSummary } from '#/lib/dashboard-utils';

export const Route = createFileRoute('/_auth/_index')({
  component: Dashboard,
});

function Dashboard() {
  const { data: wallet } = useWallet();
  const { data: transfers } = useTransfers();

  if (!wallet || !transfers) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-sm font-medium text-neutral-500">Loading...</div>
      </div>
    );
  }

  const activity = transformTransfersToActivity(transfers);
  const monthSummary = computeMonthSummary(transfers);

  return (
    <div className="space-y-8">
      <BalanceHero balanceInPiastres={wallet.balance} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity items={activity} totalCount={transfers.length} />
        </div>
        <div className="self-start">
          <MonthSummary summary={monthSummary} />
        </div>
      </div>
    </div>
  );
}
