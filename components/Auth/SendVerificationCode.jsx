'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SendVerification() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const handleSend = async () => {
    setError('')
    if (!phone || phone.replace(/\D/g, '').length < 8) {
      setError('Please enter a valid phone number')
      return
    }
    try {
      setSending(true)
      // TODO: call API to send OTP
      // e.g. await sendOtpToPhone(phone)
      router.push(`/otp?phone=${encodeURIComponent(phone)}`)
    } catch (e) {
      setError('Failed to send code. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-gray-700 w-full max-w-md">
        <h1 className="text-xl font-bold text-white text-center mb-4">Phone Verification</h1>

        <label className="block text-white mb-2 font-exo2">Phone number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
          className="w-full border border-gray-600 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 bg-transparent"
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          onClick={handleSend}
          disabled={sending}
          className="w-full mt-4 bg-[#4A01D8] text-white py-2 rounded-full hover:opacity-90 transition disabled:opacity-50"
        >
          {sending ? 'Sending...' : 'Send Verification Code'}
        </button>
      </div>
    </div>
  )
}
