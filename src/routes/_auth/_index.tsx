import { createFileRoute } from "@tanstack/react-router";
import { BalanceDisplay } from "#/features/wallet/BalanceDisplay";
import { TopUpButton } from "#/features/wallet/TopUpButton";
import { TransferList } from "#/features/transfers/TransferList";

export const Route = createFileRoute("/_auth/_index")({
	component: Dashboard,
});

function Dashboard() {
	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold text-black mb-6 uppercase tracking-tight">
					Dashboard
				</h1>
				<div className="flex gap-4 items-start">
					<div className="flex-1">
						<BalanceDisplay />
					</div>
					<div>
						<TopUpButton />
					</div>
				</div>
			</div>
			<div>
				<h2 className="text-xl font-bold text-black mb-4 uppercase tracking-wider">
					Recent Activity
				</h2>
				<TransferList />
			</div>
		</div>
	);
}

