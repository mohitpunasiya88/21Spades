'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import type { SignUpData } from '@/types/auth'
import { Eye, ChevronDown } from 'lucide-react'
import { message } from 'antd'
import AuthLeftPanel from './AuthLeftPanel'

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

export default function SignUpForm() {
  const router = useRouter()
  const { signup, isLoading ,user} = useAuthStore()
  const [formData, setFormData] = useState<SignUpData>({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
 
  const [errors, setErrors] = useState<Partial<SignUpData>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [countryCode, setCountryCode] = useState('+91')
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [countrySearchQuery, setCountrySearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
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

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showCountryDropdown])

  // Validate phone number based on country code
  const validatePhoneNumber = (phoneNumber: string, country: string) => {
    const rules = phoneValidationRules[country as keyof typeof phoneValidationRules]
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (name === 'phone') {
      // Only allow numbers
      const phoneDigits = value.replace(/\D/g, '')
      setFormData({ ...formData, [name]: phoneDigits })
      setErrors({ ...errors, [name]: undefined })
      
      // Real-time validation
      if (phoneDigits) {
        const validation = validatePhoneNumber(phoneDigits, countryCode)
        if (!validation.valid && phoneDigits.length >= (phoneValidationRules[countryCode as keyof typeof phoneValidationRules]?.min || 0)) {
          setPhoneError(validation.message)
        } else {
          setPhoneError('')
        }
      } else {
        setPhoneError('')
      }
    } else {
      setFormData({ ...formData, [name]: value })
      setErrors({ ...errors, [name]: undefined })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset errors
    setErrors({})
    setPhoneError('')
    
    // Validation checks
    if (!formData.name || formData.name.trim() === '') {
      setErrors({ name: 'Please enter your name' })
      message.error('Please enter your name')
      return
    }

    if (!formData.username || formData.username.trim() === '') {
      setErrors({ username: 'Please enter a username' })
      message.error('Please enter a username')
      return
    }

    if (formData.username.length < 3) {
      setErrors({ username: 'Username must be at least 3 characters long' })
      message.error('Username must be at least 3 characters long')
      return
    }

    if (!formData.email || formData.email.trim() === '') {
      setErrors({ email: 'Please enter your email' })
      message.error('Please enter your email')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' })
      message.error('Please enter a valid email address')
      return
    }

    if (!formData.phone || formData.phone.trim() === '') {
      setPhoneError('Please enter your phone number')
      message.error('Please enter your phone number')
      return
    }

    // Validate phone number
    if (formData.phone) {
      const validation = validatePhoneNumber(formData.phone, countryCode)
      if (!validation.valid) {
        setPhoneError(validation.message)
        message.error(validation.message)
        return
      }
    }

    if (!formData.password || formData.password.trim() === '') {
      setErrors({ password: 'Please enter a password' })
      message.error('Please enter a password')
      return
    }

    if (formData.password.length < 6) {
      setErrors({ password: 'Password must be at least 6 characters long' })
      message.error('Password must be at least 6 characters long')
      return
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' })
      message.error('Passwords do not match')
      return
    }

    try {
      // Create payload with countryCode
      const signupData = {
        ...formData,
        countryCode,
      }
      await signup(signupData)
      message.success('Account created successfully! Redirecting to login...')
      setTimeout(() => {
      router.push('/login')
      }, 1000)
    } catch (error: any) {
      console.error('Signup error:', error)
      // Display error message to user
      const errorMessage = error?.response?.data?.message || error?.message || 'Signup failed. Please try again.'
      message.error(errorMessage)
      
      // Set field-specific errors
      if (errorMessage.includes('email')) {
        setErrors({ ...errors, email: errorMessage })
      } else if (errorMessage.includes('username')) {
        setErrors({ ...errors, username: errorMessage })
      } else if (errorMessage.includes('phone')) {
        setPhoneError(errorMessage)
      }
    }
  }

  return (
    <div className="flex-1 min-h-screen h-full flex items-center justify-center px-4 sm:px-6 md:px-8 py-6 md:py-8 bg-[##03020800] relative pb-20 md:pb-24 m-2 sm:m-4">
      {/* Right bottom corner color */}
      <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-[#480C64] rounded-full opacity-30 blur-3xl pointer-events-none"></div>
      <div className="w-full max-w-md sm:max-w-lg relative z-10">
        {/* Form container with gray border */}
        <div className="relative rounded-xl md:rounded-2xl border-1 border-gray-600">
          <div className="bg-blur bg-opacity-20 bg-[linear-gradient(135deg,rgba(74,1,216,0.3)_10%,#000_25%)] rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 min-h-[560px] sm:min-h-[620px] md:min-h-[720px] shadow-2xl shadow-black/40">
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
                    className={`w-full border font-exo2 rounded-lg py-2 sm:py-2.5 pl-12 sm:pl-14 pr-3 sm:pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors text-sm sm:text-base ${
                      errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-gray-500 focus:ring-gray-500'
                    }`}
                    required
                  />
                </div>
                {errors.name && <p className="text-red-400 text-xs sm:text-sm mt-1 font-exo2">{errors.name}</p>}
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
                    className={`w-full border font-exo2 rounded-lg py-2 sm:py-2.5 pl-12 sm:pl-14 pr-3 sm:pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors text-sm sm:text-base ${
                      errors.username ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-gray-500 focus:ring-gray-500'
                    }`}
                    required
                  />
                </div>
                {errors.username && <p className="text-red-400 text-xs sm:text-sm mt-1 font-exo2">{errors.username}</p>}
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
                    className={`w-full border font-exo2 rounded-lg py-2 sm:py-2.5 pl-12 sm:pl-14 pr-3 sm:pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors text-sm sm:text-base ${
                      errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-gray-500 focus:ring-gray-500'
                    }`}
                    required
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs sm:text-sm mt-1 font-exo2">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-white text-base sm:text-lg mb-1 font-exo2">Phone number</label>
                <div className="flex gap-2">
                  {/* Country Code Selector */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className={`flex items-center gap-1.5 px-3 py-2 sm:py-2.5 border font-exo2 rounded-lg text-white bg-transparent transition-colors text-sm sm:text-base min-w-[100px] ${
                        phoneError ? 'border-red-500' : 'border-gray-600'
                      } focus:outline-none focus:ring-1 focus:ring-gray-500`}
                    >
                      <span className="text-base">{countryCodes.find(c => c.code === countryCode)?.flag || '🇮🇳'}</span>
                      <span>{countryCodes.find(c => c.code === countryCode)?.country || 'IN'}</span>
                      <span>{countryCode}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 mt-1 bg-[#090721] border border-gray-600 rounded-lg shadow-lg z-50 w-[280px] max-h-60 overflow-hidden flex flex-col">
                        {/* Search Input */}
                        <div className="p-2 border-b border-gray-600 sticky top-0 bg-[#090721]">
                          <input
                            type="text"
                            placeholder="Search country..."
                            value={countrySearchQuery}
                            onChange={(e) => setCountrySearchQuery(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full px-3 py-2 bg-[#0A0519] border border-gray-600 rounded-lg text-white text-sm font-exo2 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500"
                            autoFocus
                          />
                        </div>
                        
                        {/* Country List */}
                        <div className="overflow-y-auto scrollbar-hide max-h-[200px]">
                          <div className="py-1">
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
                                    // Re-validate phone when country changes
                                    if (formData.phone) {
                                      const validation = validatePhoneNumber(formData.phone, country.code)
                                      if (!validation.valid && formData.phone.length >= (phoneValidationRules[country.code as keyof typeof phoneValidationRules]?.min || 0)) {
                                        setPhoneError(validation.message)
                                      } else {
                                        setPhoneError('')
                                      }
                                    }
                                  }}
                                  className={`w-full text-left px-4 py-2 text-sm font-exo2 text-white hover:bg-white/5 transition-colors flex items-center gap-2 ${
                                    countryCode === country.code ? 'bg-white/10' : ''
                                  }`}
                                >
                                  <span className="text-base">{country.flag}</span>
                                  <span>{country.country}</span>
                                  <span className="ml-auto">{country.code}</span>
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
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                      onBlur={() => {
                        // Validate on blur
                        if (formData.phone) {
                          const validation = validatePhoneNumber(formData.phone, countryCode)
                          if (!validation.valid) {
                            setPhoneError(validation.message)
                          }
                        }
                      }}
                    placeholder="Enter phone number"
                      className={`w-full border font-exo2 rounded-lg py-2 sm:py-2.5 pl-12 sm:pl-14 pr-3 sm:pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors text-sm sm:text-base bg-transparent ${
                        phoneError ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-gray-500 focus:ring-gray-500'
                      }`}
                    required
                  />
                </div>
                </div>
                {(phoneError || errors.phone) && (
                  <p className="text-red-400 text-xs sm:text-sm mt-1 font-exo2">{phoneError || errors.phone}</p>
                )}
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
                    className={`w-full border font-exo2 rounded-lg py-2 sm:py-2.5 pl-12 sm:pl-14 pr-8 sm:pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors text-sm sm:text-base ${
                      errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-gray-500 focus:ring-gray-500'
                    }`}
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
                {errors.password && <p className="text-red-400 text-xs sm:text-sm mt-1 font-exo2">{errors.password}</p>}
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
                    className={`w-full border font-exo2 rounded-lg py-2 sm:py-2.5 pl-12 sm:pl-14 pr-8 sm:pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors text-sm sm:text-base ${
                      errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-gray-500 focus:ring-gray-500'
                    }`}
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
                  <p className="text-red-400 text-xs sm:text-sm mt-1 font-exo2">{errors.confirmPassword}</p>
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
