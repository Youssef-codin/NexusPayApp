import { Link } from "@tanstack/react-router"
import { useScheduledTransfers } from "#/hooks/use-scheduled"
import { formatCurrency, formatDateTime } from "#/lib/formatters"
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"
import { ListSkeleton } from "#/components/LoadingSpinner"

export function ScheduledList() {
  const { data: scheduled, isLoading, error } = useScheduledTransfers()

  if (isLoading) {
    return <ListSkeleton />
  }

  if (error || !scheduled) {
    return (
      <Card className="border-2 border-black bg-white">
        <CardContent className="pt-6">
          <p className="text-red-600 font-medium">
            Failed to load scheduled transfers
          </p>
        </CardContent>
      </Card>
    )
  }

  if (scheduled.length === 0) {
    return (
      <Card className="border-2 border-black bg-white">
        <CardContent className="pt-6">
          <p className="text-neutral-600 font-medium">No scheduled transfers</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-black bg-white shadow-[4px_4px_0px_#000000]">
      <CardHeader className="border-b-2 border-black">
        <CardTitle className="text-lg font-bold text-black uppercase tracking-wider">
          Scheduled Transfers
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {scheduled.map((item) => (
            <Link
              key={item.id}
              to="/scheduled/$scheduledId"
              params={{ scheduledId: item.id }}
              className="block border-2 border-black p-4 hover:bg-[#00ff87]/20 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-black">{item.recipientName}</p>
                  <p className="text-sm text-neutral-600 font-medium">
                    Scheduled: {formatDateTime(item.scheduledAt)}
                  </p>
                  <p className="text-sm text-neutral-500 font-medium">
                    {item.note || "No note"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-black">
                    {formatCurrency(item.amount)}
                  </p>
                  <span
                    className={`inline-block text-xs font-bold uppercase tracking-wider px-2 py-1 ${
                      item.status === "pending"
                        ? "bg-yellow-400 text-black"
                        : item.status === "completed"
                        ? "bg-[#00ff87] text-black"
                        : item.status === "cancelled"
                        ? "bg-neutral-400 text-black"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {item.status}
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