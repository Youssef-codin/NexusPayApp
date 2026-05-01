import { useQuery } from "@tanstack/react-query"
import { userApi } from "#/api/client"

export function useUserSearch(query: string) {
  return useQuery({
    queryKey: ["users", "search", query],
    queryFn: () => userApi.search(query),
    enabled: query.length >= 2,
  })
}