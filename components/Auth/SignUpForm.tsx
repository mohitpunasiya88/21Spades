'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import type { SignUpData } from '@/types/auth'
import { ArrowLeft } from 'lucide-react'

export default function SignUpForm() {
  const router = useRouter()
  const { signup, isLoading } = useAuthStore()
  const [formData, setFormData] = useState<SignUpData>({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Partial<SignUpData>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: undefined })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' })
      return
    }

    try {
      await signup(formData)
      router.push('/feed')
    } catch (error) {
      console.error('Signup error:', error)
    }
  }

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-950">
      <div className="w-full max-w-md bg-gradient-to-b from-gray-900/90 to-gray-950 rounded-2xl p-8 border border-gray-800 shadow-2xl">
        <h2 className="text-2xl font-bold text-purple-400 mb-2">
          Create Account!
        </h2>
        <p className="text-gray-400 mb-6 text-sm">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-purple-400 hover:text-purple-300 underline"
          >
            Login
          </button>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2 font-medium">User name</label>
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

          <div>
            <label className="block text-sm text-gray-300 mb-2 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2 font-medium">Phone number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              required
            />
          </div>

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

          <div>
            <label className="block text-sm text-gray-300 mb-2 font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 shadow-lg"
            >
              {isLoading ? 'Creating...' : 'Create account'}
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

        <p className="text-xs text-gray-500 mt-6 text-center">
          © 2023 21Spades. All Rights Reserved.
        </p>
      </div>
    </div>
  )
}
