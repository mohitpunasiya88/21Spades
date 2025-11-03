'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  FileText,
  ShoppingBag,
  BarChart,
  MessageCircle,
  Users,
  User,
  Grid3x3,
  Search,
  RefreshCw,
  Calendar,
  File,
} from 'lucide-react'

const menuItems = [
  { icon: FileText, label: 'Feed', path: '/feed' },
  { icon: ShoppingBag, label: 'Marketplace', path: '/marketplace' },
  { icon: BarChart, label: 'SpadesFI', path: '/spadesfi' },
  { icon: MessageCircle, label: 'Messages', path: '/messages' },
  { icon: Users, label: 'Communities', path: '/communities' },
  { icon: User, label: 'Group', path: '/group' },
  { icon: Grid3x3, label: 'D-Drop', path: '/ddrop' },
  { icon: Search, label: 'Explore', path: '/explore' },
  { icon: RefreshCw, label: 'Trending', path: '/trending' },
  { icon: Calendar, label: 'Events', path: '/events' },
  { icon: File, label: 'News', path: '/news' },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 h-screen overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto">
          <span className="text-white font-bold text-2xl">21</span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Chat Section */}
      <div className="p-4 border-t border-gray-800 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Chat</h3>
          <div className="flex gap-2">
            <button className="text-xs px-2 py-1 bg-purple-600 text-white rounded">All</button>
            <button className="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded">Group</button>
            <button className="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded">Community</button>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">MN</span>
            </div>
            <div className="flex-1">
              <p className="text-white text-sm">Magnus Nelson</p>
              <p className="text-gray-500 text-xs">16:45</p>
            </div>
          </div>
        </div>
        <button className="text-purple-500 text-sm mt-2 hover:underline">
          View All &gt;
        </button>
      </div>
    </aside>
  )
}

