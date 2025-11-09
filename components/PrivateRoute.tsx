'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, isLoading, checkAuth, getUser } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check authentication on mount
    const initAuth = async () => {
      setIsChecking(true)
      try {
        // Check if token exists
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        
        if (token) {
          // Verify auth status
          const isAuth = checkAuth()
          if (isAuth) {
            // Try to get user data if not already loaded
            if (!useAuthStore.getState().user) {
              await getUser()
            }
          } else {
            // Token exists but user not authenticated, clear and redirect
            localStorage.removeItem('token')
            router.push('/login')
            return
          }
        } else {
          // No token, redirect to login
          router.push('/login')
          return
        }
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/login')
      } finally {
        setIsChecking(false)
      }
    }

    initAuth()
  }, [router, checkAuth, getUser])

  useEffect(() => {
    if (!isChecking && !isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, isChecking, router])

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

