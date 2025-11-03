'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/feed')
      } else {
        router.push('/landing')
      }
    }
  }, [isAuthenticated, isLoading, router])

  // Show loading while checking auth
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: '#0F0F23' }}>
      <div className="text-center">
        <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#8B5CF6', borderTopColor: 'transparent' }}></div>
        <p className="text-white">Loading...</p>
      </div>
    </div>
  )
}
