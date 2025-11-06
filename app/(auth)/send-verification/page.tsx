'use client'

import AuthFooter from '@/components/Auth/AuthFooter'
import AuthLeftPanel from '@/components/Auth/AuthLeftPanel'
import SendVerificationCode from '@/components/Auth/SendVerificationCode'

export default function SendVerificationPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row relative overflow-hidden">
      <AuthLeftPanel />
      <SendVerificationCode />
      <AuthFooter />
    </div>
  )
}

