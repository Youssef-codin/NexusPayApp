import { useMutation, useQuery } from "@tanstack/react-query"
import { authApi } from "#/api/client"
import { queryKeys } from "#/lib/query-keys"
import { useAuthStore } from "#/store/auth-store"

export function useLogin() {
  const login = useAuthStore.getState().login

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (data) => {
      const user = {
        id: "",
        email: data.email,
        full_name: data.full_name,
      }
      login(data.jwt_token, data.refresh_token, user)
    },
  })
}

export function useRegister() {
  const login = useAuthStore.getState().login

  return useMutation({
    mutationFn: (data: { email: string; password: string; full_name: string }) =>
      authApi.register(data),
    onSuccess: (data) => {
      const user = {
        id: "",
        email: data.email,
        full_name: data.full_name,
      }
      login(data.jwt_token, data.refresh_token, user)
    },
  })
}

export function useUser() {
  const setUser = useAuthStore.getState().setUser

  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: () => authApi.test(),
    enabled: !!useAuthStore.getState().accessToken,
    staleTime: 1000 * 60 * 5,
    onSuccess: (user) => setUser(user),
  })
}