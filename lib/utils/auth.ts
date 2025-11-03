import { useAuthStore } from '@/lib/store/authStore'

export function useRequireAuth() {
  const { isAuthenticated, checkAuth } = useAuthStore()
  return checkAuth()
}

