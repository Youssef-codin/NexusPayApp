import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { scheduledApi } from "#/api/client"
import { queryKeys } from "#/lib/query-keys"

export function useScheduledTransfers() {
  return useQuery({
    queryKey: queryKeys.scheduled.list(),
    queryFn: async () => {
      const response = await scheduledApi.getScheduled()
      return response.scheduled_transfers
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