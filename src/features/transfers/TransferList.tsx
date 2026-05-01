import { Link } from "@tanstack/react-router"
import { useTransfers } from "#/hooks/use-transfers"
import { formatCurrency, formatRelativeTime } from "#/lib/formatters"
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"
import { ListSkeleton } from "#/components/LoadingSpinner"

export function TransferList() {
  const { data: transfers, isLoading, error } = useTransfers()

  if (isLoading) {
    return <ListSkeleton />
  }

  if (error || !transfers) {
    return (
      <Card className="border-2 border-black bg-white">
        <CardContent className="pt-6">
          <p className="text-red-600 font-medium">Failed to load transfers</p>
        </CardContent>
      </Card>
    )
  }

  if (transfers.length === 0) {
    return (
      <Card className="border-2 border-black bg-white">
        <CardContent className="pt-6">
          <p className="text-neutral-600 font-medium">No transfers yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-black bg-white shadow-[4px_4px_0px_#000000]">
      <CardHeader className="border-b-2 border-black">
        <CardTitle className="text-lg font-bold text-black uppercase tracking-wider">
          Recent Transfers
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {transfers.map((transfer) => (
            <Link
              key={transfer.id}
              to="/transfers/$transferId"
              params={{ transferId: transfer.id }}
              className="block border-2 border-black p-4 hover:bg-[#00ff87]/20 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-black">
                    {transfer.recipientName}
                  </p>
                  <p className="text-sm text-neutral-600 font-medium">
                    {transfer.note || "No note"}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1 font-medium">
                    {formatRelativeTime(transfer.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-black">
                    -{formatCurrency(transfer.amount)}
                  </p>
                  <span
                    className={`inline-block text-xs font-bold uppercase tracking-wider px-2 py-1 ${
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
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}