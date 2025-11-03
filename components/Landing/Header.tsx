'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, ChevronDown, Bell, Settings } from 'lucide-react'

export default function Header() {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const languageRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

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

  return (
    <header 
       className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center mt-6 md:mt-10 px-4"
       style={{marginTop: '20px'}}
    >
      <div className="container mx-auto px-6 md:px-8 py-4">
        <div className="flex items-center justify-between relative">
          {/* Left Side - Search & Language */}
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
            >
              <Search size={20} />
              <span className="hidden md:inline text-sm">Search</span>
            </button>

            {/* Language Dropdown */}
            <div className="relative" ref={languageRef}>
              <button
                onClick={() => {
                  setIsLanguageOpen(!isLanguageOpen)
                  setIsProfileOpen(false)
                }}
                className="flex items-center gap-2 text-white hover:text-gray-300 transition-all px-4 py-2 rounded-lg"
                style={{
                  background: isLanguageOpen ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                }}
              >
                <span className="text-sm font-medium">{selectedLanguage}</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-300 ${isLanguageOpen ? 'rotate-180' : ''}`}
                />
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
          </div>

          {/* Center - Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="text-white font-bold text-2xl flex items-center gap-2">
              <span className="text-3xl">21</span>
              <span 
                className="text-2xl"
                style={{ 
                  background: 'linear-gradient(to right, #8B5CF6, #3B82F6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ♠
              </span>
              <span 
                style={{ 
                  background: 'linear-gradient(to right, #8B5CF6, #3B82F6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                SPADES
              </span>
            </div>
          </div>

          {/* Right Side - Profile & Icons */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-white hover:text-gray-300 transition-colors rounded-lg hover:bg-white/10">
              <Bell size={20} />
              <span 
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full animate-pulse"
                style={{ background: '#EF4444' }}
              />
            </button>

            {/* Settings */}
            <button className="p-2 text-white hover:text-gray-300 transition-colors rounded-lg hover:bg-white/10 hidden md:block">
              <Settings size={20} />
            </button>

            {/* Profile Dropdown */}
            <div className="relative border border-white/20 bg-transparent rounded-full" ref={profileRef} >
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen)
                  setIsLanguageOpen(false)
                }}
                className="flex items-center gap-2 text-white hover:text-gray-300 transition-all px-3 py-2 rounded-lg"
                style={{
                  background: isProfileOpen ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                  margin: '4px',
                }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-600 flex items-center justify-center overflow-hidden ring-2 ring-transparent hover:ring-purple-500/50 transition-all ">
                  <span className="text-white text-sm font-semibold">S</span>
                </div>
                <span className="hidden md:inline text-sm font-medium">Spades</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}
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
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-600 flex items-center justify-center">
                        <span className="text-white font-semibold">S</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">Spades</p>
                        <p className="text-gray-400 text-xs mt-0.5">spades@example.com</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-2">
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
                  </div>

                  {/* Logout Section */}
                  <div 
                    className="border-t py-2"
                    style={{ borderColor: 'rgba(139, 92, 246, 0.2)' }}
                  >
                    <button className="w-full text-left px-5 py-3 text-sm text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-3 group">
                      <svg className="w-4 h-4 group-hover:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="group-hover:text-red-300 transition-colors font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
