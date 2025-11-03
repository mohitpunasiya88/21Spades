'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import PrivateRoute from '@/components/PrivateRoute'

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PrivateRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </PrivateRoute>
  )
}

