'use client'

import AuthFooter from '@/components/Auth/AuthFooter'
import AuthLeftPanel from '@/components/Auth/AuthLeftPanel'
import SignUpForm from '@/components/Auth/SignUpForm'

export default function SignUpPage() {
  return (
    <div className="min-h-screen relative bg-black bg-gradient-to-tr flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Logo - Only visible on mobile */}
      <div className="md:hidden w-full flex justify-center pt-6 pb-4 relative z-20">
        <img src="/assets/logo.png" alt="21 Spades" className="h-10 object-contain" />
      </div>
      <AuthLeftPanel />
      <SignUpForm />
      <AuthFooter />
    </div>
  )
}

