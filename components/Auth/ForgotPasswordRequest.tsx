'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { ChevronDown, Search } from 'lucide-react'
import { countryCodes, phoneValidationRules } from '@/lib/constants/countryCodes'

export default function ForgotPasswordRequest() {
  const router = useRouter()
  const { requestPasswordReset, isLoading } = useAuthStore()

  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [countrySearchQuery, setCountrySearchQuery] = useState('')
  const [error, setError] = useState('')
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false)
        setCountrySearchQuery('')
      }
    }

    if (showCountryDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showCountryDropdown])

  const validatePhoneNumber = (phoneNumber: string, code: string) => {
    const rules = phoneValidationRules[code]
    if (!rules) return { valid: false, message: 'Invalid country code' }

    const digits = phoneNumber.replace(/\D/g, '')
    if (!digits) return { valid: false, message: 'Please enter a phone number' }

    if (digits.length < rules.min) {
      return { valid: false, message: `${rules.message}. Minimum ${rules.min} digits required.` }
    }
    if (digits.length > rules.max) {
      return { valid: false, message: `${rules.message}. Maximum ${rules.max} digits allowed.` }
    }
    if (!rules.pattern.test(digits)) {
      return { valid: false, message: rules.message }
    }
    return { valid: true, message: '' }
  }

  const handleSubmit = async () => {
    setError('')
    const validation = validatePhoneNumber(phone, countryCode)
    if (!validation.valid) {
      setError(validation.message)
      return
    }

    try {
      await requestPasswordReset({ phoneNumber: phone, countryCode })
      const fullPhone = `${countryCode}${phone}`
      router.push(`/reset-password?phone=${encodeURIComponent(fullPhone)}`)
    } catch (e: any) {
      // Handle specific backend error messages
      const errorMessage = e?.response?.data?.message || e?.response?.data?.error || e?.message || 'Failed to send reset OTP. Please try again.'
      
      // Check if it's the "not available" error - might mean account needs verification
      if (errorMessage.includes('not available') || errorMessage.includes('Password reset is not available')) {
        setError('Password reset is not available for this account. Please verify your phone number first or contact support.')
      } else {
        setError(errorMessage)
      }
    }
  }

  const selectedCountry = countryCodes.find((c) => c.code === countryCode) || countryCodes[0]

  return (
    <div className="flex-1 min-h-screen h-full flex items-center justify-center px-4 sm:px-6 md:px-8 py-6 md:py-8 bg-[#03020800] relative pb-20 md:pb-24 m-2 sm:m-4">
      <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-[#480C64] rounded-full opacity-30 blur-3xl pointer-events-none"></div>
      <div className="w-full max-w-md sm:max-w-lg relative z-10">
        <div className="relative rounded-xl md:rounded-2xl border-1 border-gray-600">
          <div className="bg-blur bg-[linear-gradient(135deg,#4A01D8_1%,#4A01D8_1%,#000_17%,#000_90%)] rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 min-h-[520px] sm:min-h-[580px] md:min-h-[640px] shadow-2xl shadow-black/40 flex flex-col">
            <div className="flex-1">
              <div className="mb-4 text-center">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-audiowide font-bold mb-1 bg-gradient-to-r from-[#ffcc00] via-orange-400 to-orange-500 bg-clip-text text-transparent">
                  Forgot Password
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-400 font-exo2">
                  Enter your phone number to receive an OTP to reset your password.
                </p>
              </div>

              <div className="space-y-2 sm:space-y-3 mt-4">
                <label className="block text-white text-base sm:text-lg mb-1 font-exo2">Phone number</label>
                <div className="relative flex items-center gap-2">
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="flex items-center gap-2 px-3 py-2 sm:py-2.5 border border-gray-600 rounded-lg bg-transparent text-white hover:bg-gray-800/50 transition-colors min-w-[100px] justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{selectedCountry.flag}</span>
                        <span className="text-sm sm:text-base font-exo2">{selectedCountry.code}</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-64 max-h-60 overflow-hidden flex flex-col bg-[#1A1830] border border-gray-600 rounded-lg shadow-2xl z-50">
                        <div className="p-2 border-b border-gray-600 sticky top-0 bg-[#1A1830]">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search country..."
                              value={countrySearchQuery}
                              onChange={(e) => setCountrySearchQuery(e.target.value)}
                              className="w-full pl-10 pr-3 py-2 bg-[#0A0519] border border-gray-600 rounded-lg text-white text-sm font-exo2 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500"
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="overflow-y-auto scrollbar-hide flex-1">
                          <div className="p-2">
                            {countryCodes
                              .filter((country) => {
                                const query = countrySearchQuery.toLowerCase()
                                return (
                                  country.country.toLowerCase().includes(query) ||
                                  country.code.includes(query) ||
                                  country.flag.includes(query)
                                )
                              })
                              .map((country) => (
                                <button
                                  key={country.code}
                                  type="button"
                                  onClick={() => {
                                    setCountryCode(country.code)
                                    setShowCountryDropdown(false)
                                    setCountrySearchQuery('')
                                  }}
                                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors ${
                                    countryCode === country.code ? 'bg-purple-600/30' : ''
                                  }`}
                                >
                                  <span className="text-xl">{country.flag}</span>
                                  <span className="text-white text-sm font-exo2 flex-1 text-left">
                                    {country.code}
                                  </span>
                                  {countryCode === country.code && (
                                    <span className="text-purple-400 text-xs">✓</span>
                                  )}
                                </button>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 px-3 py-2 sm:py-2.5 border border-gray-600 rounded-lg bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 font-exo2"
                    placeholder="Enter your phone number"
                  />
                </div>
                {error && <p className="text-red-400 text-xs sm:text-sm mt-1 font-exo2">{error}</p>}
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-3 rounded-full text-lg font-exo2 font-semibold bg-gradient-to-b from-[#4F01E6] to-[#25016E] text-white hover:opacity-90 transition disabled:opacity-50"
              >
                {isLoading ? 'Sending OTP...' : 'Send Reset OTP'}
              </button>

              <button
                type="button"
                onClick={() => router.push('/login')}
                className="w-full py-3 border border-gray-800 rounded-full text-lg font-exo2 font-semibold text-gray-300 hover:bg-[#1b0045] transition"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


