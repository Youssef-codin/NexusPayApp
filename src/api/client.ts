import api from "./axios"
import type {
  AuthResponse,
  RefreshResponse,
  User,
  Wallet,
  TopUpResponse,
  Transfer,
  TransferListResponse,
  TransferDetailResponse,
  ScheduledTransfer,
  ScheduledTransferListResponse,
  UserSearchResult,
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

  register: (data: { email: string; password: string; full_name: string }) =>
    client.post<AuthResponse>("/auth/register", data),

  refresh: (refreshToken: string) =>
    client.post<RefreshResponse>("/auth/refresh", { refresh_token: refreshToken }),

  logout: () => client.post<void>("/users/logout"),

  test: () => client.get<User>("/users/test"),
}

export const walletApi = {
  getWallet: () => client.get<Wallet>("/wallet/"),

  topUp: (amount: number) =>
    client.patch<TopUpResponse>("/wallet/", { amount }),
}

export const transferApi = {
  getTransfers: () => client.get<TransferListResponse>("/transfers/"),

  getTransfer: (id: string) =>
    client.get<TransferDetailResponse>(`/transfers/${id}`),

  sendMoney: (data: {
    to_wallet_id: string
    amount_in_piastres: number
    note?: string
    scheduled_at?: string
  }) => client.post<Transfer>("/transfers/", data),
}

export const scheduledApi = {
  getScheduled: () =>
    client.get<ScheduledTransferListResponse>("/transfers/scheduled/"),

  cancelScheduled: (id: string) =>
    client.delete<{ cancelled_id: string }>(`/transfers/scheduled/${id}`),
}

export const userApi = {
  search: (name: string) =>
    client.get<UserSearchResult[]>("/users", { params: { name } }),
}