import { Link } from "@tanstack/react-router"
import { useScheduledTransfers, useCancelScheduled } from "#/hooks/use-scheduled"
import { formatDateTime } from "#/lib/formatters"
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"
import { ListSkeleton } from "#/components/LoadingSpinner"
import { Button } from "#/components/ui/button"

export function ScheduledList() {
  const { data: scheduled, isLoading, error } = useScheduledTransfers()
  const cancelScheduled = useCancelScheduled()

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
            <div
              key={item.id}
              className="border-2 border-black p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-black">ID: {item.id.slice(0, 8)}...</p>
                  <p className="text-sm text-neutral-600 font-medium">
                    Transfer ID: {item.transfer_id.slice(0, 8)}...
                  </p>
                  <p className="text-sm text-neutral-500 font-medium">
                    Scheduled: {formatDateTime(item.scheduled_at)}
                  </p>
                  <p className="text-sm text-neutral-500 font-medium">
                    Created: {formatDateTime(item.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  {item.executed_at ? (
                    <span className="inline-block text-xs font-bold uppercase tracking-wider px-2 py-1 bg-[#00ff87] text-black">
                      Executed
                    </span>
                  ) : (
                    <Button
                      onClick={() => cancelScheduled.mutate(item.id)}
                      disabled={cancelScheduled.isPending}
                      className="text-xs bg-red-600 text-white hover:bg-red-700 border border-black font-bold uppercase tracking-wider"
                    >
                      {cancelScheduled.isPending ? "Cancelling..." : "Cancel"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}