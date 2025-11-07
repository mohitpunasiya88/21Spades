'use client'

import AuthFooter from '@/components/Auth/AuthFooter'
import AuthLeftPanel from '@/components/Auth/AuthLeftPanel'
import LoginForm from '@/components/Auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen relative bg-black bg-gradient-to-tr flex flex-col md:flex-row overflow-hidden">
      {/* Main content */}
      <AuthLeftPanel />
      <LoginForm />
      <AuthFooter/>
    </div>
  )
}


