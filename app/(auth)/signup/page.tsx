'use client'

import AuthFooter from '@/components/Auth/AuthFooter'
import AuthLeftPanel from '@/components/Auth/AuthLeftPanel'
import SignUpForm from '@/components/Auth/SignUpForm'

export default function SignUpPage() {
  return (
    <div className="min-h-screen relative  flex flex-col md:flex-row overflow-hidden">
      <AuthLeftPanel />
      <SignUpForm />
      <AuthFooter />
    </div>
  )
}

