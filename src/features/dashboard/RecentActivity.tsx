import { Button } from "#/components/ui/button"
import { TransactionRow } from "./TransactionRow"
import type { MockActivityItem } from "#/lib/mock-data"

interface RecentActivityProps {
  items: MockActivityItem[]
}

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <section>
      <header className="flex items-end justify-between border-b-2 border-black pb-3">
        <h2 className="text-xl font-semibold uppercase tracking-tight text-black">
          Recent Activity
        </h2>
        <Button type="button" variant="link" size="xs">
          View All
        </Button>
      </header>

      <div className="mt-5 space-y-4">
        {items.length === 0 ? (
          <div className="border-2 border-black bg-white p-6 text-sm font-medium text-neutral-600">
            No activity yet
          </div>
        ) : (
          items.map((item) => <TransactionRow key={item.id} item={item} />)
        )}
      </div>
    </section>
  )
}

