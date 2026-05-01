import { useScheduledTransfer, useCancelScheduled } from "#/hooks/use-scheduled"
import { formatCurrency, formatDateTime } from "#/lib/formatters"
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"
import { Button } from "#/components/ui/button"
import { LoadingSpinner } from "#/components/LoadingSpinner"

interface ScheduledDetailProps {
  scheduledId: string
}

export function ScheduledDetail({ scheduledId }: ScheduledDetailProps) {
  const { data: scheduled, isLoading, error } = useScheduledTransfer(scheduledId)
  const cancelScheduled = useCancelScheduled()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error || !scheduled) {
    return (
      <Card className="border-2 border-black bg-white">
        <CardContent className="pt-6">
          <p className="text-red-600 font-medium">Scheduled transfer not found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-black bg-white shadow-[4px_4px_0px_#000000]">
      <CardHeader className="border-b-2 border-black">
        <CardTitle className="text-lg font-bold text-black uppercase tracking-wider">
          Scheduled Transfer Details
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="flex justify-between items-center border-b-2 border-black pb-4">
          <span className="font-bold text-black uppercase tracking-wider">
            Amount
          </span>
          <span className="text-3xl font-bold text-black">
            {formatCurrency(scheduled.amount)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-neutral-600 font-medium uppercase tracking-wider">
              Recipient
            </p>
            <p className="font-bold text-black">{scheduled.recipientName}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-600 font-medium uppercase tracking-wider">
              Status
            </p>
            <span
              className={`inline-block text-sm font-bold uppercase tracking-wider px-2 py-1 ${
                scheduled.status === "pending"
                  ? "bg-yellow-400 text-black"
                  : scheduled.status === "completed"
                  ? "bg-[#00ff87] text-black"
                  : scheduled.status === "cancelled"
                  ? "bg-neutral-400 text-black"
                  : "bg-red-600 text-white"
              }`}
            >
              {scheduled.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-neutral-600 font-medium uppercase tracking-wider">
              Scheduled For
            </p>
            <p className="font-bold text-black">
              {formatDateTime(scheduled.scheduledAt)}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-600 font-medium uppercase tracking-wider">
              Created
            </p>
            <p className="font-bold text-black">
              {formatDateTime(scheduled.createdAt)}
            </p>
          </div>
          {scheduled.executedAt && (
            <div>
              <p className="text-sm text-neutral-600 font-medium uppercase tracking-wider">
                Executed
              </p>
              <p className="font-bold text-black">
                {formatDateTime(scheduled.executedAt)}
              </p>
            </div>
          )}
          {scheduled.note && (
            <div className="col-span-2">
              <p className="text-sm text-neutral-600 font-medium uppercase tracking-wider">
                Note
              </p>
              <p className="font-bold text-black">{scheduled.note}</p>
            </div>
          )}
        </div>
        {scheduled.status === "pending" && (
          <Button
            onClick={() => cancelScheduled.mutate(scheduledId)}
            disabled={cancelScheduled.isPending}
            className="w-full bg-red-600 text-white hover:bg-red-700 border-2 border-black font-bold uppercase tracking-wider shadow-[4px_4px_0px_#000000]"
          >
            {cancelScheduled.isPending ? "Cancelling..." : "Cancel Transfer"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}