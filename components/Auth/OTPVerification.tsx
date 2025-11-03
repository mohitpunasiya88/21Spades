'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { ArrowLeft } from 'lucide-react'

export default function OTPVerification() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') || ''
  const { verifyOTP, isLoading } = useAuthStore()
  const [otp, setOtp] = useState(['', '', '', ''])
  const [timer, setTimer] = useState(60)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpString = otp.join('')
    if (otpString.length !== 4) return

    try {
      await verifyOTP({ phone, otp: otpString })
      router.push('/feed')
    } catch (error) {
      console.error('OTP verification error:', error)
      alert('Invalid OTP. Try 1234 or 1537')
    }
  }

  const maskedPhone = phone.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+1 *** *** $4')

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-950">
      <div className="w-full max-w-md bg-gradient-to-b from-gray-900/90 to-gray-950 rounded-2xl p-8 border border-gray-800 shadow-2xl">
        <h2 className="text-2xl font-bold text-purple-400 mb-2">
          Enter the OTP code
        </h2>
        <p className="text-gray-400 mb-2 text-sm">
          Not registered yet?{' '}
          <button
            onClick={() => router.push('/signup')}
            className="text-purple-400 hover:text-purple-300 underline"
          >
            Create Account
          </button>
        </p>

        <p className="text-sm text-gray-500 mb-6">
          Enter the 4-digit code that we have sent on the Phone No. {maskedPhone || '+1 *** *** 7294'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-3 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-16 h-16 text-center text-2xl font-bold bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 transition-all"
              />
            ))}
          </div>

          <p className="text-center text-sm text-gray-400">
            {timer > 0 ? (
              <>Resend code in {String(Math.floor(timer / 60)).padStart(2, '0')}:{String(timer % 60).padStart(2, '0')}</>
            ) : (
              <button
                type="button"
                onClick={() => setTimer(60)}
                className="text-purple-400 hover:text-purple-300 hover:underline"
              >
                Resend code
              </button>
            )}
          </p>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading || otp.join('').length !== 4}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 shadow-lg"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
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
