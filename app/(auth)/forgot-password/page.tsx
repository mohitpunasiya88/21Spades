'use client'

import AuthFooter from '@/components/Auth/AuthFooter'
import AuthLeftPanel from '@/components/Auth/AuthLeftPanel'
import ForgotPasswordRequest from '@/components/Auth/ForgotPasswordRequest'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen relative bg-black flex flex-col md:flex-row overflow-y-auto overflow-x-hidden">
      {/* Mobile Logo */}
      <div className="md:hidden w-full flex justify-center pt-6 pb-4 relative z-20">
        <img src="/assets/logo.png" alt="21 Spades" className="h-10 object-contain" />
      </div>

      {/* Left panel */}
      <AuthLeftPanel />

      {/* Content */}
      <ForgotPasswordRequest />

      <AuthFooter />
    </div>
  )
}


