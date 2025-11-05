'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import type { SignUpData } from '@/types/auth'
import { ArrowLeft, User, Lock, Eye, EyeOff, Mail, Phone } from 'lucide-react'

export default function SignUpForm() {
  const router = useRouter()
  const { signup, isLoading } = useAuthStore()
  const [formData, setFormData] = useState<SignUpData>({
    name: '',
    username: '',
    email: 'mail@21spades.com',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Partial<SignUpData>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
    <div className="flex-1 min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 py-6 md:py-8 bg-black relative pb-20 md:pb-24">
      {/* Right bottom corner color */}
      <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-[#480C64] rounded-full opacity-30 blur-3xl pointer-events-none"></div>
      <div className="w-full max-w-md relative z-10">
        {/* Form container with gray border */}
        <div className="relative rounded-xl md:rounded-2xl border-1 border-gray-600">
          <div className="bg-[linear-gradient(135deg,#4A01D8_0%,#4A01D8_1%,#000_15%,#000_100%)] rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6">
            {/* Header Section */}
            <div className="mb-3 md:mb-5 text-center">
              <h1 className="text-2xl  sm:text-3xl md:text-4xl font-audiowide font-bold mb-1.5 bg-gradient-to-r from-[#ffcc00] via-orange-400 to-orange-500 bg-clip-text text-transparent">
                Create Account!
              </h1>
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <button
                  onClick={() => router.push('/login')}
                  className="text-white hover:underline font-semibold"
                >
                  Log In
                </button>
              </p>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-2.5 md:space-y-3">
              {/* Name */}
              <div>
                <label className="block text-white text-sm mb-1.5 font-medium">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={16} />
                  <div className="absolute left-9 md:left-10 top-1/2 -translate-y-1/2 h-5 md:h-6 w-px bg-gray-600"></div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter name"
                    className="w-full border border-gray-600 rounded-lg py-2.5 md:py-3 pl-12 md:pl-14 pr-3 md:pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors text-sm md:text-base"
                    required
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-white text-sm mb-1.5 font-medium">User name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={16} />
                  <div className="absolute left-9 md:left-10 top-1/2 -translate-y-1/2 h-5 md:h-6 w-px bg-gray-600"></div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter user name"
                    className="w-full border border-gray-600 rounded-lg py-2.5 md:py-3 pl-12 md:pl-14 pr-3 md:pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors text-sm md:text-base"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-white text-sm mb-1.5 font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={16} />
                  <div className="absolute left-9 md:left-10 top-1/2 -translate-y-1/2 h-5 md:h-6 w-px bg-gray-600"></div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className="w-full border border-gray-600 rounded-lg py-2.5 md:py-3 pl-12 md:pl-14 pr-3 md:pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors text-sm md:text-base"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-white text-sm mb-1.5 font-medium">Phone number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={16} />
                  <div className="absolute left-9 md:left-10 top-1/2 -translate-y-1/2 h-5 md:h-6 w-px bg-gray-600"></div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full border border-gray-600 rounded-lg py-2.5 md:py-3 pl-12 md:pl-14 pr-3 md:pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors text-sm md:text-base"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-white text-sm mb-1.5 font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={16} />
                  <div className="absolute left-9 md:left-10 top-1/2 -translate-y-1/2 h-5 md:h-6 w-px bg-gray-600"></div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    className="w-full border border-gray-600 rounded-lg py-2.5 md:py-3 pl-12 md:pl-14 pr-8 md:pr-10 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors text-sm md:text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-white text-sm mb-1.5 font-medium">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={16} />
                  <div className="absolute left-9 md:left-10 top-1/2 -translate-y-1/2 h-5 md:h-6 w-px bg-gray-600"></div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="w-full border border-gray-600 rounded-lg py-2.5 md:py-3 pl-12 md:pl-14 pr-8 md:pr-10 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors text-sm md:text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-1.5 md:pt-2 space-y-2 md:space-y-2.5">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#4A01D8] border border-gray-600 text-white font-semibold py-2.5 md:py-3 rounded-full hover:opacity-90 transition disabled:opacity-50 shadow-lg text-sm md:text-base"
                >
                  {isLoading ? 'Creating...' : 'Create Account'}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full border border-gray-600 rounded-full text-white py-2.5 md:py-3 hover:bg-[#4A008F] transition flex items-center justify-center gap-2 text-sm md:text-base font-medium"
                >
                  <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" /> Back
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  )
}
