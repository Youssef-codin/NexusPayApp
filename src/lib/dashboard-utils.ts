import type { Transfer } from '#/types';
import type { ActivityItem, ActivityKind, ActivityStatus, IMonthSummary } from '#/types/dashboard';

const NOTE_KIND_MAP: Record<string, ActivityKind> = {
  subscription: 'subscription',
  rent: 'merchant',
  shopping: 'merchant',
  food: 'merchant',
  transport: 'merchant',
  utilities: 'merchant',
  entertainment: 'merchant',
};

function getKindFromNote(note: string | undefined): ActivityKind {
  if (!note) return 'person';
  const kind = NOTE_KIND_MAP[note.toLowerCase()];
  return kind ?? 'person';
}

function getStatusFromTransfer(
  status: Transfer['status'],
  direction: Transfer['direction']
): ActivityStatus {
  if (status === 'pending') return 'pending';
  if (status === 'failed') return 'failed';
  return direction === 'credit' ? 'received' : 'cleared';
}

export function transformTransfersToActivity(transfers: Transfer[]): ActivityItem[] {
  return transfers.map((t) => ({
    id: t.id,
    name: t.direction === 'credit' ? t.from_user.full_name : t.to_user.full_name,
    kind: getKindFromNote(t.note),
    amountInPiastres: t.direction === 'debit' ? -t.amount_in_piastres : t.amount_in_piastres,
    status: getStatusFromTransfer(t.status, t.direction),
    occurredAt: t.created_at,
  }));
}

export function computeMonthSummary(transfers: Transfer[]): IMonthSummary {
  const now = new Date();
  const thisMonth = transfers.filter((t) => {
    const d = new Date(t.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const sent = thisMonth
    .filter((t) => t.direction === 'debit')
    .reduce((sum, t) => sum + t.amount_in_piastres, 0);

  const received = thisMonth
    .filter((t) => t.direction === 'credit')
    .reduce((sum, t) => sum + t.amount_in_piastres, 0);

  return {
    totalSentInPiastres: -sent,
    totalReceivedInPiastres: received,
    transactionsCount: thisMonth.length,
  };
}
