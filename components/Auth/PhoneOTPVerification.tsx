'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import Image from 'next/image'
import image21 from '@/components/assets/image21.png'
import { useCreateWallet } from '@privy-io/react-auth'

export default function PhoneOTPVerification() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') || ''
  const { verifyOTP, isLoading, isAuthenticated } = useAuthStore()
  const { createWallet } = useCreateWallet()

  const [code, setCode] = useState(['', '', '', ''])
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(120) // 2:00 in seconds
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const codeValue = useMemo(() => code.join(''), [code])

  // Redirect to feed when authenticated
  useEffect(() => {
    if (isAuthenticated && verified) {
      router.replace('/feed')
    }
  }, [isAuthenticated, verified, router])

  useEffect(() => {
    if (timer <= 0) return
    const t = setInterval(() => setTimer((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [timer])

  useEffect(() => {
    // Auto-focus first input on mount
    inputsRef.current[0]?.focus()
  }, [])

  const handleVerify = async () => {
    setError('')
    if (codeValue.length !== 4) {
      setError('Please enter the 4-digit code')
      return
    }
    try {
      setVerifying(true)
      const createWalletWrapper = async () => {
        await createWallet()
      }
      // Call API to verify OTP
      await verifyOTP({ phone, otp: codeValue }, createWalletWrapper)
      
      // Show success popup
      setVerifying(false)
      setVerified(true)
      
      // Redirect will happen via useEffect when isAuthenticated becomes true
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Invalid code. Please try again.')
      setVerifying(false)
    }
  }

  const handleResend = async () => {
    setError('')
    try {
      // TODO: call API to resend OTP
      // await sendOtpToPhone(phone)
      setTimer(120) // Reset to 2:00
      setCode(['', '', '', ''])
      inputsRef.current[0]?.focus()
    } catch (e) {
      setError('Failed to resend code. Please try again.')
    }
  }

  const onCodeChange = (idx: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return
    const next = [...code]
    next[idx] = val
    setCode(next)
    if (val && idx < 3) {
      inputsRef.current[idx + 1]?.focus()
    }
  }

  const onCodeKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && idx > 0) {
      inputsRef.current[idx - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && idx < 3) {
      inputsRef.current[idx + 1]?.focus()
    }
  }

  const onCodePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (!text) return
    e.preventDefault()
    const arr = Array(4).fill('')
    for (let i = 0; i < text.length; i++) {
      arr[i] = text[i]
    }
    setCode(arr)
    const nextIndex = Math.min(text.length, 3)
    setTimeout(() => inputsRef.current[nextIndex]?.focus(), 0)
  }

  const maskedPhone = phone
    ? phone.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+1 *****$4')
    : '+1 *****244'

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <div className="flex-1 min-h-screen h-full flex items-center justify-center px-4 sm:px-6 md:px-8 py-6 md:py-8 bg-[#03020800] relative pb-20 md:pb-24 m-2 sm:m-4">
        <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-[#480C64] rounded-full opacity-30 blur-3xl pointer-events-none"></div>
        <div className="w-full max-w-md sm:max-w-lg relative z-10">
        <div className="relative rounded-xl md:rounded-2xl border-1 border-gray-600">
        <div className="bg-blur bg-opacity-20 bg-[linear-gradient(135deg,rgba(74,1,216,0.3)_10%,#000_25%)] rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 min-h-[560px] sm:min-h-[620px] md:min-h-[720px] shadow-2xl shadow-black/40">            {/* Header Section */}
            <div className="flex-1">
              {/* Header Section */}
              <div className="mb-2 md:mb-3 text-center">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-audiowide font-bold mb-1 bg-gradient-to-r from-[#ffcc00] via-orange-400 to-orange-500 bg-clip-text text-transparent">
                  Enter the OTP code
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-400 font-exo2 mb-6">
                  Not register yet?{' '}
                  <button
                    onClick={() => router.push('/signup')}
                    className="text-white hover:underline font-exo2"
                  >
                    Create Account
                  </button>
                </p>
              </div>

              {/* Instructions */}
              <div className="mb-6 sm:mb-8 text-center">
                <p className="text-sm sm:text-base text-gray-300 font-exo2 font-semibold">
                  Enter the 4-digit code that we have sent<br />
                  via the Phone-No <span className="text-white font-extrabold">{maskedPhone}</span>
                </p>
              </div>

              {/* OTP Input */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center justify-center gap-4 sm:gap-5">
                  {code.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        inputsRef.current[i] = el
                      }}
                      value={d}
                      onChange={(e) => onCodeChange(i, e.target.value.replace(/\D/g, ''))}
                      onKeyDown={(e) => onCodeKeyDown(i, e)}
                      onPaste={onCodePaste}
                      inputMode="numeric"
                      maxLength={1}
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-center text-2xl sm:text-3xl md:text-4xl font-extrabold bg-transparent border-b-4 border-gray-600 text-white focus:border-[#ffcc00] focus:outline-none transition-all font-exo2"
                    />
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-red-500 text-sm sm:text-base text-center mb-3 font-exo2">
                  {error}
                </p>
              )}

              {/* Resend Code Section */}
              <div className="text-center mb-4 sm:mb-6 space-y-1">
                {timer > 0 ? (
                  <p className="text-sm sm:text-base text-gray-400 font-exo2 font-medium">
                    Resend code in{' '}
                    <span className="text-white font-extrabold">{formatTimer(timer)}</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-sm sm:text-base text-[#9b59ff] hover:underline font-exo2 font-semibold"
                  >
                    Resend
                  </button>
                )}
                <br />
                <p className="text-sm sm:text-base text-gray-400 font-exo2 font-medium">
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-[#9b59ff] hover:underline font-exo2 font-semibold"
                  >
                    Resend
                  </button>
                </p>
              </div>

              {/* Verifying Popup - Inside Form */}
              {verifying && (
                <div className="relative rounded-xl md:rounded-2xl bg-[linear-gradient(135deg,#4A01D8_0%,#4A01D8_15%,#000_50%,#000_100%)] p-6 sm:p-8 md:p-10 shadow-2xl border border-gray-800/40 mb-4 sm:mb-6">
                  {/* Loading Indicator - 4 dots in diamond pattern */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-4 sm:mb-6">
                      {/* Top dot */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-[#ffcc00] to-orange-500 animate-dot-pulse" style={{ animationDelay: '0s' }}></div>
                      {/* Right dot */}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-[#ffcc00] to-orange-500 animate-dot-pulse" style={{ animationDelay: '0.375s' }}></div>
                      {/* Bottom dot */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-[#ffcc00] to-orange-500 animate-dot-pulse" style={{ animationDelay: '0.75s' }}></div>
                      {/* Left dot */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-[#ffcc00] to-orange-500 animate-dot-pulse" style={{ animationDelay: '1.125s' }}></div>
                    </div>
                    
                    {/* Verifying Text */}
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-audiowide font-bold bg-gradient-to-r from-[#ffcc00] via-orange-400 to-orange-500 bg-clip-text text-transparent mb-2">
                      verifying
                    </h2>
                    
                    {/* Please wait text */}
                    <p className="text-xs sm:text-sm md:text-base text-white font-exo2">
                      Please wait..
                    </p>
                  </div>
                </div>
              )}

              {/* OTP Verified Success Popup - Inside Form */}
              {verified && (
                <div className="relative rounded-xl md:rounded-2xl bg-[linear-gradient(135deg,#4A01D8_0%,#4A01D8_15%,#000_50%,#000_100%)] p-4 sm:p-8 md:p-6 shadow-2xl border border-gray-800/40 mb-4 sm:mb-6">
                  <div className="flex flex-col items-center justify-center">
                    {/* Spade Icon with 21 */}
                    <div className="relative mb-6 sm:mb-8 flex items-center justify-center">
                      <Image 
                        src={image21}
                        alt="21 Spades" 
                        width={100}
                        height={120}
                        className="w-20 h-24 sm:w-24 sm:h-28 md:w-28 md:h-32 object-contain"
                      />
                    </div>
                    
                    {/* OTP verified text */}
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-audiowide font-bold bg-gradient-to-r from-[#ffcc00] via-orange-400 to-orange-500 bg-clip-text text-transparent mb-2">
                      OTP verified!
                    </h2>
                    
                    {/* Logging you in text */}
                    <p className="text-xs sm:text-sm md:text-base text-white font-exo2">
                      Logging you in...
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-1 md:pt-1.5 space-y-1.5 sm:space-y-2 mt-auto">
              <button
                type="button"
                onClick={handleVerify}
                disabled={verifying || codeValue.length !== 4}
                className="cursor-pointer w-full bg-[#4A01D8] border border-gray-600 text-white text-base sm:text-lg font-exo2 py-2 sm:py-2.5 rounded-full hover:opacity-90 transition disabled:opacity-50 font-extrabold"
              >
                {verifying ? 'Verifying...' : 'Send Verification Code'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="cursor-pointer w-full border  mt-3 border-gray-600 rounded-full text-white text-base sm:text-lg py-2 sm:py-2.5 hover:bg-[#4A008F] transition flex items-center justify-center gap-2 font-exo2 font-extrabold"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

