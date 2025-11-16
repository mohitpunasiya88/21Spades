

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import type { LoginData, SignUpData } from '@/types/auth'
import { Eye, XIcon } from 'lucide-react'
import { message } from 'antd'
import { FacebookIcon, GoogleIcon } from '@/app/icon/svg'
import { useLoginWithOAuth, usePrivy } from '@privy-io/react-auth'

export default function LoginForm() {
  const router = useRouter()
  const { login, loginWithPrivy, isLoading, user, isAuthenticated } = useAuthStore()
  const { initOAuth, state: oauthState } = useLoginWithOAuth()
  const { ready: privyReady, authenticated: privyAuthenticated, user: privyUser, getAccessToken } = usePrivy()
  const hasCompletedPrivyLoginRef = useRef(false)

  // Redirect to feed when authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace('/feed')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (oauthState?.status === 'error') {
      const errorMessage = (oauthState as any)?.error?.message || 'Social login failed. Please try again.'
      message.error(errorMessage)
    }
  }, [oauthState])

  useEffect(() => {
    if (!privyReady || !privyAuthenticated || !privyUser) {
      return
    }

    console.log('Privy OAuth user details:', privyUser)

    if (hasCompletedPrivyLoginRef.current) {
      return
    }

    const completePrivyLogin = async () => {
      try {
        const accessToken = await getAccessToken()
        await loginWithPrivy(privyUser, accessToken ?? null)
        message.success('Logged in successfully with Privy!')
        router.replace('/feed')
      } catch (error: any) {
        console.error('Privy login completion error:', error)
        hasCompletedPrivyLoginRef.current = false
        const errorMessage = error?.message || 'Unable to complete Privy login. Please try again.'
        message.error(errorMessage)
      }
    }

    hasCompletedPrivyLoginRef.current = true
    void completePrivyLogin()
  }, [getAccessToken, loginWithPrivy, privyAuthenticated, privyReady, privyUser, router])

  const [formData, setFormData] = useState<LoginData>({

    username: '',
    password: '',
  })
  console.log('loginformuser', user)
  const [errors, setErrors] = useState<Partial<SignUpData>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [rememberMe, setRememberMe] = useState(false);
  const oauthLoading = oauthState?.status === 'loading'
  const oauthProvider = (oauthState as any)?.provider

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: undefined })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset errors
    setErrors({})
    
    // Validation checks
    if (!formData.username || formData.username.trim() === '') {
      setErrors({ username: 'Please enter your username' })
      message.error('Please enter your username')
      return
    }

    if (!formData.password || formData.password.trim() === '') {
      setErrors({ password: 'Please enter your password' })
      message.error('Please enter your password')
      return
    }

    if (formData.password.length < 6) {
      setErrors({ password: 'Password must be at least 6 characters long' })
      message.error('Password must be at least 6 characters long')
      return
    }

    try {
      await login(formData)
      message.success('Login successful! Redirecting...')
      // Redirect will happen via useEffect when isAuthenticated becomes true
    } catch (error: any) {
      console.error('Login error:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Login failed. Please check your credentials and try again.'
      message.error(errorMessage)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'twitter') => {
    if (!privyReady) {
      message.warning('Login is still initializing. Please try again in a moment.')
      return
    }

    try {
      hasCompletedPrivyLoginRef.current = false
      console.log(`Starting Privy OAuth login for provider: ${provider}`)
      await initOAuth({ provider })
    } catch (error: any) {
      console.error(`OAuth login error for ${provider}:`, error)
      const errorMessage = error?.message || 'Unable to start social login. Please try again.'
      message.error(errorMessage)
    }
  }

  return (
    <div className="flex-1 min-h-screen md:min-h-full flex items-center justify-center px-4 sm:px-6 md:px-8 py-8 md:py-8 relative pb-20 md:pb-20 m-2 sm:m-4 z-10 bg-black overflow-y-auto">
      {/* Right bottom corner purple glow - matching Figma */}
      <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="w-full max-w-md sm:max-w-lg relative z-10">
        {/* Form container with gray border */}
        <div className="relative rounded-xl md:rounded-2xl border border-gray-700/50">
        <div className="bg-[linear-gradient(135deg,rgba(74,1,216,0.2)_0%,rgba(74,1,216,0.1)_10%,rgba(0,0,0,0.98)_40%,#000_100%)] rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 min-h-[560px] sm:min-h-[620px] md:min-h-[720px] shadow-2xl shadow-black/60 backdrop-blur-[1px]">            {/* Header Section */}
            <div className="mb-2 md:mb-3 text-center">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-audiowide font-bold mb-1 bg-gradient-to-r from-[#ffcc00] via-orange-400 to-orange-500 bg-clip-text text-transparent">
                WELCOME BACK!
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

            <div className="flex w-[220px] sm:w-[260px] md:w-[300px] h-[50px] items-center justify-between gap-1.5 mb-6 sm:mb-8 bg-black/40 rounded-lg p-1 sm:p-1.5 mx-auto border border-gray-800">
              <button
                onClick={() => setLoginMethod('email')}
                className={`flex-1 whitespace-nowrap py-1.5 sm:py-2 px-2 font-exo2 rounded-md font-medium text-sm sm:text-base transition-all ${loginMethod === 'email'
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white bg-transparent'
                  }`}
              >
                Email ID
              </button>

              {/* Divider */}
              <div className="w-px h-5 sm:h-6 bg-gray-700 mx-1"></div>

              <button
                onClick={() => router.push('/send-verification')}
                className={`flex-1 whitespace-nowrap py-1.5 sm:py-2 px-2 font-exo2 rounded-md font-medium text-sm sm:text-base transition-all ${loginMethod === 'phone'
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white bg-transparent'
                  }`}
              >
                Phone number
              </button>
            </div>


            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-1.5 sm:space-y-2">

              <div>
                <label className="block text-white text-base sm:text-lg mb-1 font-exo2">User name</label>
                <div className="relative">
                  <img src="/assets/User Heart.png" alt="User" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10" />
                  <div className="absolute left-9 md:left-10 top-1/2 -translate-y-1/2 h-5 md:h-6 w-px bg-gray-600"></div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter user name"
                    className={`w-full border font-exo2 rounded-lg py-2 sm:py-2.5 pl-12 sm:pl-14 pr-3 sm:pr-4 text-white bg-black/40 placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors text-sm sm:text-base ${
                      errors.username ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-gray-500 focus:ring-gray-500'
                    }`}
                    required
                  />
                </div>
                {errors.username && <p className="text-red-400 text-xs sm:text-sm mt-1 font-exo2">{errors.username}</p>}
              </div>


              {/* Password */}
              <div>
                <label className="block text-white text-base sm:text-lg mb-1 font-exo2">Password</label>
                <div className="relative">
                  <img src="/assets/Key.png" alt="Key" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10" />
                  <div className="absolute left-9 md:left-10 top-1/2 -translate-y-1/2 h-5 md:h-6 w-px bg-gray-600"></div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    className={`w-full border font-exo2 rounded-lg py-2 sm:py-2.5 pl-12 sm:pl-14 pr-8 sm:pr-10 text-white bg-black/40 placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors text-sm sm:text-base ${
                      errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-gray-500 focus:ring-gray-500'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <Eye size={16} /> : <img src="/assets/Eye Closed.png" alt="Eye closed" className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs sm:text-sm mt-1 font-exo2">{errors.password}</p>}
              </div>
              <div className="flex mt-4 items-center justify-between mb-6 sm:mb-8 text-xs sm:text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 bg-black/40 accent-yellow-500"
                  />
                  Remember me
                </label>
                <button className="text-white hover:text-yellow-400 transition-colors">
                  Forgot Password
                </button>
              </div>

              <div className="relative mx-6 sm:mx-12 md:mx-12 lg:mx-24">
                <div className="h-px bg-gray-600 w-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="px-2 py-0.5 text-gray text-xs sm:text-sm font-exo2 bg-black rounded-full ">
                    OR
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-1 md:pt-1.5 space-y-1.5 sm:space-y-2">
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('twitter')}
                  disabled={oauthLoading}
                  className={`w-full mt-3 bg-black/40 border border-gray-700 rounded-full py-4 text-white font-medium transition-all flex items-center justify-center gap-3 ${oauthLoading ? 'opacity-60 cursor-not-allowed' : 'hover:border-gray-500'}`}
                >
                  <XIcon />
                  {oauthLoading && oauthProvider === 'twitter' ? 'Connecting...' : 'Continue with X'}
                </button>

                {/* <button className="w-full  mt-3 bg-black/40 border border-gray-700 rounded-full py-4 text-white font-medium hover:border-gray-500 transition-all flex items-center justify-center gap-3">
                  <FacebookIcon />
                  Continue with Facebook
                </button> */}

                <button
                  type="button"
                  onClick={() => handleOAuthLogin('google')}
                  disabled={oauthLoading}
                  className={`w-full mt-3 bg-black/40 border border-gray-700 rounded-full py-4 text-white font-medium transition-all flex items-center justify-center gap-3 ${oauthLoading ? 'opacity-60 cursor-not-allowed' : 'hover:border-gray-500'}`}
                >
                  <GoogleIcon />
                  {oauthLoading && oauthProvider === 'google' ? 'Connecting...' : 'Continue with Google'}
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-3 rounded-full px-4 py-2 sm:py-2.5 text-white text-base sm:text-lg font-exo2 font-semibold transition-all duration-200 bg-gradient-to-b from-[#4F01E6] to-[#25016E]"
                >
                  {isLoading ? 'Logging in...' : 'Log In'}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full  mt-3 border border-gray-600 rounded-full text-white text-base sm:text-lg py-2 sm:py-2.5 hover:bg-[#4A008F] transition flex items-center justify-center gap-2 font-exo2"
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

