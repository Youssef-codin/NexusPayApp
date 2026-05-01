export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  createdAt: string
  updatedAt: string
}

export interface Wallet {
  id: string
  userId: string
  balance: number
  currency: string
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  walletId: string
  type: "credit" | "debit"
  amount: number
  description?: string
  reference?: string
  createdAt: string
}

export interface Transfer {
  id: string
  senderId: string
  recipientId: string
  recipientName: string
  amount: number
  note?: string
  status: "pending" | "completed" | "failed"
  createdAt: string
  completedAt?: string
}

export interface ScheduledTransfer {
  id: string
  senderId: string
  recipientId: string
  recipientName: string
  amount: number
  note?: string
  scheduledAt: string
  status: "pending" | "completed" | "cancelled" | "failed"
  createdAt: string
  executedAt?: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface ApiError {
  message: string
  code?: string
}