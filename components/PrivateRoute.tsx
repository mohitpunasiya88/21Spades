'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading, checkAuth, getUser } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)

  // Routes that are accessible without authentication
  const publicRoutes = ['/feed']
  const isPublicRoute = publicRoutes.includes(pathname)

  useEffect(() => {
    // Allow public routes without authentication check
    if (isPublicRoute) {
      setIsChecking(false)
      return
    }

    // Check authentication on mount
    const initAuth = async () => {
      setIsChecking(true)
      try {
        // Check if token exists
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        
        if (token) {
          // Verify auth status (based on token presence)
          const isAuth = checkAuth()
          // Try to get user data if not already loaded
          if (!useAuthStore.getState().user) {
            await getUser()
          }
        } else {
          // No token, redirect to login
          router.replace('/login')
          return
        }
      } catch (error) {
        console.error('Auth check error:', error)
        router.replace('/login')
      } finally {
        setIsChecking(false)
      }
    }

    initAuth()
  }, [router, checkAuth, getUser, isPublicRoute, pathname])

  useEffect(() => {
    // Don't redirect if it's a public route
    if (isPublicRoute) return

    if (!isChecking && !isLoading && !isAuthenticated) {
      // Use replace to prevent going back
      router.replace('/login')
    }
  }, [isAuthenticated, isLoading, isChecking, router, isPublicRoute])

  // For public routes, always render children
  if (isPublicRoute) {
    return <>{children}</>
  }

  if (isChecking || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-spades-dark">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-spades-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

