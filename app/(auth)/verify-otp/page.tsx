'use client'

import { Suspense } from 'react'
import AuthLeftPanel from '@/components/Auth/AuthLeftPanel'
import OTPVerification from '@/components/Auth/OTPVerification'

function OTPVerificationWrapper() {
  return (
    <div className="min-h-screen bg-gray-950 flex">
      <AuthLeftPanel />
      <OTPVerification />
    </div>
  )
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    }>
      <OTPVerificationWrapper />
    </Suspense>
  )
}

