'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter,usePathname } from 'next/navigation'
import { Search, ChevronDown, Bell, Settings, Languages, Menu, X } from 'lucide-react'
import { useAuthStore } from '@/lib/store/authStore'
import { usePrivy } from '@privy-io/react-auth'
import { useMessage } from '@/lib/hooks/useMessage'

export default function AboutusHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user, logout } = useAuthStore()
  const { message } = useMessage()
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const languageRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const { logout: privyLogout, ready: privyReady } = usePrivy()
  // Get user's initial (first letter of name or username)
  const getUserInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase()
    if (user?.username) return user.username.charAt(0).toUpperCase()
    return 'U'
  }

  // Get user's display name
  const getUserDisplayName = () => {
    if (user?.name) return user.name
    if (user?.username) return user.username
    return 'User'
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese']
  const handleLogout = async () => {
    try {

      // Logout from Privy first if ready
      if (privyReady) {
        try {
          await privyLogout()
        } catch (privyError) {
          console.error('Privy logout error:', privyError)
          // Continue with logout even if Privy logout fails
        }
      }

      // Clear state
      await logout()
      setIsProfileOpen(false)
      
      // Show success toast
      message.success('Logged out successfully')
      
      // Delay to ensure toast is visible before redirect
      await new Promise(resolve => setTimeout(resolve, 100))
      // If already on landing page, stay there. Otherwise redirect to landing
      if (pathname === '/landing') {
        // Already on landing page, just refresh to clear any cached data
        router.refresh()
      } else {
        // Redirect to landing page
        router.replace('/landing')
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Even if logout fails, redirect to feed
      if (pathname === '/landing') {
        router.refresh()
      } else {
        router.replace('/landing')
      }
    }
  }
  return (
    <header
      className="flex items-center justify-center w-full px-4 md:px-8 py-4"
    >
      <div className="mx-auto w-full">
        <div className="flex items-center justify-between relative">
          {/* Left Side - Mobile Menu / Desktop Search & Language */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center text-white hover:text-gray-300 transition-colors w-8 h-8"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Desktop Search - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-4 md:gap-6">
              <div className="flex items-center gap-2 px-3  py-1 rounded-lg bg-white/5 border border-white/15 min-w-[220px] max-w-xs">
                <Search className="w-4 h-4 text-gray-300"  />
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent p-2 outline-none border-none text-sm text-white placeholder-gray-400 flex-1"
                  style={{ fontFamily: 'var(--font-exo2)' }}
                />
              </div>
            </div>
          </div>

          {/* Center - Logo (precise sizing and gradient) */}
          <div className="flex items-center justify-center absolute left-1/2 transform -translate-x-1/2" >
            <img src="/assets/logo.png" alt="Logo" className="h-8 md:h-auto" />
          </div>

          {/* Right Side - Login/Sign-Up Button or Profile Dropdown */}
          <div className="flex items-center gap-3 md:gap-4">
            {!isAuthenticated ? (
              /* Login | Sign-Up Button (when not logged in) */
              <button
                onClick={() => router.push('/login')}
                className="px-4 md:px-8 py-2 md:py-3 rounded-full text-white font-semibold text-xs md:text-base transition-all hover:opacity-90 hover:scale-105 active:scale-95 bg-gradient-to-b from-[#4F01E6] to-[#25016E]"
                style={{
                  fontFamily: 'var(--font-exo2)',
                }}
              >
                <span className="hidden sm:inline">Login | Sign-Up</span>
                <span className="sm:hidden">Login</span>
              </button>
            ) : (
              /* Profile Dropdown (when logged in) */
              <div className="relative border border-white/20 bg-transparent rounded-full" ref={profileRef} >
                <button
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen)
                    setIsLanguageOpen(false)
                  }}
                  className="flex items-center gap-2 text-white hover:text-gray-300 transition-all rounded-lg"
                  style={{
                    background: isProfileOpen ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    margin: '4px',
                  }}
                >
                  <div
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden flex items-center justify-center ring-2 ring-transparent hover:ring-purple-500/50 transition-all"
                    style={
                      user?.profilePicture
                        ? undefined
                        : { background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)' }
                    }
                  >
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={getUserDisplayName()}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/post/card-21.png'
                          e.currentTarget.className = 'w-full h-full object-contain'
                        }}
                      />
                    ) : (
                      <img
                        src="/post/card-21.png"
                        alt="Avatar"
                        className="w-[32px] h-[32px] md:w-[40px] md:h-[40px] object-contain"
                      />
                    )}
                  </div>
                  <span className="hidden lg:inline text-sm font-medium">{getUserDisplayName()}</span>
                  <ChevronDown
                    size={16}
                    className={`hidden md:block transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div
                    className="absolute top-full right-0 mt-2 rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{
                      background: 'rgba(17, 24, 39, 0.98)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.2)',
                      minWidth: '240px',
                      zIndex: 1000,
                    }}
                  >
                    {/* User Info Section */}
                    <div
                      className="px-5 py-4 border-b"
                      style={{ borderColor: 'rgba(139, 92, 246, 0.2)' }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center"
                          style={
                            user?.profilePicture
                              ? undefined
                              : { background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)' }
                          }
                        >
                          {user?.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={getUserDisplayName()}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/post/card-21.png'
                                e.currentTarget.className = 'w-full h-full object-contain'
                              }}
                            />
                          ) : (
                            <img
                              src="/post/card-21.png"
                              alt="Avatar"
                              className="w-full h-full object-contain"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{getUserDisplayName()}</p>
                          <p className="text-gray-400 text-xs mt-0.5">{user?.email || 'No email'}</p>
                        </div>
                      </div>
                    </div>

                   

                    {/* Logout Section */}
                    <div
                      className="border-t py-2"
                      style={{ borderColor: 'rgba(139, 92, 246, 0.2)' }}
                    >
                      <button
                        onClick={async () => {
                    
                          handleLogout()
                        }}
                        className="w-full text-left px-5 py-3 text-sm text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-3 group"
                      >
                        <svg className="w-4 h-4 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="group-hover:text-red-300 transition-colors font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: 'rgba(17, 24, 39, 0.95)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* Search */}
              <div className="w-full flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-transparent">
                <Search className="w-4 h-4 text-gray-300" />
                <input
                  type="text"
                  placeholder="Search"
                  className="flex-1 bg-transparent outline-none border-none text-sm text-white placeholder-gray-400"
                  style={{ fontFamily: 'var(--font-exo2)' }}
                />
              </div>

            </div>
          </div>
        )}

        <hr className="border-white/30 w-full my-4" />
      </div>
    </header>
  )
}
