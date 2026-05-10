export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },
  wallet: {
    all: ['wallet'] as const,
    balance: () => [...queryKeys.wallet.all, 'balance'] as const,
  },
  transfers: {
    all: ['transfers'] as const,
    list: () => [...queryKeys.transfers.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.transfers.all, 'detail', id] as const,
    create: () => [...queryKeys.transfers.all, 'create'] as const,
  },
  scheduled: {
    all: ['scheduled'] as const,
    list: () => [...queryKeys.scheduled.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.scheduled.all, 'detail', id] as const,
    create: () => [...queryKeys.scheduled.all, 'create'] as const,
    cancel: (id: string) => [...queryKeys.scheduled.all, 'cancel', id] as const,
  },
  payments: {
    all: ['payments'] as const,
    list: () => [...queryKeys.payments.all, 'list'] as const,
  },
};
