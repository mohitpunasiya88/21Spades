'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { Badge } from 'antd'
import { Search, Bell, ChevronDown, Plus, Languages, Menu, X, LogOut, Wallet } from 'lucide-react'
import { usePrivy } from '@privy-io/react-auth'
import { useNotificationStore } from '@/lib/store/notificationStore'
import NotificationDropdown from '@/components/Notifications/NotificationDropdown'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { logout, user, getUser, isAuthenticated, checkAuth } = useAuthStore()
  const { logout: privyLogout } = usePrivy()
  const {
    items: notifItems,
    unreadCount,
    hasMore: notifHasMore,
    loading: notifLoading,
    fetchInitial: fetchNotifInitial,
    fetchMore: fetchNotifMore,
  } = useNotificationStore()

  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isWalletOpen, setIsWalletOpen] = useState(false)
  const [isWalletHovered, setIsWalletHovered] = useState(false)
  const [isCreateTokenHovered, setIsCreateTokenHovered] = useState(false)
  const [isProfileHovered, setIsProfileHovered] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const [selectedWalletOption, setSelectedWalletOption] = useState<string | null>(null)
  const languageRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const walletRef = useRef<HTMLDivElement>(null)
  const mobileWalletRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileProfileRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const hasFetchedNotificationsRef = useRef(false)
  
  // Fetch notification count on mount - only once when authenticated
  useEffect(() => {
    if (isAuthenticated && !hasFetchedNotificationsRef.current) {
      hasFetchedNotificationsRef.current = true
      fetchNotifInitial(5) // Fetch initial notifications to get the unread count
    }
    // Reset ref when user logs out
    if (!isAuthenticated) {
      hasFetchedNotificationsRef.current = false
    }
  }, [isAuthenticated, fetchNotifInitial])

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
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese']

  const profileSrc = user?.profilePicture || '/post/card-21.png'

  const handleLogout = async () => {
    try {
      setIsMobileProfileOpen(false)

      // First, log out of Privy session if available
      try { await privyLogout?.() } catch { }

      // Then clear app auth state
      await logout()

      // Small delay to ensure state is cleared before redirect
      await new Promise(resolve => setTimeout(resolve, 100))

      // Redirect to login to avoid accidental auto-login flows
      router.replace('/feed')
    } catch (error) {
      console.error('Logout error:', error)
      // Even if logout fails, redirect to feed
      if (pathname === '/feed') {
        router.refresh()
      } else {
        router.replace('/feed')
      }
    }
  }

  const handleclick = () => {
    router.push('/profile')
  }

  const timeAgo = (dateStr?: string) => {
    if (!dateStr) return ''
    const diff = Date.now() - new Date(dateStr).getTime()
    const s = Math.floor(diff / 1000)
    if (s < 60) return `${s}s`
    const m = Math.floor(s / 60)
    if (m < 60) return `${m}m`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h`
    const d = Math.floor(h / 24)
    if (d < 7) return `${d}d`
    const w = Math.floor(d / 7)
    if (w < 4) return `${w}w`
    const mo = Math.floor(d / 30)
    if (mo < 12) return `${mo}mo`
    const y = Math.floor(d / 365)
    return `${y}y`
  }

  return (
    <div className="sticky top-0 z-50 bg-[#020019]">

      <nav
        className="backdrop-blur-sm border-b border-gray-800 px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 flex items-center justify-between gap-2 sm:gap-4"
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
              {/* Search Bar - Mobile Only */}
              <div className="p-4 border-b border-[#2A2F4A]">
                <div className="flex items-center gap-2 bg-[#F5F5F50A] border border-gray-700 rounded-lg px-3 py-2.5">
                  <Search className="w-4 h-4 flex-shrink-0 text-gray-400" />
                  <div className="w-px h-4 bg-[#787486]" />
                  <input
                    type="text"
                    placeholder="No Search Found"
                    className="bg-transparent border-none outline-none text-white placeholder-[#787486] flex-1 text-sm w-0 min-w-0"
                  />
                </div>
              </div>

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
                <Badge count={8} className="ml-auto [&_.ant-badge-count]:!bg-red-500 [&_.ant-badge-count]:!text-white [&_.ant-badge-count]:!min-w-[18px] [&_.ant-badge-count]:!h-[18px] [&_.ant-badge-count]:!text-xs" />
              </button>

              {/* Wallet */}
              <button
                className="w-full text-left px-4 py-3 text-white hover:bg-purple-600/30 transition-colors flex items-center gap-3 border-b border-[#A3AED033]"
              >
                <Wallet className="w-5 h-5" />
                <span>Wallet</span>
              </button>

              {/* Create Token */}
              <button
                onClick={() => {
                  router.push('/create-nft')
                  setIsMobileMenuOpen(false)
                }}
                className="w-full text-left px-4 py-3 text-white hover:bg-purple-600/30 transition-colors flex items-center gap-3"
              >
                <Plus className="w-5 h-5" />
                <span>Create Token</span>
              </button>
            </div>
          )}
        </div>

        {/* 21SPADES */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-6 absolute left-1/2 -translate-x-1/2 sm:relative sm:left-auto sm:translate-x-0 z-10 flex-1 sm:flex-initial justify-center sm:justify-start min-w-0">
          <div className="flex items-center gap-1">
            <img src="/assets/Group 27.png" alt="group" />

            <div className="relative w-[30px] h-[35px] flex items-center justify-center">
              <img
                src="/assets/simple21spades.png"
                className="w-full h-full object-contain"
                alt="spade"
              />
            </div>
            <img src="/assets/Group 18.png" alt="group" />
          </div>


          {/* Search Bar - Hidden on Mobile, Visible on Desktop */}
          <div className="hidden sm:flex items-center gap-1 sm:gap-1.5 md:gap-2  border border-gray-700 rounded-lg px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 w-40 md:w-48 lg:w-64 xl:w-80">
            <Search className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 flex-shrink-0" />
            {/* vertical line */}
            <div className="w-px h-3.5 md:h-4 lg:h-[19px] bg-[#787486]" />
            <input
              type="text"
              placeholder="No Search Found"
              className="bg-transparent border-none outline-none text-white placeholder-[#787486] flex-1 text-xs md:text-sm w-0 min-w-0"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
          {/* Language Selector */}
          {/* Language Dropdown */}
          <div className="relative hidden sm:block" ref={languageRef}>
            {/* <button
            onClick={() => {
              setIsLanguageOpen(!isLanguageOpen)
              setIsProfileOpen(false)
            }}
            className="flex items-center justify-start gap-1 sm:gap-[10px] text-white hover:text-gray-300 transition-all w-20 sm:w-[107px] h-5 sm:h-[22px]"
            style={{
              background: isLanguageOpen ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
            }}
          > */}
            {/* <Languages className="w-4 h-4" />
            <span
              className="font-semibold text-sm sm:text-base md:text-[18px] leading-none"
              style={{ fontFamily: 'var(--font-exo2)' }}
            >
              {selectedLanguage}
            </span> */}
            {/* Custom small caret (7.58 x 4.33) */}
            {/* <svg
              className={`ml-1 ${isLanguageOpen ? 'rotate-180' : ''}`}
              width="7.58" height="4.33" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 1.5L8 7.5L15 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg> */}
            {/* </button> */}

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
          <div className="relative hidden sm:block" ref={notificationsRef}>
            <Badge count={unreadCount} offset={[-2, 2]} className="[&_.ant-badge-count]:!bg-red-500 [&_.ant-badge-count]:!text-white  [&_.ant-badge-count]:!min-w-[18px] [&_.ant-badge-count]:!h-[18px] [&_.ant-badge-count]:!text-xs [&_.ant-badge-count]:!leading-none">
              <button
                onClick={async () => {
                  const nextOpen = !isNotificationsOpen
                  setIsNotificationsOpen(nextOpen)
                  if (nextOpen && (!Array.isArray(notifItems) || notifItems.length === 0)) {
                    await fetchNotifInitial(5)
                  }
                }}
                className="relative text-white w-12 h-12 rounded-full border border-white/30 bg-[#A3AED033] flex items-center justify-center hover:opacity-80 transition-all"
              >
                <Bell className="w-5 h-5" />
              </button>
            </Badge>
            {isNotificationsOpen && (
              <div
                className="absolute top-full right-0 mt-1 rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                style={{
                  background: 'rgba(17, 24, 39, 0.98)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.2)',
                  minWidth: '360px',
                  maxWidth: '420px',
                  zIndex: 1000,
                }}
              >
                <NotificationDropdown open={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
              </div>
            )}
          </div>

          {/* Notifications - Mobile - HIDDEN, now in menu */}

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
              className={`flex items-center gap-2 rounded-full bg-transparent border border-white/30 hover:border-white/50 transition-all overflow-hidden ${isWalletHovered ? 'px-3 py-2' : 'p-2'
                }`}
            >
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 ">
                <Wallet className="w-4 h-4 text-gray-800 " />
              </div>
              {isWalletHovered && (
                <>
                  <span className="text-white font-semibold text-sm whitespace-nowrap">
                    {selectedWalletOption || 'Wallet'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-white transition-transform ${isWalletOpen ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>

            {/* Wallet Dropdown Menu */}
            {isWalletOpen && (
              <>
                {/* Invisible bridge to prevent gap issue */}
                <div
                  onMouseEnter={() => {
                    setIsWalletHovered(true)
                    setIsWalletOpen(true)
                  }}
                  className="absolute top-full right-0 w-full h-1"
                  style={{ zIndex: 1001 }}
                />
                <div
                  onMouseEnter={() => {
                    setIsWalletHovered(true)
                    setIsWalletOpen(true)
                  }}
                  onMouseLeave={() => {
                    setIsWalletHovered(false)
                    setIsWalletOpen(false)
                  }}
                  className="absolute top-full right-0 mt-1 rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                  style={{
                    background: 'rgba(17, 24, 39, 0.98)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.2)',
                    minWidth: '200px',
                    zIndex: 1000,
                  }}
                >
                  <button
                    onClick={() => {
                      setSelectedWalletOption('Connect Wallet')
                      setIsWalletOpen(false)
                      setIsWalletHovered(false)
                    }}
                    className="w-full text-left px-5 py-3 text-sm text-white transition-all hover:bg-purple-600/30 flex items-center gap-3 group"
                  >
                    <Wallet className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                    <span className="group-hover:text-purple-300 transition-colors">Connect Wallet</span>
                    {selectedWalletOption === 'Connect Wallet' && (
                      <span className="ml-auto text-green-400 text-sm font-bold">✓</span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedWalletOption('My Wallets')
                      setIsWalletOpen(false)
                      setIsWalletHovered(false)
                    }}
                    className="w-full text-left px-5 py-3 text-sm text-white transition-all hover:bg-purple-600/30 flex items-center gap-3 group border-t border-[#2A2F4A]"
                  >
                    <Wallet className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                    <span className="group-hover:text-purple-300 transition-colors">My Wallets</span>
                    {selectedWalletOption === 'My Wallets' && (
                      <span className="ml-auto text-green-400 text-sm font-bold">✓</span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedWalletOption('Transaction History')
                      setIsWalletOpen(false)
                      setIsWalletHovered(false)
                    }}
                    className="w-full text-left px-5 py-3 text-sm text-white transition-all hover:bg-purple-600/30 flex items-center gap-3 group border-t border-[#2A2F4A]"
                  >
                    <Wallet className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                    <span className="group-hover:text-purple-300 transition-colors">Transaction History</span>
                    {selectedWalletOption === 'Transaction History' && (
                      <span className="ml-auto text-green-400 text-sm font-bold">✓</span>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Create Token Button - Desktop */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => router.push('/create-nft')}
              onMouseEnter={() => setIsCreateTokenHovered(true)}
              onMouseLeave={() => setIsCreateTokenHovered(false)}
              className={`flex items-center gap-2 rounded-full border border-white/30 bg-transparent hover:border-white/50 transition-all overflow-hidden ${isCreateTokenHovered ? 'px-3 sm:px-4 py-1.5 sm:py-2' : 'p-2'
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

          {/* Wallet Button - Mobile - HIDDEN, now in menu */}

          {/* Create Token Button - Mobile - HIDDEN, now in menu */}

          {/* User Profile with Spades Text and Hover Dropdown */}
          {isAuthenticated ? (
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
                  className={`flex items-center gap-2 rounded-full bg-transparent border border-white/30 hover:border-white/50 transition-all overflow-hidden ${isProfileHovered ? 'px-3 py-2' : 'p-0'
                    }`}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0" style={
                    user?.profilePicture
                      ? undefined
                      : { background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)' }
                  }>
                    {user?.profilePicture ? (
                      <img
                        src={user?.profilePicture}
                        alt={user?.name || 'N/A'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/avatar.jpg'
                        }}
                      />
                    ) : (
                      <img
                        src="/post/card-21.png"
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  {isProfileHovered && (
                    <>
                      <span className="text-white font-semibold text-sm whitespace-nowrap">{user?.name || 'User'}</span>
                      <ChevronDown className={`w-4 h-4 text-white transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <>
                    {/* Invisible bridge to prevent gap issue */}
                    <div
                      onMouseEnter={() => {
                        setIsProfileHovered(true)
                        setIsProfileOpen(true)
                      }}
                      className="absolute top-full right-0 w-full h-1"
                      style={{ zIndex: 1001 }}
                    />
                    <div
                      onMouseEnter={() => {
                        setIsProfileHovered(true)
                        setIsProfileOpen(true)
                      }}
                      onMouseLeave={() => {
                        setIsProfileHovered(false)
                        setIsProfileOpen(false)
                      }}
                      className="absolute top-full right-0 mt-1 rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
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
                          <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0" style={
                            user?.profilePicture
                              ? undefined
                              : { background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)' }
                          }>
                            {user?.profilePicture ? (
                              <img
                                src={user?.profilePicture}
                                alt={user?.name || 'User'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/assets/avatar.jpg'
                                }}
                              />
                            ) : (
                              <img
                                src="/post/card-21.png"
                                alt="Avatar"
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-semibold text-sm">{user?.name || 'User'}</p>
                            <p className="text-gray-400 text-xs truncate">{user?.email || ''}</p>
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
                  </>
                )}
              </div>

              {/* Mobile Profile with Dropdown */}
              <div className="sm:hidden relative" ref={mobileProfileRef}>
                <button
                  onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)}
                  className="w-8 h-8 rounded-full overflow-hidden shadow-md flex items-center justify-center flex-shrink-0 p-1"
                  style={
                    user?.profilePicture
                      ? undefined
                      : { background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)' }
                  }
                >
                  {user?.profilePicture ? (
                    <img
                      src={user?.profilePicture}
                      alt={user?.name || 'User'}
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/post/card-21.png'
                        e.currentTarget.className = 'w-full h-full object-contain'
                      }}
                    />
                  ) : (
                    <img
                      src={profileSrc}
                      alt="Avatar"
                      className="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] object-contain"
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
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center p-1.5 flex-shrink-0"
                          style={
                            user?.profilePicture
                              ? undefined
                              : { background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)' }
                          }
                        >
                          {user?.profilePicture ? (
                            <img
                              src={user?.profilePicture}
                              alt={user?.name || 'User'}
                              className="w-full h-full rounded-full object-cover"
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
                        <div className="flex-1">
                          <p className="text-white font-semibold text-sm">{user?.name || 'User'}</p>
                          <p className="text-gray-400 text-xs truncate">{user?.email || ''}</p>
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
          ) : (
            // Login Button - Show when user is logged out
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 sm:px-6 sm:py-2 bg-gradient-to-b from-[#4F01E6] to-[#25016E] hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-full transition-all duration-300 text-sm sm:text-base shadow-lg hover:shadow-xl"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}