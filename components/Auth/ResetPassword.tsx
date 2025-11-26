'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { useMessage } from '@/lib/hooks/useMessage'
import { Eye, EyeOff } from 'lucide-react'
import { countryCodeList } from '@/lib/constants/countryCodes'

export default function ResetPassword() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fullPhone = searchParams.get('phone') || ''
  const { resetPassword, isLoading } = useAuthStore()
  const { message } = useMessage()

  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(120) // 2 minutes = 120 seconds
  const [isExpired, setIsExpired] = useState(false)

  // OTP Timer countdown
  useEffect(() => {
    if (timer <= 0) {
      setIsExpired(true)
      return
    }
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setIsExpired(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [timer])

  const parsePhoneNumber = (phone: string) => {
    if (!phone) return { countryCode: '+91', phoneNumber: '' }
    const cleaned = phone.replace(/\s/g, '').trim()
    
    // Special case: Indian numbers (+91)
    if (cleaned.startsWith('+91')) {
      const phoneNumber = cleaned.substring(3)
      if (phoneNumber.length >= 10) {
        const indianNumber = phoneNumber.substring(0, 10)
        if (/^[6-9]\d{9}$/.test(indianNumber)) {
          return { countryCode: '+91', phoneNumber: indianNumber }
        }
      }
      return { countryCode: '+91', phoneNumber: phoneNumber.substring(0, 10) || phoneNumber }
    }
    
    // Try to match longest codes first
    for (const code of countryCodeList) {
      if (cleaned.startsWith(code)) {
        const phoneNumber = cleaned.substring(code.length)
        return { countryCode: code, phoneNumber }
      }
    }
    
    return { countryCode: '+91', phoneNumber: cleaned.replace(/^\+/, '') }
  }

  const { countryCode, phoneNumber } = parsePhoneNumber(fullPhone)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (isExpired) {
      setError('OTP has expired. Please request a new one.')
      return
    }

    if (!otp || otp.length < 4) {
      setError('Please enter the OTP you received')
      return
    }
    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      await resetPassword({ phoneNumber, countryCode, otp, newPassword })
      message.success('Password reset successfully! Redirecting to login...')
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        (e?.response?.status === 401 ? 'Invalid or expired OTP' : null) ||
        e?.message ||
        'Failed to reset password. Please try again.'
      setError(msg)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center m-4 p-4">
      <div className="w-full max-w-md bg-gradient-to-br from-[#4A01D8] to-black border border-gray-800/40 rounded-3xl p-8 md:p-10 backdrop-blur-sm">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#ffcc00] mb-2 font-audiowide">
          Reset Password
        </h1>
        <p className="text-sm text-gray-300 mb-6 font-exo2">
          Enter the OTP sent to your phone and choose a new password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm text-gray-200 font-exo2">OTP</label>
              {!isExpired && timer > 0 && (
                <span className="text-xs text-gray-400 font-exo2">
                  Expires in: <span className="text-yellow-400 font-semibold">{formatTime(timer)}</span>
                </span>
              )}
              {isExpired && (
                <span className="text-xs text-red-400 font-exo2 font-semibold">OTP Expired</span>
              )}
            </div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              disabled={isExpired || isLoading}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gray-700 text-white font-exo2 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter OTP"
              maxLength={6}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-200 mb-1 font-exo2">New password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isExpired || isLoading}
                className="w-full px-3 py-2 pr-10 rounded-lg bg-black/40 border border-gray-700 text-white font-exo2 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter new password (min 6 characters)"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isExpired || isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-200 mb-1 font-exo2">Confirm new password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isExpired || isLoading}
                className="w-full px-3 py-2 pr-10 rounded-lg bg-black/40 border border-gray-700 text-white font-exo2 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isExpired || isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-400 text-xs sm:text-sm mt-1 font-exo2">{error}</p>}

          <button
            type="submit"
            disabled={isLoading || isExpired}
            className="w-full mt-2 py-3 bg-[#4A01D8] rounded-full text-lg font-extrabold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Resetting...' : isExpired ? 'OTP Expired' : 'Reset Password'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/login')}
            className="w-full py-3 border border-gray-800 rounded-full text-lg font-extrabold text-gray-300 hover:bg-[#1b0045] transition mt-2"
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  )
}


