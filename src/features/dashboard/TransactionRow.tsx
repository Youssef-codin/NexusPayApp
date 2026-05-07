import { Globe, Store, User } from "lucide-react"
import { formatCurrency } from "#/lib/formatters"
import { cn } from "#/lib/utils"
import type { ActivityItem } from "#/types/dashboard"

interface TransactionRowProps {
  item: ActivityItem
}

const KIND_ICON = {
  merchant: Store,
  person: User,
  subscription: Globe,
} as const

const STATUS_LABEL: Record<ActivityItem["status"], string> = {
  cleared: "Cleared",
  received: "Received",
  pending: "Pending",
  failed: "Failed",
}

function formatOccurredAt(iso: string): string {
  const date = new Date(iso)
  const datePart = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date)
  return `${datePart} - ${timePart}`
}

export function TransactionRow({ item }: TransactionRowProps) {
  const Icon = KIND_ICON[item.kind]
  const isPositive = item.amountInPiastres > 0
  const sign = isPositive ? "+" : "-"
  const absAmount = Math.abs(item.amountInPiastres)

  return (
    <div className="flex items-center gap-4 border-2 border-black bg-white p-4 shadow-[4px_4px_0px_#000000]">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-black text-[#00ff87]">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold uppercase tracking-wider text-black">
          {item.name}
        </p>
        <p className="mt-1 text-xs font-medium text-neutral-500">
          {formatOccurredAt(item.occurredAt)}
        </p>
      </div>

      <div className="flex flex-col items-end gap-1">
        <p
          className={cn(
            "text-base font-semibold tabular-nums",
            isPositive ? "text-[#00b85f]" : "text-black"
          )}
        >
          {sign} {formatCurrency(absAmount)}
        </p>
        <span
          className={cn(
            "px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.15em]",
            item.status === "received"
              ? "bg-[#00ff87] text-black"
              : "bg-black text-white"
          )}
        >
          {STATUS_LABEL[item.status]}
        </span>
      </div>
    </div>
  )
}
