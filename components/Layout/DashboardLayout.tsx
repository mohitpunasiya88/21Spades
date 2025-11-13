'use client'

import { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Menu, X } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex flex-col h-screen bg-[#020019]">
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#020019] w-full lg:w-auto">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden fixed top-16 sm:top-20 left-3 sm:left-4 z-30 px-4 py-2 bg-[#090721] border border-[#2A2F4A] rounded-lg text-white hover:bg-[#7E6BEF0A] transition-colors shadow-lg font-medium text-sm"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? 'Close' : 'Menu'}
          </button>
          {children}
        </main>
      </div>
    </div>
  )
}

