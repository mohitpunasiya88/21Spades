'use client'

import AuthLeftPanel from '@/components/Auth/AuthLeftPanel'
import SignUpForm from '@/components/Auth/SignUpForm'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex">
      <AuthLeftPanel />
      <SignUpForm />
    </div>
  )
}

