'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import type { LoginData } from '@/types/auth'
import { ArrowLeft } from 'lucide-react'

export default function LoginForm() {
  const router = useRouter()
  const { login, isLoading } = useAuthStore()
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email')
  const [formData, setFormData] = useState<LoginData>({
    username: '',
    password: '',
    rememberMe: false,
  })
  const [phone, setPhone] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(formData)
      router.push('/feed')
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  const handlePhoneLogin = () => {
    router.push(`/verify-otp?phone=${encodeURIComponent(phone)}`)
  }

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-950">
      <div className="w-full max-w-md bg-gradient-to-b from-gray-900/90 to-gray-950 rounded-2xl p-8 border border-gray-800 shadow-2xl">
        {/* Title */}
        <h2 className="text-3xl font-bold text-yellow-400 mb-3">
          WELCOME BACK!
        </h2>
        
        {/* Create Account Link */}
        <p className="text-gray-400 mb-6 text-sm">
          Not registered yet?{' '}
          <button
            onClick={() => router.push('/signup')}
            className="text-purple-400 hover:text-purple-300 underline"
          >
            Create Account
          </button>
        </p>

        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-6 bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setLoginType('email')}
            className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-all ${
              loginType === 'email'
                ? 'bg-yellow-400 text-gray-900 shadow-lg'
                : 'bg-transparent text-gray-400 hover:text-white'
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setLoginType('phone')}
            className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-all ${
              loginType === 'phone'
                ? 'bg-yellow-400 text-gray-900 shadow-lg'
                : 'bg-transparent text-gray-400 hover:text-white'
            }`}
          >
            Phone number
          </button>
        </div>

        {loginType === 'email' ? (
          <form onSubmit={handleEmailLogin} className="space-y-5">
            {/* Username Field */}
            <div>
              <label className="block text-sm text-gray-300 mb-2 font-medium">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm text-gray-300 mb-2 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-purple-400 text-sm hover:text-purple-300 hover:underline"
              >
                Forgot Password
              </button>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-md"
              >
                Continue with Apple
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
              >
                Continue with Facebook
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-md"
              >
                Continue with Google
              </button>
            </div>

            {/* Login & Back Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 shadow-lg"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="block text-sm text-gray-300 mb-2 font-medium">
                Phone number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-3 pl-12 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  required
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📱</span>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handlePhoneLogin}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg"
              >
                Send Verification Code
              </button>
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Copyright */}
        <p className="text-xs text-gray-500 mt-8 text-center">
          © 2023 21Spades. All Rights Reserved.
        </p>
      </div>
    </div>
  )
}
