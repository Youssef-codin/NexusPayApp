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
  recent_activity: [],
  month_summary: {
    total_sent_in_piastres: -2_485_000,
    total_received_in_piastres: 4_230_000,
    transactions_count: 58,
  },
}
