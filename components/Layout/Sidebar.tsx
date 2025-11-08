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
  { icon: MessageCircle, label: 'Messages', path: '/messages' },
  { icon: ShoppingBag, label: 'Marketplace', path: '/marketplace' },
  { icon: BarChart, label: 'SpadesFI', path: '/spadesfi' },
  { icon: Grid3x3, label: 'D-Drop', path: '/ddrop' },
  { icon: Search, label: 'Explore', path: '/explore' },
  { icon: RefreshCw, label: 'trending', path: '/trending' },
  { icon: Calendar, label: 'Events', path: '/events' },
  { icon: File, label: 'News', path: '/news' },
  { icon: User, label: 'Dashboard', path: '/dashboard' },
  { icon: User, label: 'Profile', path: '/profile' },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <aside className="w-64 overflow-y-auto">
      {/* Logo */}
      {/* <div className="p-6 border-b border-gray-800">
        <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto shadow-md">
          <span className="text-white font-bold text-2xl">21</span>
        </div>
      </div> */}

      {/* Menu Items */}
      <nav className="p-4 pr-0 mt-5">
        <div className="rounded-xl border border-[#2A2F4A] bg-[#090721] h-[80vh]">
        {menuItems.map((item, idx) => {
          const Icon = item.icon
          const isActive = pathname === item.path
          return (
            <div key={item.path}>
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`relative flex items-center gap-3 px-4 py-3 transition-colors ${
                isActive
                  ? 'w-[253px] h-[49px] text-[#FFB600] bg-[#7E6BEF0A] border border-[#7E6BEF0A] rounded-tl-[5px] rounded-bl-[5px]'
                  : 'w-full text-gray-400 hover:text-white'
              }`}
            >
              <span className={`flex items-center justify-center w-6 h-6 rounded-md ${isActive ? 'border border-[#FFB600] bg-[#FFB6000A]' : 'border border-[#2A2F4A]'} `}>
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFB600]' : 'text-gray-400'}`} />
              </span>
              <span className="text-sm tracking-wide">{item.label}</span>
              {isActive && (
                <span className="absolute right-5  top-1/2  translate-y-[-50%]  w-1 h-6 rounded bg-yellow-500"></span>
              )}
            </button>
            {/* separators between groups */}
            {idx === 2 || idx === 5 ? <div className="mx-4 h-px bg-[#2A2F4A]" /> : null}
            </div>
          )
        })}
        </div>
      </nav>

      {/* Chat Section */}
      {/* <div className="p-4 border-t border-gray-800 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Chat</h3>
          <div className="text-gray-400">•••</div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <button className="text-xs px-2 py-1 bg-purple-600/90 text-white rounded">All</button>
          <button className="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded">Group</button>
          <button className="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded">Community</button>
        </div>
        <div className="space-y-2">
          {[{n:'Magnus Nelson',t:'16:45'},{n:'Jonas Walden',t:'16:41'},{n:'Rose Nelson',t:'16:38'}].map((c)=> (
            <div key={c.n} className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
              <div className="w-8 h-8 rounded-full border border-[#2A2F4A] bg-gray-800/40 flex items-center justify-center">
                <span className="text-white text-[10px] font-semibold">{c.n.split(' ').map(p=>p[0]).join('').slice(0,2)}</span>
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">{c.n}</p>
              </div>
              <div className="text-gray-500 text-xs">{c.t}</div>
            </div>
          ))}
        </div>
        <button className="text-purple-400 text-sm mt-2 hover:underline">
          View All &gt;
        </button>
      </div> */}
    </aside>
  )
}

