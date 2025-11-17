'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { ChevronDown, Search } from 'lucide-react'

// Phone validation rules for each country
const phoneValidationRules = {
  '+1': { min: 10, max: 10, pattern: /^[0-9]{10}$/, message: 'US phone number must be 10 digits' },
  '+91': { min: 10, max: 10, pattern: /^[6-9][0-9]{9}$/, message: 'Indian phone number must be 10 digits starting with 6-9' },
  '+44': { min: 10, max: 10, pattern: /^[0-9]{10}$/, message: 'UK phone number must be 10 digits' },
  '+86': { min: 11, max: 11, pattern: /^1[3-9][0-9]{9}$/, message: 'Chinese phone number must be 11 digits starting with 1' },
  '+81': { min: 10, max: 11, pattern: /^[0-9]{10,11}$/, message: 'Japanese phone number must be 10-11 digits' },
  '+49': { min: 10, max: 11, pattern: /^[0-9]{10,11}$/, message: 'German phone number must be 10-11 digits' },
  '+33': { min: 9, max: 9, pattern: /^[0-9]{9}$/, message: 'French phone number must be 9 digits' },
  '+61': { min: 9, max: 9, pattern: /^[0-9]{9}$/, message: 'Australian phone number must be 9 digits' },
  '+7': { min: 10, max: 10, pattern: /^[0-9]{10}$/, message: 'Russian phone number must be 10 digits' },
  '+55': { min: 10, max: 11, pattern: /^[0-9]{10,11}$/, message: 'Brazilian phone number must be 10-11 digits' },
  '+52': { min: 10, max: 10, pattern: /^[0-9]{10}$/, message: 'Mexican phone number must be 10 digits' },
  '+39': { min: 9, max: 10, pattern: /^[0-9]{9,10}$/, message: 'Italian phone number must be 9-10 digits' },
  '+34': { min: 9, max: 9, pattern: /^[0-9]{9}$/, message: 'Spanish phone number must be 9 digits' },
  '+82': { min: 9, max: 10, pattern: /^[0-9]{9,10}$/, message: 'South Korean phone number must be 9-10 digits' },
  '+971': { min: 9, max: 9, pattern: /^[0-9]{9}$/, message: 'UAE phone number must be 9 digits' },
  '+65': { min: 8, max: 8, pattern: /^[0-9]{8}$/, message: 'Singapore phone number must be 8 digits' },
  '+60': { min: 9, max: 10, pattern: /^[0-9]{9,10}$/, message: 'Malaysian phone number must be 9-10 digits' },
  '+66': { min: 9, max: 9, pattern: /^[0-9]{9}$/, message: 'Thai phone number must be 9 digits' },
  '+62': { min: 9, max: 11, pattern: /^[0-9]{9,11}$/, message: 'Indonesian phone number must be 9-11 digits' },
  '+84': { min: 9, max: 10, pattern: /^[0-9]{9,10}$/, message: 'Vietnamese phone number must be 9-10 digits' },
}

// Common country codes
const countryCodes = [
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+44', country: 'GB', flag: '🇬🇧' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+7', country: 'RU', flag: '🇷🇺' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
  { code: '+52', country: 'MX', flag: '🇲🇽' },
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
  { code: '+82', country: 'KR', flag: '🇰🇷' },
  { code: '+971', country: 'AE', flag: '🇦🇪' },
  { code: '+65', country: 'SG', flag: '🇸🇬' },
  { code: '+60', country: 'MY', flag: '🇲🇾' },
  { code: '+66', country: 'TH', flag: '🇹🇭' },
  { code: '+62', country: 'ID', flag: '🇮🇩' },
  { code: '+84', country: 'VN', flag: '🇻🇳' },
]

export default function SendPhoneVerification() {
  const router = useRouter()
  const { sendOtp, isLoading,user } = useAuthStore()
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+1')
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [countrySearchQuery, setCountrySearchQuery] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false)
        setCountrySearchQuery('') // Clear search query on close
      }
    }

    if (showCountryDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showCountryDropdown])

  // Validate phone number based on country code
  const validatePhoneNumber = (phoneNumber, country) => {
    const rules = phoneValidationRules[country]
    if (!rules) {
      return { valid: false, message: 'Invalid country code' }
    }

    const phoneDigits = phoneNumber.replace(/\D/g, '')
    
    if (!phoneDigits) {
      return { valid: false, message: 'Please enter a phone number' }
    }

    if (phoneDigits.length < rules.min) {
      return { 
        valid: false, 
        message: `${rules.message}. Minimum ${rules.min} digits required.` 
      }
    }

    if (phoneDigits.length > rules.max) {
      return { 
        valid: false, 
        message: `${rules.message}. Maximum ${rules.max} digits allowed.` 
      }
    }

    if (!rules.pattern.test(phoneDigits)) {
      return { valid: false, message: rules.message }
    }

    return { valid: true, message: '' }
  }

  const handleSend = async () => {
    setError('')
 
    const validation = validatePhoneNumber(phone, countryCode)
    
    if (!validation.valid) {
      setError(validation.message)
      return
    }

    // Construct full phone number with country code
    const fullPhone = `${countryCode}${phone}`
    
    try {
      setSending(true)
      // Call API to send OTP with country code (phone only, otp will be empty for sending)
      await sendOtp({countryCode, phoneNumber: phone})
      router.push(`/verify-otp?phone=${encodeURIComponent(fullPhone)}`)
    } catch (e) {
      setError(e?.message || 'Failed to send code. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const selectedCountry = countryCodes.find((c) => c.code === countryCode) || countryCodes[0]

  return (
    <div className="flex-1 min-h-screen h-full flex items-center justify-center px-4 sm:px-6 md:px-8 py-6 md:py-8 bg-[#03020800] relative pb-20 md:pb-24 m-2 sm:m-4">
      <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-[#480C64] rounded-full opacity-30 blur-3xl pointer-events-none"></div>
      <div className="w-full max-w-md sm:max-w-lg relative z-10">
        <div className="relative rounded-xl md:rounded-2xl border-1 border-gray-600">
          <div className="bg-blur bg-[linear-gradient(135deg,#4A01D8_1%,#4A01D8_1%,#000_17%,#000_90%)] rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 min-h-[560px] sm:min-h-[620px] md:min-h-[720px] shadow-2xl shadow-black/40 flex flex-col">
            <div className="flex-1">
              {/* Header Section */}
              <div className="mb-2 md:mb-3 text-center">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-audiowide font-bold mb-1 bg-gradient-to-r from-[#ffcc00] via-orange-400 to-orange-500 bg-clip-text text-transparent">
                  Phone Verification
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

              {/* Phone Number Input */}
              <div className="space-y-2 sm:space-y-3">
                <label className="block text-white text-base sm:text-lg mb-1 font-exo2">Phone number</label>
                <div className="relative flex items-center gap-2">
                  {/* Country Code Dropdown */}
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

                    {/* Dropdown Menu */}
                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-64 max-h-60 overflow-hidden flex flex-col bg-[#1A1830] border border-gray-600 rounded-lg shadow-2xl z-50">
                        {/* Search Input */}
                        <div className="p-2 border-b border-gray-600 sticky top-0 bg-[#1A1830]">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search country..."
                              value={countrySearchQuery}
                              onChange={(e) => setCountrySearchQuery(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full pl-10 pr-3 py-2 bg-[#0A0519] border border-gray-600 rounded-lg text-white text-sm font-exo2 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500"
                              autoFocus
                            />
                          </div>
                        </div>
                        
                        {/* Country List */}
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
                                    setCountrySearchQuery('') // Clear search on selection
                                    // Re-validate phone when country changes
                                    if (phone) {
                                      const validation = validatePhoneNumber(phone, country.code)
                                      if (!validation.valid) {
                                        setError(validation.message)
                                      } else {
                                        setError('')
                                      }
                                    }
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
                            {countryCodes.filter((country) => {
                              const query = countrySearchQuery.toLowerCase()
                              return (
                                country.country.toLowerCase().includes(query) ||
                                country.code.includes(query) ||
                                country.flag.includes(query)
                              )
                            }).length === 0 && (
                              <div className="px-4 py-3 text-gray-400 text-sm font-exo2 text-center">
                                No country found
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Phone Input */}
                  <div className="relative flex-1">
                    <img src="/assets/Phone.png" alt="phone" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10" />
                    <div className="absolute left-9 md:left-10 top-1/2 -translate-y-1/2 h-5 md:h-6 w-px bg-gray-600"></div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        // Only allow numbers
                        const value = e.target.value.replace(/\D/g, '')
                        setPhone(value)
                        
                        // Real-time validation
                        if (value) {
                          const validation = validatePhoneNumber(value, countryCode)
                          if (!validation.valid && value.length >= phoneValidationRules[countryCode]?.min) {
                            setError(validation.message)
                          } else {
                            setError('')
                          }
                        } else {
                          setError('')
                        }
                      }}
                      onBlur={() => {
                        // Validate on blur
                        if (phone) {
                          const validation = validatePhoneNumber(phone, countryCode)
                          if (!validation.valid) {
                            setError(validation.message)
                          }
                        }
                      }}
                      placeholder="Enter phone number"
                      className={`w-full border font-exo2 rounded-lg py-2 sm:py-2.5 pl-12 sm:pl-14 pr-3 sm:pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors text-sm sm:text-base bg-transparent ${
                        error && phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-gray-500 focus:ring-gray-500'
                      }`}
                    />
                  </div>
                </div>
                {/* Display full phone number and validation info */}
                {phone && (
                  <div className="space-y-1">
                    <p className="text-gray-400 text-xs font-exo2">
                      Full number: {countryCode} {phone}
                    </p>
                    {phoneValidationRules[countryCode] && (
                      <p className="text-gray-500 text-xs font-exo2">
                        Required: {phoneValidationRules[countryCode].min}-{phoneValidationRules[countryCode].max} digits
                      </p>
                    )}
                  </div>
                )}
              </div>

              {error && (
                <p className="text-red-500 text-sm sm:text-base mt-3 font-exo2">{error}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-1 md:pt-1.5 space-y-1.5 sm:space-y-2 mt-auto">
              <button
                type="button"
                onClick={handleSend}
                disabled={sending}
                className="w-full rounded-full px-4 py-2 sm:py-2.5 text-white text-base sm:text-lg font-exo2 font-semibold btn-purple-gradient transition-all duration-200"
              >
                {sending ? 'Sending...' : 'Send Verification Code'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full border mt-3 border-gray-600 rounded-full text-white text-base sm:text-lg py-2 sm:py-2.5 hover:bg-[#4A008F] transition flex items-center justify-center gap-2 font-exo2"
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
