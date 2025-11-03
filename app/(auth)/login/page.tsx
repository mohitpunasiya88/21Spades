'use client'

import AuthLeftPanel from '@/components/Auth/AuthLeftPanel'
import LoginForm from '@/components/Auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex">
      <AuthLeftPanel />
      <LoginForm />
    </div>
  )
}

