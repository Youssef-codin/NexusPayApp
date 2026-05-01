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
      login(data.accessToken, data.refreshToken, data.user)
    },
  })
}

export function useRegister() {
  const login = useAuthStore.getState().login

  return useMutation({
    mutationFn: (data: {
      email: string
      password: string
      firstName: string
      lastName: string
      phone?: string
    }) => authApi.register(data),
    onSuccess: (data) => {
      login(data.accessToken, data.refreshToken, data.user)
    },
  })
}

export function useUser() {
  const setUser = useAuthStore.getState().setUser

  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: () => authApi.me(),
    enabled: !!useAuthStore.getState().accessToken,
    staleTime: 1000 * 60 * 5,
    onSuccess: (user) => setUser(user),
  })
}