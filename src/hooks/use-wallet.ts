import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { walletApi } from "#/api/client"
import { queryKeys } from "#/lib/query-keys"

export function useWallet() {
  return useQuery({
    queryKey: queryKeys.wallet.all,
    queryFn: () => walletApi.getWallet(),
  })
}

export function useTopUp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (amount: number) => walletApi.topUp(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.all })
    },
  })
}