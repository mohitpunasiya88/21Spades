'use client'

import AuthFooter from '@/components/Auth/AuthFooter'
import AuthLeftPanel from '@/components/Auth/AuthLeftPanel'
import LoginForm from '@/components/Auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen relative bg-black bg-gradient-to-tr flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Logo - Only visible on mobile */}
      <div className="md:hidden w-full flex justify-center pt-6 pb-4 relative z-20">
        <img src="/assets/logo.png" alt="21 Spades" className="h-10 object-contain" />
      </div>

      {/* Desktop Left Panel - Hidden on mobile */}
      <AuthLeftPanel />
      
      {/* Login Form - Takes full width on mobile, half on desktop */}
      <LoginForm />
      
      {/* Footer - At bottom on mobile, absolute on desktop */}
      <AuthFooter/>
    </div>
  )
}


