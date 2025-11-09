'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { Input, Select, Badge, Button, Avatar, Dropdown, type MenuProps } from 'antd'
import { Search, Bell, ChevronDown, Plus, Languages } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [open, setOpen] = useState(false)
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

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <button
          onClick={() => {
            router.push('/profile')
            setOpen(false)
          }}
          className="w-full text-left text-white"
        >
          Profile
        </button>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: (
        <button
          onClick={() => {
            logout()
            router.push('/login')
            setOpen(false)
          }}
          className="w-full text-left text-red-400"
        >
          Logout
        </button>
      ),
    },
  ]

  return (
    <nav
      className="backdrop-blur-sm border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-[#020019]"
    >
      {/* Logo */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 mb-1">
            <img src="/assets/logo.png" alt="Logo" className="" />
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
      <div className="flex items-center gap-4">
        {/* Language Selector */}
        {/* Language Dropdown */}
        <div className="relative" ref={languageRef}>
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

        {/* Notifications */}
        <div className="relative">
          <Badge dot offset={[-2, 2]} className="[&_.ant-badge-dot]:!bg-red-500">
            <button className="relative text-gray-300 hover:text-white transition-colors w-9 h-9 rounded-full border border-gray-700 bg-gray-800/50 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </button>
          </Badge>
        </div>

        {/* Create NFT icon with border */}
        <button className="text-gray-300 hover:text-white transition-colors w-9 h-9 rounded-full border border-gray-700 bg-gray-800/50 flex items-center justify-center">
          <Plus className="w-5 h-5" />
        </button>

        {/* User Profile */}
        {/* Extra dummy avatar to mirror layout */}
        <Avatar
          size={32}
          src="https://i.pravatar.cc/80?img=32"
          className="!bg-gray-700 !border !border-gray-600"
        />

        <div className="relative dropdown-container">
          <Dropdown
            open={open}
            onOpenChange={setOpen}
            menu={{ items: menuItems }}
            dropdownRender={(menu) => (
              <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 w-48">{menu}</div>
            )}
          >
            <button className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
              <Avatar
                size={32}
                src="https://i.pravatar.cc/80?img=12"
                className="!bg-purple-600 !shadow-md !border !border-gray-600"
              />
              {/* <span className="hidden md:block font-medium">{user?.name || 'Spades'}</span> */}
              {/* <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} /> */}
            </button>
          </Dropdown>
        </div>
      </div>
    </nav>
  )
}
