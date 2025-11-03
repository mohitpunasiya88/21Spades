'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { Search, Bell, User, ChevronDown } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.dropdown-container')) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">21</span>
          </div>
          <span className="text-white font-bold text-xl tracking-wide">SPADES</span>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 w-80">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for anything..."
            className="bg-transparent border-none outline-none text-white placeholder-gray-400 flex-1 text-sm"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <div className="hidden md:block">
          <select className="bg-gray-800/50 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 cursor-pointer">
            <option>English</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-900"></span>
          </button>
        </div>

        {/* Create NFT Button */}
        <button className="hidden md:block bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-lg">
          Create NFT
        </button>

        {/* User Profile */}
        <div className="relative dropdown-container">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center shadow-md">
              <User className="w-5 h-5" />
            </div>
            <span className="hidden md:block font-medium">{user?.name || 'Spades'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl py-2 z-50 border border-gray-700">
              <button
                onClick={() => {
                  router.push('/profile')
                  setShowDropdown(false)
                }}
                className="w-full text-left px-4 py-2.5 text-white hover:bg-gray-700 transition-colors text-sm"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  logout()
                  router.push('/login')
                  setShowDropdown(false)
                }}
                className="w-full text-left px-4 py-2.5 text-red-400 hover:bg-gray-700 transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
