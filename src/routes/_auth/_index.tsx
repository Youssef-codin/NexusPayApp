import { createFileRoute } from "@tanstack/react-router";
import { BalanceHero } from "#/features/dashboard/BalanceHero";
import { MonthSummary } from "#/features/dashboard/MonthSummary";
import { RecentActivity } from "#/features/dashboard/RecentActivity";
import { mockDashboard } from "#/lib/mock-data";

export const Route = createFileRoute("/_auth/_index")({
	component: Dashboard,
});

function Dashboard() {
	return (
		<div className="space-y-8">
			<BalanceHero
				balanceInPiastres={mockDashboard.balance_in_piastres}
			/>
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<RecentActivity items={mockDashboard.recent_activity} />
				</div>
				<MonthSummary summary={mockDashboard.month_summary} />
			</div>
		</div>
	);
}
