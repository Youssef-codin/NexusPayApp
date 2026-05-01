import { useTransfer } from "#/hooks/use-transfers"
import { formatCurrency, formatDateTime } from "#/lib/formatters"
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"
import { LoadingSpinner } from "#/components/LoadingSpinner"

interface TransferDetailProps {
  transferId: string
}

export function TransferDetail({ transferId }: TransferDetailProps) {
  const { data: transfer, isLoading, error } = useTransfer(transferId)

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error || !transfer) {
    return (
      <Card className="border-2 border-black bg-white">
        <CardContent className="pt-6">
          <p className="text-red-600 font-medium">Transfer not found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-black bg-white shadow-[4px_4px_0px_#000000]">
      <CardHeader className="border-b-2 border-black">
        <CardTitle className="text-lg font-bold text-black uppercase tracking-wider">
          Transfer Details
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="flex justify-between items-center border-b-2 border-black pb-4">
          <span className="font-bold text-black uppercase tracking-wider">
            Amount
          </span>
          <span className="text-3xl font-bold text-black">
            {formatCurrency(transfer.amount)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-neutral-600 font-medium uppercase tracking-wider">
              Recipient
            </p>
            <p className="font-bold text-black">{transfer.recipientName}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-600 font-medium uppercase tracking-wider">
              Status
            </p>
            <span
              className={`inline-block text-sm font-bold uppercase tracking-wider px-2 py-1 ${
                transfer.status === "completed"
                  ? "bg-[#00ff87] text-black"
                  : transfer.status === "pending"
                  ? "bg-yellow-400 text-black"
                  : "bg-red-600 text-white"
              }`}
            >
              {transfer.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-neutral-600 font-medium uppercase tracking-wider">
              Created
            </p>
            <p className="font-bold text-black">
              {formatDateTime(transfer.createdAt)}
            </p>
          </div>
          {transfer.completedAt && (
            <div>
              <p className="text-sm text-neutral-600 font-medium uppercase tracking-wider">
                Completed
              </p>
              <p className="font-bold text-black">
                {formatDateTime(transfer.completedAt)}
              </p>
            </div>
          )}
          {transfer.note && (
            <div className="col-span-2">
              <p className="text-sm text-neutral-600 font-medium uppercase tracking-wider">
                Note
              </p>
              <p className="font-bold text-black">{transfer.note}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}