import { createFileRoute } from "@tanstack/react-router"
import { TransferDetail } from "#/features/transfers/TransferDetail"

export const Route = createFileRoute("/_auth/transfers/$transferId")({
  component: TransferDetailPage,
})

function TransferDetailPage() {
  const { transferId } = Route.useParams()
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black uppercase tracking-tight">
        Transfer Details
      </h1>
      <TransferDetail transferId={transferId} />
    </div>
  )
}