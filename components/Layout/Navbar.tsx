'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { Badge } from 'antd'
import { Search, Bell, ChevronDown, Plus, Languages, Menu, X, LogOut, Wallet } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()
  const { logout, user } = useAuthStore()
  console.log('login98989898', user)

  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isWalletOpen, setIsWalletOpen] = useState(false)
  const [isWalletHovered, setIsWalletHovered] = useState(false)
  const [isCreateTokenHovered, setIsCreateTokenHovered] = useState(false)
  const [isProfileHovered, setIsProfileHovered] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const languageRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const walletRef = useRef<HTMLDivElement>(null)
  const mobileWalletRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileProfileRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
      if (walletRef.current && !walletRef.current.contains(event.target as Node)) {
        setIsWalletOpen(false)
      }
      if (mobileWalletRef.current && !mobileWalletRef.current.contains(event.target as Node)) {
        setIsWalletOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
      if (mobileProfileRef.current && !mobileProfileRef.current.contains(event.target as Node)) {
        setIsMobileProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese']

  const handleLogout = async () => {
    try {
      setIsMobileProfileOpen(false)

      // Clear state first
      await logout()

      // Small delay to ensure state is cleared before redirect
      await new Promise(resolve => setTimeout(resolve, 100))

      // Use replace to prevent going back to feed page
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout error:', error)
      // Even if logout fails, force redirect
      window.location.href = '/login'
    }
  }

  const handleclick = () => {
    router.push('/profile')
  }

  return (
    <div className="sticky top-0 z-50 bg-[#020019]">
     
      <nav
        className="backdrop-blur-sm border-b border-gray-800 px-3 sm:px-6 py-2 sm:py-4 flex items-center justify-between"
      >
      {/* Mobile Menu Button - Left Side */}
      <div className="sm:hidden relative" ref={mobileMenuRef}>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white hover:text-gray-300 transition-colors p-2"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div
            className="absolute top-full left-0 mt-2 rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 w-64"
            style={{
              background: 'rgba(17, 24, 39, 0.98)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.2)',
              zIndex: 1000,
            }}
          >
            {/* Language Selector */}
            <div className="border-b border-[#2A2F4A] p-4">
              <p className="text-gray-400 text-xs mb-2">Language</p>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-[#090721] text-white border border-gray-700 rounded-lg px-3 py-2 text-sm"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {/* Notifications */}
            <button
              className="w-full text-left px-4 py-3 text-white hover:bg-purple-600/30 transition-colors flex items-center gap-3 border-b border-[#2A2F4A]"
            >
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
              <Badge dot className="ml-auto [&_.ant-badge-dot]:!bg-red-500" />
            </button>

            {/* Create/Plus */}
            <button
              onClick={() => {
                router.push('/create-nft')
                setIsMobileMenuOpen(false)
              }}
              className="w-full text-left px-4 py-3 text-white hover:bg-purple-600/30 transition-colors flex items-center gap-3"
            >
              <Plus className="w-5 h-5" />
              <span>Create</span>
            </button>
          </div>
        )}
      </div>

      {/* Logo - Centered on Mobile */}
      <div className="flex items-center gap-2 sm:gap-6 absolute left-1/2 -translate-x-1/2 sm:relative sm:left-auto sm:translate-x-0">
        <div className="flex items-center gap-1 sm:gap-3">
          <div className="flex items-center gap-1 sm:gap-2 mb-1">
            <img src="/assets/logo.png" alt="Logo" className="h-6 sm:h-8 w-auto" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2 bg-[#F5F5F50A]  border border-gray-700 rounded-lg px-4 py-2.5 w-80">
          <Search className="w-5 h-5 " />
          {/* verdical line */}
          <div className="w-px h-[19px] bg-[#787486]" />
          <input
            type="text"
            placeholder="Search for anything..."
            className="bg-transparent border-none outline-none text-white placeholder-[#787486] flex-1 text-sm"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Language Selector */}
        {/* Language Dropdown */}
        <div className="relative hidden sm:block" ref={languageRef}>
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
            {/* Custom small caret (7.58 x 4.33) */}
            <svg
              className={`ml-1 ${isLanguageOpen ? 'rotate-180' : ''}`}
              width="7.58" height="4.33" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 1.5L8 7.5L15 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Language Dropdown Menu */}
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
        </div>

        {/* Notifications - Desktop */}
        <div className="relative hidden sm:block">
          <Badge count={8} offset={[-2, 2]} className="[&_.ant-badge-count]:!bg-red-500 [&_.ant-badge-count]:!text-white [&_.ant-badge-count]:!min-w-[18px] [&_.ant-badge-count]:!h-[18px] [&_.ant-badge-count]:!text-xs [&_.ant-badge-count]:!leading-none">
            <button className="relative text-white w-9 h-9 rounded-full border border-white/30 bg-transparent flex items-center justify-center hover:opacity-80 transition-all">
              <Bell className="w-5 h-5" />
            </button>
          </Badge>
        </div>

        {/* Notifications - Mobile */}
        <div className="relative sm:hidden">
          <Badge count={8} offset={[-2, 2]} className="[&_.ant-badge-count]:!bg-red-500 [&_.ant-badge-count]:!text-white [&_.ant-badge-count]:!min-w-[16px] [&_.ant-badge-count]:!h-[16px] [&_.ant-badge-count]:!text-xs [&_.ant-badge-count]:!leading-none">
            <button className="relative text-white w-8 h-8 rounded-full border border-white/30 bg-transparent flex items-center justify-center hover:opacity-80 transition-all">
              <Bell className="w-4 h-4" />
            </button>
          </Badge>
        </div>

        {/* Wallet Button with Hover Dropdown - Desktop */}
        <div className="relative hidden sm:block" ref={walletRef}>
          <button
            onMouseEnter={() => {
              setIsWalletHovered(true)
              setIsWalletOpen(true)
            }}
            onMouseLeave={() => {
              setIsWalletHovered(false)
              setIsWalletOpen(false)
            }}
            className={`flex items-center gap-2 rounded-full bg-transparent border border-white/30 hover:border-white/50 transition-all overflow-hidden ${
              isWalletHovered ? 'px-3 py-2' : 'p-2'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <Wallet className="w-4 h-4 text-gray-800" />
            </div>
            {isWalletHovered && (
              <>
                <span className="text-white font-semibold text-sm whitespace-nowrap">Wallet</span>
                <ChevronDown className={`w-4 h-4 text-white transition-transform ${isWalletOpen ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>

          {/* Wallet Dropdown Menu */}
          {isWalletOpen && (
            <div
              onMouseEnter={() => {
                setIsWalletHovered(true)
                setIsWalletOpen(true)
              }}
              onMouseLeave={() => {
                setIsWalletHovered(false)
                setIsWalletOpen(false)
              }}
              className="absolute top-full right-0 mt-2 rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
              style={{
                background: 'rgba(17, 24, 39, 0.98)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.2)',
                minWidth: '200px',
                zIndex: 1000,
              }}
            >
              <button className="w-full text-left px-5 py-3 text-sm text-white transition-all hover:bg-purple-600/30 flex items-center gap-3 group">
                <Wallet className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                <span className="group-hover:text-purple-300 transition-colors">Connect Wallet</span>
              </button>
              <button className="w-full text-left px-5 py-3 text-sm text-white transition-all hover:bg-purple-600/30 flex items-center gap-3 group border-t border-[#2A2F4A]">
                <Wallet className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                <span className="group-hover:text-purple-300 transition-colors">My Wallets</span>
              </button>
              <button className="w-full text-left px-5 py-3 text-sm text-white transition-all hover:bg-purple-600/30 flex items-center gap-3 group border-t border-[#2A2F4A]">
                <Wallet className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                <span className="group-hover:text-purple-300 transition-colors">Transaction History</span>
              </button>
            </div>
          )}
        </div>

        {/* Create Token Button - Desktop */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => router.push('/create-nft')}
            onMouseEnter={() => setIsCreateTokenHovered(true)}
            onMouseLeave={() => setIsCreateTokenHovered(false)}
            className={`flex items-center gap-2 rounded-full border border-white/30 bg-transparent hover:border-white/50 transition-all overflow-hidden ${
              isCreateTokenHovered ? 'px-3 sm:px-4 py-1.5 sm:py-2' : 'p-2'
            }`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white flex-shrink-0">
              {/* Hexagonal icon with plus sign */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Hexagon shape */}
                <path
                  d="M8 1L13.8564 4V12L8 15L2.14359 12V4L8 1Z"
                  fill="black"
                />
                {/* Plus sign */}
                <path
                  d="M8 5V11M5 8H11"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            {isCreateTokenHovered && (
              <span className="text-white font-semibold text-sm md:text-base whitespace-nowrap">Create Token</span>
            )}
          </button>
        </div>

        {/* Wallet Button - Mobile */}
        <div className="relative sm:hidden" ref={mobileWalletRef}>
          <button
            onClick={() => setIsWalletOpen(!isWalletOpen)}
            className="flex items-center gap-1.5 rounded-full border border-white/30 bg-transparent hover:border-white/50 transition-all p-1.5"
          >
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <Wallet className="w-3.5 h-3.5 text-gray-800" />
            </div>
          </button>

          {/* Wallet Dropdown Menu - Mobile */}
          {isWalletOpen && (
            <div
              className="absolute top-full right-0 mt-2 rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
              style={{
                background: 'rgba(17, 24, 39, 0.98)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.2)',
                minWidth: '200px',
                zIndex: 1000,
              }}
            >
              <button className="w-full text-left px-5 py-3 text-sm text-white transition-all hover:bg-purple-600/30 flex items-center gap-3 group">
                <Wallet className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                <span className="group-hover:text-purple-300 transition-colors">Connect Wallet</span>
              </button>
              <button className="w-full text-left px-5 py-3 text-sm text-white transition-all hover:bg-purple-600/30 flex items-center gap-3 group border-t border-[#2A2F4A]">
                <Wallet className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                <span className="group-hover:text-purple-300 transition-colors">My Wallets</span>
              </button>
              <button className="w-full text-left px-5 py-3 text-sm text-white transition-all hover:bg-purple-600/30 flex items-center gap-3 group border-t border-[#2A2F4A]">
                <Wallet className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                <span className="group-hover:text-purple-300 transition-colors">Transaction History</span>
              </button>
            </div>
          )}
        </div>

        {/* Create Token Button - Mobile */}
        <div className="relative sm:hidden">
          <button
            onClick={() => router.push('/create-nft')}
            className="flex items-center gap-1.5 rounded-full border border-white/30 bg-transparent hover:border-white/50 transition-all p-1.5"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white flex-shrink-0">
              {/* Hexagonal icon with plus sign */}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Hexagon shape */}
                <path
                  d="M8 1L13.8564 4V12L8 15L2.14359 12V4L8 1Z"
                  fill="black"
                />
                {/* Plus sign */}
                <path
                  d="M8 5V11M5 8H11"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </button>
        </div>

        {/* User Profile with Spades Text and Hover Dropdown */}
        {user && (
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Desktop Profile with Hover Dropdown */}
            <div className="relative hidden sm:block" ref={profileRef}>
              <button
                onMouseEnter={() => {
                  setIsProfileHovered(true)
                  setIsProfileOpen(true)
                }}
                onMouseLeave={() => {
                  setIsProfileHovered(false)
                  setIsProfileOpen(false)
                }}
                className={`flex items-center gap-2 rounded-full bg-transparent border border-white/30 hover:border-white/50 transition-all overflow-hidden ${
                  isProfileHovered ? 'px-3 py-2' : 'p-2'
                }`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name || 'User'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/avatar.jpg'
                      }}
                    />
                  ) : (
                    <img
                      src="/assets/avatar.jpg"
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                {isProfileHovered && (
                  <>
                    <span className="text-white font-semibold text-sm whitespace-nowrap">Spades</span>
                    <ChevronDown className={`w-4 h-4 text-white transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div
                  onMouseEnter={() => {
                    setIsProfileHovered(true)
                    setIsProfileOpen(true)
                  }}
                  onMouseLeave={() => {
                    setIsProfileHovered(false)
                    setIsProfileOpen(false)
                  }}
                  className="absolute top-full right-0 mt-2 rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                  style={{
                    background: 'rgba(17, 24, 39, 0.98)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.2)',
                    minWidth: '220px',
                    zIndex: 1000,
                  }}
                >
                  {/* User Info */}
                  <div className="p-4 border-b border-[#2A2F4A]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-600 bg-purple-600">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.name || 'User'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/assets/avatar.jpg'
                            }}
                          />
                        ) : (
                          <img
                            src="/assets/avatar.jpg"
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm">{user.name || 'User'}</p>
                        <p className="text-gray-400 text-xs truncate">{user.email || ''}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleclick}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded-lg transition-colors"
                    >
                      View Profile
                    </button>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Profile with Dropdown */}
            <div className="sm:hidden relative" ref={mobileProfileRef}>
              <button
                onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)}
                className="w-8 h-8 rounded-full overflow-hidden border border-gray-600 bg-purple-600 shadow-md flex items-center justify-center"
              >
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name || 'User'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/avatar.jpg'
                    }}
                  />
                ) : (
                  <img
                    src="/assets/avatar.jpg"
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                )}
              </button>

              {/* Mobile Profile Dropdown */}
              {isMobileProfileOpen && (
                <div
                  className="absolute top-full right-0 mt-2 rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 w-64"
                  style={{
                    background: 'rgba(17, 24, 39, 0.98)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.2)',
                    zIndex: 1000,
                  }}
                >
                  {/* User Info */}
                  <div className="p-4 border-b border-[#2A2F4A]">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-600 bg-purple-600">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.name || 'User'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/assets/avatar.jpg'
                            }}
                          />
                        ) : (
                          <img
                            src="/assets/avatar.jpg"
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm">{user.name || 'User'}</p>
                        <p className="text-gray-400 text-xs truncate">{user.email || ''}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleclick}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded-lg transition-colors"
                    >
                      View Profile
                    </button>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </nav>
    </div>
  )
}
