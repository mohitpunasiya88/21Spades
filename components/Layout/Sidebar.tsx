'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import {
  FileText,
  ShoppingBag,
  BarChart,
  User,
  Search,
  Calendar,
  File,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Send,
  Flame,
  Box,
} from 'lucide-react'
import { useUIStore } from '@/lib/store/uiStore'
import { useChatStore } from '@/lib/store/chatStore'
import { useAuthStore } from '@/lib/store/authStore'
import image22 from '@/components/assets/image22.png'

const menuItems = [
  // Group 1: Feed, Marketplace, SpadesFI
  { icon: FileText, label: 'Feed', path: '/feed' },
  { icon: ShoppingBag, label: 'Marketplace', path: '/marketplace' },
  { icon: BarChart, label: 'SpadesFI', path: '/spadesfi' },
  // Group 2: D-Drop, Explore, trending
  { icon: Box, label: 'D-Drop', path: '/d-drop' },
  { icon: Search, label: 'Explore', path: '/explore' },
  { icon: Flame, label: 'Trending', path: '/trending' },
  // Group 3: Events, News, Dashboard
  { icon: Calendar, label: 'Events', path: '/events' },
  { icon: File, label: 'News', path: '/news' },
  { icon: User, label: 'Dashboard', path: '/landing' },
]

// Helper function to format time from timestamp
function formatTime(timestamp?: string): string {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSpadesFIOpen, setIsSpadesFIOpen] = useState(false)
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { chats, getChats, isLoading: chatsLoading, typingUsers } = useChatStore()
  const { user } = useAuthStore()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null)
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const chatsFetchedRef = useRef(false)
  
  // Fetch chats only once when sidebar opens for the first time
  useEffect(() => {
    if (sidebarOpen && user && !chatsFetchedRef.current) {
      chatsFetchedRef.current = true
      getChats()
    }
    // Reset when sidebar closes
    if (!sidebarOpen) {
      chatsFetchedRef.current = false
    }
  }, [sidebarOpen, user, getChats])
  
  // Transform API chats to sidebar format and limit to 3 for sidebar preview
  const chatData = chats.slice(0, 3).map((chat) => {
    // Get the other participant (not current user)
    const otherParticipant = chat.participants?.find(
      (p) => p._id !== user?.id && p._id !== (user as any)?._id
    ) || chat.participants?.[0]
    
    // Check if user is typing
    const chatTypingUsers = typingUsers[chat._id] || []
    const isTyping = chatTypingUsers.length > 0 && chatTypingUsers.some(
      (userId) => userId !== user?.id && userId !== (user as any)?._id
    )
    
    // Get last message text
    const messageText = chat.lastMessage?.message || ''
    const isCurrentUserSender = chat.lastMessage?.senderId === user?.id || 
                                chat.lastMessage?.senderId === (user as any)?._id
    const displayMessage = isTyping 
      ? '...is typing' 
      : (isCurrentUserSender && messageText ? `You: ${messageText}` : messageText)
    
    return {
      id: chat._id,
      userId: otherParticipant?._id || '',
      name: otherParticipant?.name || otherParticipant?.username || 'Unknown User',
      message: displayMessage,
      time: formatTime(chat.lastMessage?.timestamp || chat.updatedAt),
      profilePicture: otherParticipant?.profilePicture,
      isTyping,
      unread: chat.unreadCount || 0,
    }
  })

  const handleNavigation = (path: string, label: string) => {
    // For coming soon items, navigate to route and let the page handle the modal
    router.push(path)
    if (onClose) {
      onClose()
    }
  }

  // SpadesFI dropdown items
  const spadesFIItems = [
    { label: 'CoinBase', path: '/spadesfi/coinbase' },
    { label: 'Uniswap', path: '/spadesfi/uniswap' },
    { label: 'Aave', path: '/spadesfi/aave' },
    { label: 'ParaSpace', path: '/spadesfi/paraspace' },
  ]

  return (
    <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} h-full overflow-y-auto scrollbar-hide bg-transparent transition-all duration-300 mt-25 md:mt-6 ${!sidebarOpen ? 'overflow-x-visible' : ''}`}>
      {/* Combined Container */}
      <div className={`${sidebarOpen ? 'px-4' : 'px-2'} pt-4 pb-4 ${!sidebarOpen ? 'overflow-visible' : ''}`}>
        <div className={`rounded-lg bg-[#090721] border border-[#2A2F4A] ${!sidebarOpen ? 'overflow-visible' : ''}`}>
          {/* Toggle Button */}
          <div className="flex justify-center   border-b border-[#2A2F4A]">
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg  text-white transition-colors"
              title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {sidebarOpen ? (
               <h1 className="text-white text-2xl font-exo2">MENU</h1>
              ) : (
                <Image src={image22} alt="Collapse" width={40} height={40} className="object-contain" />
              )}
            </button>
          </div>

          {/* Menu Items */}
          <nav className={!sidebarOpen ? 'overflow-visible' : ''}>
          {menuItems.map((item, idx) => {
            const Icon = item.icon
            const isActive = pathname === item.path || (item.label === 'SpadesFI' && pathname.startsWith('/spadesfi'))
            const isSpadesFI = item.label === 'SpadesFI'
            
            return (
              <div key={item.path}>
                {isSpadesFI ? (
                  <div className="relative group">
                    <button
                      ref={(el) => {
                        buttonRefs.current[item.path] = el
                      }}
                      onMouseEnter={() => {
                        if (!sidebarOpen && buttonRefs.current[item.path]) {
                          const rect = buttonRefs.current[item.path]!.getBoundingClientRect()
                          setTooltipPosition({ x: rect.right + 8, y: rect.top + rect.height / 2 })
                          setHoveredItem(item.path)
                        }
                      }}
                      onMouseLeave={() => {
                        setHoveredItem(null)
                        setTooltipPosition(null)
                      }}
                      onClick={() => setIsSpadesFIOpen(!isSpadesFIOpen)}
                      className={`relative flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} gap-3 ${sidebarOpen ? 'px-4' : 'px-2'} py-3 w-full transition-colors ${
                        isActive
                          ? 'text-[#FFB600] bg-[#7E6BEF0A]'
                          : 'text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon  
                          className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#FFB600]' : 'text-white'}`}
                          strokeWidth={1.5}
                        />
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
                      <div className="border-[#2A2F4A] ml-4">
                        {spadesFIItems.map((subItem) => {
                          const isSubActive = pathname === subItem.path
                          return (
                            <button
                              key={subItem.path}
                              onClick={() => handleNavigation(subItem.path, subItem.label)}
                              className={`w-full text-left px-4 py-2.5 pl-8 text-sm font-exo2 transition-colors ${
                                isSubActive
                                  ? 'text-[#FFB600] bg-[#7E6BEF0A]'
                                  : 'text-gray-300 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              {subItem.label}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative group">
                    <button
                      ref={(el) => {
                        buttonRefs.current[item.path] = el
                      }}
                      onMouseEnter={() => {
                        if (!sidebarOpen && buttonRefs.current[item.path]) {
                          const rect = buttonRefs.current[item.path]!.getBoundingClientRect()
                          setTooltipPosition({ x: rect.right + 8, y: rect.top + rect.height / 2 })
                          setHoveredItem(item.path)
                        }
                      }}
                      onMouseLeave={() => {
                        setHoveredItem(null)
                        setTooltipPosition(null)
                      }}
                      onClick={() => handleNavigation(item.path, item.label)}
                      className={`relative flex items-center mt-1 ${sidebarOpen ? 'gap-3' : 'justify-center'} ${sidebarOpen ? 'px-4' : 'px-2'} py-3 w-full transition-colors ${
                        isActive
                          ? 'text-[#FFB600] bg-[#7E6BEF0A]'
                          : 'text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon 
                        className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#FFB600]' : 'text-white'}`}
                        strokeWidth={1.5}
                      />
                      {sidebarOpen && <span className="text-sm font-exo2">{item.label}</span>}
                      {isActive && sidebarOpen && (
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#FFB600] rounded-l"></span>
                      )}
                    </button>
                  </div>
                )}
                {/* Separators after every 3 items (after idx 2, 5) */}
                {(idx === 2 || idx === 5) && <div className="mx-4 h-px bg-[#2A2F4A]" />}
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
                  onClick={() => handleNavigation('/messages', 'Messages')}
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
              {chatsLoading ? (
                <div className="text-center text-gray-400 py-4 text-sm">Loading chats...</div>
              ) : chatData.length === 0 ? (
                <div className="text-center text-gray-400 py-4 text-sm">No chats yet</div>
              ) : (
                chatData.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleNavigation(`/messages?chat=${chat.id}&userId=${chat.userId}`, 'Messages')}
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
                        <span className="text-white text-[10px] font-exo2">{chat.unread}</span>
                      </div>
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
                ))
              )}
            </div>

            {/* View All */}
            <button 
              onClick={() => handleNavigation('/messages', 'Messages')}
              className="flex items-center gap-1 text-white text-sm font-exo2 hover:text-gray-300 transition-colors"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          )}
        </div>
      </div>
      
      {/* Tooltip Portal - Renders outside sidebar to avoid overflow clipping */}
      {!sidebarOpen && hoveredItem && tooltipPosition && typeof window !== 'undefined' && createPortal(
        <div
          className="fixed px-3 py-1.5 bg-[#1a1a2e] text-white text-sm font-exo2 rounded-lg whitespace-nowrap z-[9999] border border-[#2A2F4A] shadow-xl pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateY(-50%)',
          }}
        >
          {menuItems.find(item => item.path === hoveredItem)?.label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-r-4 border-r-[#1a1a2e] border-b-4 border-b-transparent"></div>
        </div>,
        document.body
      )}

    </aside>
  )
}

