import { createFileRoute } from "@tanstack/react-router"
import { ScheduledDetail } from "#/features/scheduled/ScheduledDetail"

export const Route = createFileRoute("/_auth/scheduled/$scheduledId")({
  component: ScheduledDetailPage,
})

function ScheduledDetailPage() {
  const { scheduledId } = Route.useParams()
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black uppercase tracking-tight">
        Scheduled Transfer Details
      </h1>
      <ScheduledDetail scheduledId={scheduledId} />
    </div>
  )
}