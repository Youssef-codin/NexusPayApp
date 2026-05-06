export type ActivityKind = "merchant" | "person" | "subscription"
export type ActivityStatus = "cleared" | "received" | "subscription"

export interface MockActivityItem {
  id: string
  name: string
  kind: ActivityKind
  amount_in_piastres: number
  status: ActivityStatus
  occurred_at: string
}

export interface MockMonthSummary {
  total_sent_in_piastres: number
  total_received_in_piastres: number
  transactions_count: number
}

export interface MockDashboard {
  balance_in_piastres: number
  recent_activity: MockActivityItem[]
  month_summary: MockMonthSummary
}

export const mockDashboard: MockDashboard = {
  balance_in_piastres: 120_458_000,
  recent_activity: [
    {
      id: "txn_001",
      name: "TechCorp Inc.",
      kind: "merchant",
      amount_in_piastres: -125_000,
      status: "cleared",
      occurred_at: "2026-04-24T14:32:00.000Z",
    },
    {
      id: "txn_002",
      name: "Alice Cooper",
      kind: "person",
      amount_in_piastres: 480_000,
      status: "received",
      occurred_at: "2026-04-23T09:15:00.000Z",
    },
    {
      id: "txn_003",
      name: "Cloud Services LLC",
      kind: "subscription",
      amount_in_piastres: -9_999,
      status: "subscription",
      occurred_at: "2026-04-21T18:00:00.000Z",
    },
  ],
  month_summary: {
    total_sent_in_piastres: -2_485_000,
    total_received_in_piastres: 4_230_000,
    transactions_count: 58,
  },
}
