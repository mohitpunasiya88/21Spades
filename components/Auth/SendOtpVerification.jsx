'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SendOtpVerification() {
  const router = useRouter()

  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const [resendIn, setResendIn] = useState(0)
  const [code, setCode] = useState(Array(6).fill(''))
  const inputsRef = useRef([])

  const codeValue = useMemo(() => code.join(''), [code])

  useEffect(() => {
    if (!sent || resendIn <= 0) return
    const t = setInterval(() => setResendIn((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [sent, resendIn])

  const handleSend = async () => {
    setError('')
    if (!phone || phone.replace(/\D/g, '').length < 8) {
      setError('Please enter a valid phone number')
      return
    }
    try {
      setSending(true)
      // TODO: call API to send OTP
      setSent(true)
      setResendIn(30)
      setTimeout(() => inputsRef.current[0]?.focus(), 0)
    } catch (e) {
      setError('Failed to send code. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const handleVerify = async () => {
    setError('')
    if (codeValue.length !== 6) {
      setError('Enter the 6-digit code')
      return
    }
    try {
      setVerifying(true)
      // TODO: call API to verify OTP
      router.push('/feed')
    } catch (e) {
      setError('Invalid code. Please try again.')
    } finally {
      setVerifying(false)
    }
  }

  const onCodeChange = (idx, val) => {
    if (!/^[0-9]?$/.test(val)) return
    const next = [...code]
    next[idx] = val
    setCode(next)
    if (val && idx < 5) inputsRef.current[idx + 1]?.focus()
  }

  const onCodeKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) inputsRef.current[idx - 1]?.focus()
    if (e.key === 'ArrowLeft' && idx > 0) inputsRef.current[idx - 1]?.focus()
    if (e.key === 'ArrowRight' && idx < 5) inputsRef.current[idx + 1]?.focus()
  }

  const onCodePaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!text) return
    e.preventDefault()
    const arr = Array(6).fill('')
    for (let i = 0; i < text.length; i++) arr[i] = text[i]
    setCode(arr)
    const nextIndex = Math.min(text.length, 5)
    setTimeout(() => inputsRef.current[nextIndex]?.focus(), 0)
  }

  return (
    <div className="flex-1 min-h-screen h-full flex items-center justify-center px-4 sm:px-6 md:px-8 py-6 md:py-8 bg-[#03020800] relative pb-20 md:pb-24 m-2 sm:m-4">
      <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-[#480C64] rounded-full opacity-30 blur-3xl pointer-events-none"></div>
      <div className="w-full max-w-md sm:max-w-lg relative z-10">
        <div className="relative rounded-xl md:rounded-2xl border-1 border-gray-600">
        <div className="bg-blur bg-opacity-20 bg-[linear-gradient(135deg,rgba(74,1,216,0.3)_10%,#000_25%)] rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 min-h-[560px] sm:min-h-[620px] md:min-h-[720px] shadow-2xl shadow-black/40">            {/* Header Section */}
            <div className="flex-1">
              <div className="mb-2 md:mb-3 text-center">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-audiowide font-bold mb-1 bg-gradient-to-r from-[#ffcc00] via-orange-400 to-orange-500 bg-clip-text text-transparent">
                  WELCOME Back
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-400 font-exo2">
                Not register yet?{' '}
                <button
                    onClick={() => router.push('/signup')}
                    className="text-white hover:underline font-exo2"
                  >
                    Create Account
                  </button>
                </p>
              </div>

                <div className="mt-4 sm:mt-6">
                  <label className="block text-white text-base sm:text-lg mb-2 font-exo2">Enter 6-digit code</label>
                  <div className="flex items-center justify-between gap-2 sm:gap-3">
                    {code.map((d, i) => (
                      <input
                        key={i}
                        ref={(el) => (inputsRef.current[i] = el)}
                        value={d}
                        onChange={(e) => onCodeChange(i, e.target.value.replace(/\D/g, ''))}
                        onKeyDown={(e) => onCodeKeyDown(i, e)}
                        onPaste={onCodePaste}
                        inputMode="numeric"
                        maxLength={1}
                        className="w-10 h-12 sm:w-12 sm:h-14 text-center text-base sm:text-lg rounded-lg border border-gray-600 bg-transparent text-white focus:outline-none focus:ring-1 focus:ring-gray-500"
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={verifying}
                    className="w-full mt-4 bg-[#4A01D8] border border-gray-600 text-white text-base sm:text-lg font-exo2 py-2 sm:py-2.5 rounded-full hover:opacity-90 transition disabled:opacity-50"
                  >
                    {verifying ? 'Verifying...' : 'Verify'}
                  </button>
                </div>

              {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            </div>

            <div className="pt-1 md:pt-1.5 space-y-1.5 sm:space-y-2 mt-auto">
              <button
                type="button"
                onClick={handleSend}
                disabled={sending || resendIn > 0}
                className="cursor-pointer w-full mt-3 bg-[#4A01D8] border border-gray-600 text-white text-base sm:text-lg font-exo2 py-2 sm:py-2.5 rounded-full hover:opacity-90 transition disabled:opacity-50"
              >
                {sending ? 'Sending...' : resendIn > 0 ? `Resend in ${resendIn}s` : 'Send Verification Code'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="cursor-pointer w-full mt-3 border border-gray-600 rounded-full text-white text-base sm:text-lg py-2 sm:py-2.5 hover:bg-[#4A008F] transition flex items-center justify-center gap-2 font-exo2"
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
