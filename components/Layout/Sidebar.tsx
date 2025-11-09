'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
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
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Send,
  ChevronLeft,
} from 'lucide-react'
import { useUIStore } from '@/lib/store/uiStore'
import image22 from '@/components/assets/image22.png'

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
]

const chatData = [
  {
    id: 'magnus-nelson',
    userId: '1',
    name: 'Magnus Nelson',
    message: '...is typing',
    time: '16:45',
    profilePicture: 'https://img.freepik.com/free-photo/portrait-young-man-with-dark-curly-hair_176420-18744.jpg?size=626&ext=jpg',
    isTyping: true,
    unread: 0,
  },
  {
    id: 'jonas-walden',
    userId: '2',
    name: 'Jonas Walden',
    message: 'You: Come back!',
    time: '16:45',
    profilePicture: 'https://img.freepik.com/free-photo/portrait-man-with-blue-purple-lighting_23-2149126949.jpg?size=626&ext=jpg',
    isTyping: false,
    unread: 0,
  },
  {
    id: 'rose-nelson',
    userId: '3',
    name: 'Rose Nelson',
    message: 'Wait for me',
    time: '16:45',
    profilePicture: 'https://img.freepik.com/free-photo/portrait-woman-with-dark-curly-hair_23-2149126948.jpg?size=626&ext=jpg',
    isTyping: false,
    unread: 1,
  },
]

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSpadesFIOpen, setIsSpadesFIOpen] = useState(false)
  const { sidebarOpen, toggleSidebar } = useUIStore()

  const handleNavigation = (path: string) => {
    router.push(path)
    if (onClose) {
      onClose()
    }
  }

  // SpadesFI dropdown items
  const spadesFIItems = [
    { label: 'Dashboard', path: '/spadesfi/dashboard' },
    { label: 'Analytics', path: '/spadesfi/analytics' },
    { label: 'Reports', path: '/spadesfi/reports' },
    { label: 'Settings', path: '/spadesfi/settings' },
  ]

  return (
    <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} h-full overflow-y-auto scrollbar-hide bg-[#020019] transition-all duration-300 mt-6`}>
      {/* Combined Container */}
      <div className={`${sidebarOpen ? 'px-4' : 'px-2'} pt-4 pb-4`}>
        <div className="rounded-lg bg-[#090721] border border-[#2A2F4A]">
          {/* Toggle Button */}
          <div className="flex justify-center   border-b border-[#2A2F4A]">
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg  text-white transition-colors"
              title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {sidebarOpen ? (
               <Image src={image22} alt="Collapse" width={40} height={40} className="object-contain" />
              ) : (
                <Image src={image22} alt="Collapse" width={40} height={40} className="object-contain" />
              )}
            </button>
          </div>

          {/* Menu Items */}
          <nav >
          {menuItems.map((item, idx) => {
            const Icon = item.icon
            const isActive = pathname === item.path || (item.label === 'SpadesFI' && pathname.startsWith('/spadesfi'))
            const isSpadesFI = item.label === 'SpadesFI'
            
            return (
              <div key={item.path}>
                {isSpadesFI ? (
                  <div>
                    <button
                      onClick={() => {setIsSpadesFIOpen(!isSpadesFIOpen); toggleSidebar()}}
                      className={`relative flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} gap-3 ${sidebarOpen ? 'px-4' : 'px-2'} py-3 w-full transition-colors ${
                        isActive
                          ? 'text-[#FFB600] bg-[#7E6BEF0A]'
                          : 'text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon  className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#FFB600]' : 'text-white'}`} />
                        {sidebarOpen && <span className="text-sm font-exo2">{item.label}</span>}
                      </div>
                      {sidebarOpen && (
                        <ChevronDown 
                          className={`w-4 h-4 transition-transform ${isSpadesFIOpen ? 'rotate-180' : ''} ${isActive ? 'text-[#FFB600]' : 'text-white'}`} 
                        />
                      )}
                      {isActive && sidebarOpen && (
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#FFB600] rounded-l"></span>
                      )}
                    </button>
                    
                    {/* SpadesFI Dropdown */}
                    {isSpadesFIOpen && sidebarOpen && (
                      <div className="bg-[#0A0519] border-l-2 border-[#2A2F4A] ml-4">
                        {spadesFIItems.map((subItem) => {
                          const isSubActive = pathname === subItem.path
                          return (
                            <button
                              key={subItem.path}
                              onClick={() => handleNavigation(subItem.path)}
                              className={`w-full text-left px-4 py-2.5 pl-8 text-sm font-exo2 transition-colors flex items-center gap-2 ${
                                isSubActive
                                  ? 'text-[#FFB600] bg-[#7E6BEF0A]'
                                  : 'text-gray-300 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              {subItem.label}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`relative flex items-center ${sidebarOpen ? 'gap-3' : 'justify-center'} ${sidebarOpen ? 'px-4' : 'px-2'} py-3 w-full transition-colors ${
                      isActive
                        ? 'text-[#FFB600] bg-[#7E6BEF0A]'
                        : 'text-white hover:bg-white/5'
                    }`}
                    title={!sidebarOpen ? item.label : ''}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#FFB600]' : 'text-white'}`} />
                    {sidebarOpen && <span className="text-sm font-exo2">{item.label}</span>}
                    {isActive && sidebarOpen && (
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#FFB600] rounded-l"></span>
                    )}
                  </button>
                )}
                {/* separators between groups - after SpadesFI (idx 3) and after trending (idx 6) */}
                {(idx === 3 || idx === 6) && <div className="mx-4 h-px bg-[#2A2F4A]" />}
              </div>
            )
          })}
          </nav>

          {/* Separator Line between Navigation and Chat */}
          {sidebarOpen && <div className="mx-4 my-2 h-px bg-[#2A2F4A]"></div>}

          {/* Chat Section */}
          {sidebarOpen && (
            <div className="p-4">
            {/* Chat Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-exo2">Chat</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleNavigation('/messages')}
                  className="text-white hover:text-gray-300 transition-colors"
                  title="New Message"
                >
                  <Send className="w-5 h-5" />
                </button>
                <button className="text-white hover:text-gray-300 transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter */}
            <div className="mb-4">
              <button className="text-white text-sm font-exo2 relative pb-1.5">
                All
                <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-white"></span>
              </button>
            </div>

            {/* Chat List */}
            <div className="space-y-2.5 mb-4">
              {chatData.map((chat, idx) => (
                <div
                  key={idx}
                  onClick={() => handleNavigation(`/messages?chat=${chat.id}&userId=${chat.userId}`)}
                  className="flex items-center gap-3 py-2 px-1 hover:bg-white/5 rounded-lg cursor-pointer transition-colors"
                >
                  {/* Profile Picture */}
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={chat.profilePicture}
                      alt={chat.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-exo2 truncate mb-0.5">{chat.name}</p>
                    <p className={`text-xs truncate ${chat.isTyping ? 'text-gray-400 italic' : 'text-gray-400'}`}>
                      {chat.message}
                    </p>
                  </div>

                  {/* Right Side - Time, Badge, Arrow */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-gray-400 text-xs whitespace-nowrap">{chat.time}</span>
                    {chat.unread > 0 ? (
                      <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                        <span className="text-white text-[10px] font-semibold">{chat.unread}</span>
                      </div>
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* View All */}
            <button 
              onClick={() => handleNavigation('/messages')}
              className="flex items-center gap-1 text-white text-sm font-exo2 hover:text-gray-300 transition-colors"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          )}
        </div>
      </div>
    </aside>
  )
}

