'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import type { SignUpData } from '@/types/auth'
import { Eye } from 'lucide-react'
import AuthLeftPanel from './AuthLeftPanel'

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
    <div className="flex-1 min-h-screen h-full flex items-center justify-center px-4 sm:px-6 md:px-8 py-6 md:py-8 bg-[#03020800] relative pb-20 md:pb-24 m-2 sm:m-4">
      {/* Right bottom corner color */}
      <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-[#480C64] rounded-full opacity-30 blur-3xl pointer-events-none"></div>
      <div className="w-full max-w-md sm:max-w-lg relative z-10">
        {/* Form container with gray border */}
        <div className="relative rounded-xl md:rounded-2xl border-1 border-gray-600">
          <div className="bg-blur bg-[linear-gradient(135deg,#4A01D8_1%,#4A01D8_1%,#000_17%,#000_90%)] rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 min-h-[560px] sm:min-h-[620px] md:min-h-[720px] shadow-2xl shadow-black/40">
            {/* Header Section */}
            <div className="mb-2 md:mb-3 text-center">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-audiowide font-bold mb-1 bg-gradient-to-r from-[#ffcc00] via-orange-400 to-orange-500 bg-clip-text text-transparent">
                Create Account!
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-400 font-exo2">
                Already have an account?{' '}
                <button
                  onClick={() => router.push('/login')}
                  className="text-white hover:underline font-exo2"
                >
                  Log In
                </button>
              </p>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-1.5 sm:space-y-2">
              {/* Name */}
              <div>
                <label className="block text-white text-base sm:text-lg mb-1 font-exo2">Name</label>
                <div className="relative">
                  <img src="/assets/User Rounded.png" alt="User" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10" />
                  <div className="absolute left-9 md:left-10 top-1/2 -translate-y-1/2 h-5 md:h-6 w-px bg-gray-600"></div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter name"
                    className="w-full border font-exo2 border-gray-600 rounded-lg py-2 sm:py-2.5 pl-12 sm:pl-14 pr-3 sm:pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-white text-base sm:text-lg mb-1 font-exo2">User name</label>
                <div className="relative">
                  <img  src="/assets/User Heart.png" alt="User" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10"  />
                  <div className="absolute left-9 md:left-10 top-1/2 -translate-y-1/2 h-5 md:h-6 w-px bg-gray-600"></div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter user name"
                    className="w-full border font-exo2 border-gray-600 rounded-lg py-2 sm:py-2.5 pl-12 sm:pl-14 pr-3 sm:pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors text-sm sm:text-base"
                    required
                  />
                </div>
              </div>
              {/* Email */}
              <div>
                <label className="block text-white text-base sm:text-lg mb-1 font-exo2">Email</label>
                <div className="relative">
                <img  src="/assets/Vector.png" alt="vector" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10" />
                  <div className="absolute left-9 md:left-10 top-1/2 -translate-y-1/2 h-5 md:h-6 w-px bg-gray-600"></div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className="w-full border font-exo2 border-gray-600 rounded-lg py-2 sm:py-2.5 pl-12 sm:pl-14 pr-3 sm:pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-white text-base sm:text-lg mb-1 font-exo2">Phone number</label>
                <div className="relative">
                <img  src="/assets/Phone.png" alt="phone" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10"  />
                  <div className="absolute left-9 md:left-10 top-1/2 -translate-y-1/2 h-5 md:h-6 w-px bg-gray-600"></div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full border font-exo2 border-gray-600 rounded-lg py-2 sm:py-2.5 pl-12 sm:pl-14 pr-3 sm:pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-white text-base sm:text-lg mb-1 font-exo2">Password</label>
                <div className="relative">
                  <img  src="/assets/Key.png" alt="Key" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10"  />
                  <div className="absolute left-9 md:left-10 top-1/2 -translate-y-1/2 h-5 md:h-6 w-px bg-gray-600"></div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    className="w-full border font-exo2 border-gray-600 rounded-lg py-2 sm:py-2.5 pl-12 sm:pl-14 pr-8 sm:pr-10 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors text-sm sm:text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <Eye size={16} />:  <img src="/assets/Eye Closed.png" alt="Eye closed" className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-white text-base sm:text-lg mb-1 font-exo2">Confirm Password</label>
                <div className="relative">
                <img  src="/assets/Key.png" alt="Key" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10" />
                  <div className="absolute left-9 md:left-10 top-1/2 -translate-y-1/2 h-5 md:h-6 w-px bg-gray-600"></div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="w-full border font-exo2 border-gray-600 rounded-lg py-2 sm:py-2.5 pl-12 sm:pl-14 pr-8 sm:pr-10 text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors text-sm sm:text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ?  <Eye size={18} />:  <img  src="/assets/Eye Closed.png" alt="Eye closed" className="w-4 h-4" /> }
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm sm:text-base mt-0.5">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-1 md:pt-1.5 space-y-1.5 sm:space-y-2 mt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#4A01D8] border border-gray-600 text-white text-base sm:text-lg font-exo2 py-2 sm:py-2.5 rounded-full hover:opacity-90 transition disabled:opacity-50 shadow-lg"
                >
                  {isLoading ? 'Creating...' : 'Create Account'}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full border border-gray-600 rounded-full text-white text-base sm:text-lg py-2 sm:py-2.5 hover:bg-[#4A008F] transition flex items-center justify-center gap-2 font-exo2"
                >
                   Back
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  )
}
