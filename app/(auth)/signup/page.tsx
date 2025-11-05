'use client'

import AuthFooter from '@/components/Auth/AuthFooter'
import AuthLeftPanel from '@/components/Auth/AuthLeftPanel'
import SignUpForm from '@/components/Auth/SignUpForm'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row relative">
      <AuthLeftPanel />
      <SignUpForm />
      <AuthFooter />
    </div>
  )
}

