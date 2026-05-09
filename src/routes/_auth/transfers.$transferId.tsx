import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/transfers/$transferId')({
  component: TransferDetailPage,
});

function TransferDetailPage() {
  Route.useParams();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black uppercase tracking-tight">Transfer Details</h1>
    </div>
  );
}
