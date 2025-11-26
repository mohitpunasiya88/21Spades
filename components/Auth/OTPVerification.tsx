'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { ArrowLeft } from 'lucide-react'
import { countryCodeList } from '@/lib/constants/countryCodes'

export default function OTPVerification() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fullPhone = searchParams.get('phone') || ''
  const { verifyOTP, isLoading, isAuthenticated } = useAuthStore()

  // Parse phone number to extract countryCode and phoneNumber
  // Format: +919174570187 -> countryCode: +91, phoneNumber: 9174570187
  const parsePhoneNumber = (fullPhone: string) => {
    if (!fullPhone) return { countryCode: '+91', phoneNumber: '' }
    
    // Remove any spaces or special characters except +
    const cleaned = fullPhone.replace(/\s/g, '').trim()
    
    // Special case: Indian numbers (+91) - check this FIRST before any other logic
    // Indian numbers are 10 digits starting with 6-9
    if (cleaned.startsWith('+91')) {
      const phoneNumber = cleaned.substring(3) // Remove '+91' (3 characters)
      // Indian numbers should be exactly 10 digits starting with 6-9
      if (phoneNumber.length >= 10) {
        // Take first 10 digits
        const indianNumber = phoneNumber.substring(0, 10)
        if (/^[6-9]\d{9}$/.test(indianNumber)) {
          return {
            countryCode: '+91',
            phoneNumber: indianNumber
          }
        }
      }
      // Even if validation fails, still return +91 as country code
      return {
        countryCode: '+91',
        phoneNumber: phoneNumber.substring(0, 10) || phoneNumber
      }
    }
    
    // Try to match longest codes first (using common countryCodeList)
    for (const code of countryCodeList) {
      if (cleaned.startsWith(code)) {
        const phoneNumber = cleaned.substring(code.length)
        return {
          countryCode: code,
          phoneNumber: phoneNumber
        }
      }
    }
    
    // Default to +91 if no match
    return {
      countryCode: '+91',
      phoneNumber: cleaned.replace(/^\+/, '')
    }
  }

  const { countryCode, phoneNumber } = parsePhoneNumber(fullPhone)
  
  // Debug: Log parsed values
  useEffect(() => {
    if (fullPhone) {
    }
  }, [fullPhone, countryCode, phoneNumber])

  // Redirect to feed when authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace('/feed')
    }
  }, [isAuthenticated, isLoading, router])
  const [otp, setOtp] = useState(['', '', '', ''])
  const [timer, setTimer] = useState(60)

  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

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
    if (value && index < 3) inputRefs.current[index + 1]?.focus()
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
      
      // Send phoneNumber and countryCode separately as backend expects
      await verifyOTP({ 
        phoneNumber, 
        countryCode, 
        otp: otpString 
      } as any)
      // Redirect will happen via useEffect when isAuthenticated becomes true
    } catch (error: any) {
      console.error('OTP verification error:', error)
      alert(error?.response?.data?.message || error?.message || 'Invalid OTP. Please try again')
    }
  }

  const maskedPhone = fullPhone
    ? fullPhone.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+1 *****$4')
    : '+1 *****244'

  return (
    <div className="min-h-screen  flex items-center justify-center m-4 p-4">
      <div className="w-full max-w-2xl bg-gradient-to-br from-[#4A01D8] to-black border border-gray-800/40 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
        <div >

          <h1 className="text-2xl font-extrabold text-[#ffcc00] mb-2">Enter the OTP code</h1>

          <p className="text-sm text-gray-400 mb-6 font-medium">
            Not register yet?{' '}
            <button
              onClick={() => router.push('/signup')}
              className="text-[#ffcc00] hover:underline font-exo2"
            >
              Create Account
            </button>
          </p>

          <p className="text-gray-300 mb-4 text-sm font-exo2 ">
            Enter the 4-digit code that we have sent<br />
            via the Phone-No <span className="text-white font-exo2">{maskedPhone}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el: HTMLInputElement | null) => {
                    inputRefs.current[index] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-5 h-5 text-center text-2xl font-exo2 bg-transparent border-b-4 border-gray-600 text-white focus:border-[#ffcc00] outline-none transition-all"
                />
              ))}
            </div>

            <div className="text-gray-400 text-sm font-exo2">
              {timer > 0 ? (
                <>
                  Resend code in{' '}
                  <span className="text-white font-extrabold">
                    {String(Math.floor(timer / 60)).padStart(2, '0')}:
                    {String(timer % 60).padStart(2, '0')}
                  </span>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setTimer(120)}
                  className="text-[#9b59ff] hover:underline font-semibold"
                >
                  Resend
                </button>
              )}
              <br />
              Didn’t receive the code?{' '}
              <button
                type="button"
                onClick={() => setTimer(120)}
                className="text-[#9b59ff] hover:underline font-semibold"
              >
                Resend
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.join('').length !== 4}
              className="w-full py-3 bg-[#4A01D8] rounded-full text-lg font-extrabold hover:opacity-90 transition disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Send Verification Code'}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="w-full py-3 border border-gray-800 rounded-full text-lg font-extrabold text-gray-300 hover:bg-[#1b0045] transition flex justify-center items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}




