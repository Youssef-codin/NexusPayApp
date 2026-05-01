import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { transferApi } from "#/api/client"
import { queryKeys } from "#/lib/query-keys"

export function useTransfers() {
  return useQuery({
    queryKey: queryKeys.transfers.list(),
    queryFn: () => transferApi.getTransfers(),
  })
}

export function useTransfer(id: string) {
  return useQuery({
    queryKey: queryKeys.transfers.detail(id),
    queryFn: () => transferApi.getTransfer(id),
    enabled: !!id,
  })
}

export function useSendMoney() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      recipientId: string
      recipientName: string
      amount: number
      note?: string
    }) => transferApi.sendMoney(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transfers.list() })
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.all })
    },
  })
}