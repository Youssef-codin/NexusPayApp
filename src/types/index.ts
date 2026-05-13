export interface User {
  id: string;
  email: string;
  full_name: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
}

export interface TransferUser {
  id: string;
  full_name: string;
}

export interface Transfer {
  id: string;
  from_wallet_id: string;
  from_user: TransferUser;
  to_wallet_id: string;
  to_user: TransferUser;
  amount_in_piastres: number;
  direction: 'debit' | 'credit';
  status: 'completed' | 'pending' | 'failed';
  note?: string;
  created_at: string;
}

export interface TransferListResponse {
  from_wallet_id: string;
  transfers: Transfer[];
}

export interface TransferDetailResponse {
  transfer: Transfer;
}

export interface ScheduledTransfer {
  id: string;
  transfer_id: string;
  scheduled_at: string;
  executed_at: string | null;
  deleted_at: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  direction: 'incoming' | 'outgoing';
  status: 'completed' | 'pending' | 'failed';
  description: string;
  created_at: string;
}

export interface ScheduledTransferListResponse {
  scheduled_transfers: ScheduledTransfer[];
}

export interface AuthResponse {
  email: string;
  full_name: string;
  jwt_token: string;
  refresh_token: string;
}

export interface RefreshResponse {
  jwt_token: string;
  refresh_token: string;
}

export interface TopUpResponse {
  client_secret: string;
  amount: number;
  currency: string;
}

export interface UserSearchResult {
  id: string;
  wallet_id?: string;
  full_name: string;
}

export interface ApiError {
  error: string;
  message: string;
  status_code: number;
}
