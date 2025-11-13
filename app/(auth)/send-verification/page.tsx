'use client'

import AuthFooter from '@/components/Auth/AuthFooter'
import AuthLeftPanel from '@/components/Auth/AuthLeftPanel'
import SendPhoneVerification from '@/components/Auth/SendPhoneVerification'
export default function SendVerificationPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row relative overflow-hidden">
      <AuthLeftPanel />
      <SendPhoneVerification />
      <AuthFooter />
    </div>
  )
}

