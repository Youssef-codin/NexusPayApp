import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { walletApi } from '#/api/client';
import { queryKeys } from '#/lib/query-keys';
import { useAuthStore } from '#/store/auth-store';

export function useWallet() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: queryKeys.wallet.all,
    queryFn: () => walletApi.getWalletByUserId(userId!),
    enabled: !!userId,
  });
}

export function useTopUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount: number) => walletApi.topUp(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.all });
    },
  });
}
