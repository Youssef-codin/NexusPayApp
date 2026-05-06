import { Link } from "@tanstack/react-router"
import { Inbox, Wallet } from "lucide-react"
import { Button } from "#/components/ui/button"
import { TransactionRow } from "./TransactionRow"
import type { MockActivityItem } from "#/lib/mock-data"

interface RecentActivityProps {
  items: MockActivityItem[]
  totalCount?: number
}

export function RecentActivity({ items, totalCount = 58 }: RecentActivityProps) {
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

      <div className="mt-5">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center border-2 border-black bg-white p-12 text-center shadow-[6px_6px_0px_#000000]">
            <div className="mb-6 border-2 border-black bg-neutral-100 p-4">
              <Inbox className="size-10 text-black stroke-[1.5]" />
            </div>
            <h3 className="mb-2 text-xl font-black uppercase tracking-widest text-black">
              No activity yet
            </h3>
            <p className="mb-10 max-w-[280px] text-sm font-medium text-neutral-500">
              Your transactions will appear here once you start using NexusPay.
            </p>
            <Button asChild variant="dark" className="h-12 px-8 text-xs font-black tracking-widest">
              <Link to="/transfers">
                <Wallet className="mr-2 size-5 stroke-[3]" />
                MAKE A TRANSACTION
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item) => <TransactionRow key={item.id} item={item} />)}
            </div>
            <div className="mt-4 border-t-2 border-black pt-3 text-center text-xs font-medium uppercase tracking-widest text-neutral-600">
              Showing {items.length} of {totalCount} transactions
            </div>
          </>
        )}
      </div>
    </section>
  )
}

