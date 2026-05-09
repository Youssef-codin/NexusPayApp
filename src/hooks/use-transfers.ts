import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transferApi } from '#/api/client';
import { queryKeys } from '#/lib/query-keys';

export function useTransfers() {
  return useQuery({
    queryKey: queryKeys.transfers.list(),
    queryFn: async () => {
      const response = await transferApi.getTransfers();
      return response.transfers;
    },
  });
}

export function useTransfer(id: string) {
  return useQuery({
    queryKey: queryKeys.transfers.detail(id),
    queryFn: async () => {
      const response = await transferApi.getTransfer(id);
      return response.transfer;
    },
    enabled: !!id,
  });
}

export function useSendMoney() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      to_wallet_id: string;
      amount_in_piastres: number;
      note?: string;
      scheduled_at?: string;
    }) => transferApi.sendMoney(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transfers.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.all });
    },
  });
}
