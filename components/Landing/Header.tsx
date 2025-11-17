'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter,usePathname } from 'next/navigation'
import { Search, ChevronDown, Bell, Settings, Languages, Menu, X } from 'lucide-react'
import { useAuthStore } from '@/lib/store/authStore'
import { usePrivy } from '@privy-io/react-auth'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user, logout } = useAuthStore()
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

  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese']
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
      // Small delay to ensure state is cleared before redirect
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
      className="flex items-center justify-center w-full mx-4 md:mx-8"
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

            {/* Desktop Search & Language - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-4 md:gap-6">
              {/* Search (84x22, gap 10) */}
              <button
                className="flex items-center justify-start gap-[10px] text-white hover:text-gray-300 transition-colors w-[84px] h-[22px]"
              >
                <Search className="w-4 h-4" />
                <span
                  className="hidden md:inline font-semibold text-[18px] leading-none"
                  style={{ fontFamily: 'var(--font-exo2)' }}
                >
                  Search
                </span>
              </button>

              {/* Separator (1x19) */}
              {/* <span className="w-px h-[19px] bg-white/60 rounded-full" /> */}

              {/* Language Dropdown */}
              {/* <div className="relative" ref={languageRef}>
                <button
                  onClick={() => {
                    setIsLanguageOpen(!isLanguageOpen)
                    setIsProfileOpen(false)
                  }}
                  className="flex items-center justify-start gap-[10px] text-white hover:text-gray-300 transition-all w-[107px] h-[22px]"
                  style={{
                    background: isLanguageOpen ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                  }}
                >
                  <Languages className="w-4 h-4" />
                  <span
                    className="font-semibold text-[18px] leading-none"
                    style={{ fontFamily: 'var(--font-exo2)' }}
                  >
                    {selectedLanguage}
                  </span>
                  Custom small caret (7.58 x 4.33)
                  <svg
                    className={`ml-1 ${isLanguageOpen ? 'rotate-180' : ''}`}
                    width="7.58" height="4.33" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1 1.5L8 7.5L15 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                // Language Dropdown Menu 
                {isLanguageOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{
                      background: 'rgba(17, 24, 39, 0.98)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.2)',
                      minWidth: '200px',
                      zIndex: 1000,
                    }}
                  >
                    {languages.map((lang, index) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setSelectedLanguage(lang)
                          setIsLanguageOpen(false)
                        }}
                        className="w-full text-left px-5 py-3 text-sm text-white transition-all hover:bg-purple-600/30 flex items-center justify-between group"
                        style={{
                          borderBottom: index < languages.length - 1 ? '1px solid rgba(139, 92, 246, 0.1)' : 'none',
                        }}
                      >
                        <span className="group-hover:text-purple-300 transition-colors">{lang}</span>
                        {lang === selectedLanguage && (
                          <span className="text-green-400 text-sm font-bold">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )} 
              </div> */}
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
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-600 flex items-center justify-center overflow-hidden ring-2 ring-transparent hover:ring-purple-500/50 transition-all ">
                    {user?.profilePicture || user?.avatar ? (
                      <img
                        src={user.profilePicture || user.avatar}
                        alt={getUserDisplayName()}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-semibold">{getUserInitial()}</span>
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
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-600 flex items-center justify-center overflow-hidden">
                          {user?.profilePicture || user?.avatar ? (
                            <img
                              src={user.profilePicture || user.avatar}
                              alt={getUserDisplayName()}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-semibold">{getUserInitial()}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{getUserDisplayName()}</p>
                          <p className="text-gray-400 text-xs mt-0.5">{user?.email || 'No email'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    {/* <div className="py-2">
                      <button className="w-full text-left px-5 py-3 text-sm text-white hover:bg-purple-600/30 transition-all flex items-center gap-3 group">
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="group-hover:text-purple-300 transition-colors">Profile</span>
                      </button>
                      <button className="w-full text-left px-5 py-3 text-sm text-white hover:bg-purple-600/30 transition-all flex items-center gap-3 group">
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="group-hover:text-purple-300 transition-colors">Settings</span>
                      </button>
                      <button className="w-full text-left px-5 py-3 text-sm text-white hover:bg-purple-600/30 transition-all flex items-center gap-3 group">
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="group-hover:text-purple-300 transition-colors">My Collections</span>
                      </button>
                      <button className="w-full text-left px-5 py-3 text-sm text-white hover:bg-purple-600/30 transition-all flex items-center gap-3 group">
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="group-hover:text-purple-300 transition-colors">Wallet</span>
                      </button> 
                    </div> */}

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
              <button className="w-full flex items-center gap-3 text-white hover:bg-purple-600/20 transition-all px-4 py-3 border-b border-white/10">
                <Search className="w-4 h-4" />
                <span className="font-medium text-sm" style={{ fontFamily: 'var(--font-exo2)' }}>Search</span>
              </button>

              {/* Language */}
              {/* <div className="flex items-center justify-between px-4 py-3 hover:bg-purple-600/20 transition-all">
                <div className="flex items-center gap-3">
                  <Languages className="w-4 h-4 text-white" />
                  <span className="font-medium text-sm text-white" style={{ fontFamily: 'var(--font-exo2)' }}>Language</span>
                </div>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-purple-900/30 text-white border border-white/20 rounded-md px-2 py-1 text-xs font-medium"
                  style={{ fontFamily: 'var(--font-exo2)' }}
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang} className="bg-gray-900">{lang}</option>
                  ))}
                </select>
              </div> */}
            </div>
          </div>
        )}

        <hr className="border-white/30 w-full my-4" />
      </div>
    </header>
  )
}
