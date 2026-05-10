// NOTE: Valid note values for transfer categorization
// When creating a transfer, use one of these exact strings as the note
export type TransferNote =
  | 'subscription'
  | 'rent'
  | 'shopping'
  | 'food'
  | 'transport'
  | 'utilities'
  | 'entertainment'
  | 'other';

export type ActivityKind = 'merchant' | 'person' | 'subscription';

export type ActivityStatus = 'cleared' | 'received' | 'pending' | 'failed';

export interface ActivityItem {
  id: string;
  name: string;
  kind: ActivityKind;
  amountInPiastres: number;
  status: ActivityStatus;
  note?: TransferNote;
  occurredAt: string;
}

export interface IMonthSummary {
  totalSentInPiastres: number;
  totalReceivedInPiastres: number;
  transactionsCount: number;
}
