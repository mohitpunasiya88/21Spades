'use client'

import AuthLeftPanel from '@/components/Auth/AuthLeftPanel'
import LoginForm from '@/components/Auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen relative bg-black  bg-gradient-to-tr flex">
      {/* Main content */}
      <AuthLeftPanel />
      <LoginForm />
    </div>
  )
}


