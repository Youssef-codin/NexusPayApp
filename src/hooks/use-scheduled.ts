import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { scheduledApi } from "#/api/client"
import { queryKeys } from "#/lib/query-keys"

export function useScheduledTransfers() {
  return useQuery({
    queryKey: queryKeys.scheduled.list(),
    queryFn: () => scheduledApi.getScheduled(),
  })
}

export function useScheduledTransfer(id: string) {
  return useQuery({
    queryKey: queryKeys.scheduled.detail(id),
    queryFn: () => scheduledApi.getScheduledTransfer(id),
    enabled: !!id,
  })
}

export function useCreateScheduled() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      recipientId: string
      recipientName: string
      amount: number
      note?: string
      scheduledAt: string
    }) => scheduledApi.createScheduled(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.scheduled.list() })
    },
  })
}

export function useCancelScheduled() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => scheduledApi.cancelScheduled(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.scheduled.list() })
    },
  })
}