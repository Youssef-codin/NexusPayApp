import { Navigate, useLocation } from "@tanstack/react-router"
import { useAuthStore } from "#/store/auth-store"
import { LoadingSpinner } from "./LoadingSpinner"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const location = useLocation()

  if (isAuthenticated === undefined) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}