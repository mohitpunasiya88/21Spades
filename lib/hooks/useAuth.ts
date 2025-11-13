'use client'

import { useAuthStore } from '@/lib/store/authStore'

/**
 * Reusable hook to check if user is authenticated
 * Can be used anywhere in the app to conditionally render content
 * 
 * @returns {boolean} true if user is logged in, false otherwise
 * 
 * @example
 * ```tsx
 * const isAuthenticated = useAuth()
 * 
 * {isAuthenticated && <ProtectedComponent />}
 * ```
 */
export function useAuth(): boolean {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated
}

