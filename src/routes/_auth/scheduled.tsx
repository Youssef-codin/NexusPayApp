import { createFileRoute } from "@tanstack/react-router"
import { CreateScheduledForm } from "#/features/scheduled/CreateScheduledForm"
import { ScheduledList } from "#/features/scheduled/ScheduledList"

export const Route = createFileRoute("/_auth/scheduled")({
  component: Scheduled,
})

function Scheduled() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-black uppercase tracking-tight">
        Scheduled Transfers
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <CreateScheduledForm />
        </div>
        <div>
          <ScheduledList />
        </div>
      </div>
    </div>
  )
}