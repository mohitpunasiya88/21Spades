'use client'

import { Suspense } from 'react'
import AuthFooter from '@/components/Auth/AuthFooter'
import AuthLeftPanel from '@/components/Auth/AuthLeftPanel'
import PhoneOTPVerification from '@/components/Auth/PhoneOTPVerification'

function OTPVerificationWrapper() {
  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row relative overflow-hidden">
      <AuthLeftPanel />
      <PhoneOTPVerification />
      <AuthFooter />
    </div>
  )
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
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

