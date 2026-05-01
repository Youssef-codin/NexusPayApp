import api from "./axios"
import type {
  AuthResponse,
  User,
  Wallet,
  Transfer,
  ScheduledTransfer,
  Transaction,
} from "#/types"

export const client = {
  get: <T>(url: string, config?: Record<string, unknown>) =>
    api.get<T>(url, config).then((res) => res.data),

  post: <T>(url: string, data?: unknown, config?: Record<string, unknown>) =>
    api.post<T>(url, data, config).then((res) => res.data),

  patch: <T>(url: string, data?: unknown, config?: Record<string, unknown>) =>
    api.patch<T>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: Record<string, unknown>) =>
    api.delete<T>(url, config).then((res) => res.data),
}

export const authApi = {
  login: (email: string, password: string) =>
    client.post<AuthResponse>("/auth/login", { email, password }),

  register: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }) => client.post<AuthResponse>("/auth/register", data),

  me: () => client.get<User>("/auth/me"),

  refresh: (refreshToken: string) =>
    client.post<{ accessToken: string; refreshToken: string }>(
      "/auth/refresh",
      { refreshToken }
    ),
}

export const walletApi = {
  getWallet: () => client.get<Wallet>("/wallet"),

  getTransactions: () => client.get<Transaction[]>("/wallet/transactions"),

  topUp: (amount: number) =>
    client.post<Wallet>("/wallet/top-up", { amount }),
}

export const transferApi = {
  getTransfers: () => client.get<Transfer[]>("/transfers"),

  getTransfer: (id: string) => client.get<Transfer>(`/transfers/${id}`),

  sendMoney: (data: {
    recipientId: string
    recipientName: string
    amount: number
    note?: string
  }) => client.post<Transfer>("/transfers", data),
}

export const scheduledApi = {
  getScheduled: () => client.get<ScheduledTransfer[]>("/scheduled"),

  getScheduledTransfer: (id: string) =>
    client.get<ScheduledTransfer>(`/scheduled/${id}`),

  createScheduled: (data: {
    recipientId: string
    recipientName: string
    amount: number
    note?: string
    scheduledAt: string
  }) => client.post<ScheduledTransfer>("/scheduled", data),

  cancelScheduled: (id: string) =>
    client.patch<ScheduledTransfer>(`/scheduled/${id}/cancel`),
}