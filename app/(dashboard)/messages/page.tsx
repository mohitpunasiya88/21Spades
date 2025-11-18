'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, MoreVertical, Edit, Check, Users } from 'lucide-react'
import { useChatStore, type Chat } from '@/lib/store/chatStore'
import { useAuthStore } from '@/lib/store/authStore'
import { useSocket } from '@/lib/hooks/useSocket'
import ChatWindow from '@/components/ChatWindow'

export default function MessagesPage() {
  const searchParams = useSearchParams()
  const { user } = useAuthStore()
  const {
    chats,
    searchedUsers,
    selectedChat,
    isLoading,
    isSearchingUsers,
    typingUsers,
    getChats,
    createOrGetChat,
    searchUsers,
    clearSearchedUsers,
    setSelectedChat,
    setSocket,
  } = useChatStore()

  // WebSocket integration
  const { socket, isConnected } = useSocket()
  
  // Get current user ID for filtering typing users
  const currentUserId = user?.id || (user as any)?._id || ''

  const [searchQuery, setSearchQuery] = useState('')
  const [showEditMenu, setShowEditMenu] = useState(false)
  const [newMessageSearch, setNewMessageSearch] = useState('')
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false)
  const editMenuRef = useRef<HTMLDivElement>(null)

  // Initialize WebSocket connection
  useEffect(() => {
    if (socket && isConnected) {
      setSocket(socket)
    }
    return () => {
      // Don't clear socket on unmount, let it persist
    }
  }, [socket, isConnected, setSocket])

  // Load chats on mount
  useEffect(() => {
    getChats()
  }, [getChats])


  // Handle URL query parameters for chat selection
  useEffect(() => {
    const chatId = searchParams.get('chat')
    const userId = searchParams.get('userId')
    
    if (chatId && chats.length > 0) {
      const chat = chats.find(c => c._id === chatId)
      if (chat) {
        setSelectedChat(chat)
        setIsMobileChatOpen(true)
      }
    } else if (userId && chats.length > 0) {
      // Find chat by userId - check both _id and id formats
      const chat = chats.find(c => 
        c.participants && c.participants.some(p => 
          p._id === userId || (p as any).id === userId
        )
      )
      if (chat) {
        setSelectedChat(chat)
        setIsMobileChatOpen(true)
      } else {
        // Create new chat with this user
        createOrGetChat(userId).then((chat) => {
          if (chat) {
            setIsMobileChatOpen(true)
          }
        })
      }
    }
  }, [searchParams, chats, setSelectedChat, createOrGetChat])

  // Search users when typing in new message search (Backend API Call)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (newMessageSearch.trim()) {
        searchUsers(newMessageSearch.trim()).catch((error) => {
          console.error('🔍 [SEARCH] Error in searchUsers:', error)
        })
      } else {
        clearSearchedUsers()
      }
    }, 300) // Debounce search

    return () => {
      clearTimeout(timeoutId)
    }
  }, [newMessageSearch]) // Removed searchUsers and clearSearchedUsers from deps to avoid re-renders

  // Search users when typing in main search input (Backend API Call)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchUsers(searchQuery.trim()).catch((error) => {
          console.error('🔍 [SEARCH] Error in searchUsers:', error)
        })
      } else {
        clearSearchedUsers()
      }
    }, 300) // Debounce search

    return () => {
      clearTimeout(timeoutId)
    }
  }, [searchQuery])

  const handleSelectChat = useCallback((chat: Chat) => {
    setSelectedChat(chat)
    setIsMobileChatOpen(true)
  }, [setSelectedChat])

  // Handle back button - close chat on mobile
  const handleBackToChatList = useCallback(() => {
    setIsMobileChatOpen(false)
    setSelectedChat(null)
  }, [setSelectedChat])

  // Format timestamp helper for date separators
  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return 'Invalid Date'
    try {
      const date = new Date(timestamp)
      if (isNaN(date.getTime())) {
        console.error('Invalid timestamp:', timestamp)
        return 'Invalid Date'
      }
      const now = new Date()
      const diff = now.getTime() - date.getTime()
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (days === 0) {
        return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
      } else if (days === 1) {
        return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }
    } catch (error) {
      console.error('Error formatting timestamp:', timestamp, error)
      return 'Invalid Date'
    }
  }

  // Handle user selection from search
  const handleUserSelect = async (userId: string) => {
    try {
      const chat = await createOrGetChat(userId)
      if (chat) {
        setSelectedChat(chat)
        setIsMobileChatOpen(true)
      }
      setShowEditMenu(false)
      setNewMessageSearch('')
      clearSearchedUsers()
      setSearchQuery('')
    } catch (error) {
      console.error('Error creating chat:', error)
    }
  }

  // Handle click outside edit menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editMenuRef.current && !editMenuRef.current.contains(event.target as Node)) {
        setShowEditMenu(false)
      }
    }

    if (showEditMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEditMenu])

  return (
    <div className="flex h-[calc(100vh-120px)] mt-10 font-exo2 w-full overflow-hidden min-h-0 relative">
      {/* Chat List */}
      <div className={`w-full md:w-80 bg-[#090721] scrollbar-hide border border-[#FFFFFF33] rounded-[21px] mx-2 md:mx-5 font-exo2 px-2 flex flex-col h-full min-h-0 transition-all duration-300 ${
        isMobileChatOpen ? 'hidden md:flex' : 'flex'
      }`}>
        <div>
          <div className="flex items-center justify-between p-2 my-2">
            <h2 className="text-white text-[24px] font-[700]">Chats</h2>
            <div className='gap-2 flex relative'>
              <button 
                onClick={() => setShowEditMenu(!showEditMenu)}
                className="text-[#787785] hover:text-white transition-colors"
              >
                <Edit className="w-[18px] h-[18px]" />
              </button>
              {showEditMenu && (
                <div 
                  ref={editMenuRef}
                  className="absolute top-full right-0 mt-2 w-64 bg-[#14122D] border border-[#FFFFFF33] rounded-lg shadow-lg z-50 overflow-hidden"
                >
                    <div className="p-2">
                    <div className="relative mb-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#787785]" />
                      <input
                        type="text"
                        value={newMessageSearch}
                        onChange={(e) => setNewMessageSearch(e.target.value)}
                        placeholder="To: search"
                        className="w-full pl-10 pr-4 py-2 bg-[#090721] border border-[#FFFFFF33] rounded-lg text-white placeholder-[#787785] text-sm focus:outline-none focus:border-purple-500"
                        autoFocus
                      />
                    </div>
                    {/* Search Results */}
                    {isSearchingUsers && (
                      <div className="text-center py-2 text-gray-400 text-sm">Searching...</div>
                    )}
                    {!isSearchingUsers && searchedUsers.length > 0 && (
                      <div className="max-h-60 overflow-y-auto mb-2">
                        {searchedUsers.map((user) => (
                          <button
                            key={user._id}
                            onClick={() => handleUserSelect(user._id)}
                            className="w-full text-left px-4 py-2 text-white hover:bg-[#090721] rounded-lg transition-colors flex items-center gap-3"
                          >
                            <div className="relative">
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden p-1 flex-shrink-0"
                                style={
                                  user.profilePicture
                                    ? undefined
                                    : { background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)' }
                                }
                              >
                                {user.profilePicture ? (
                                  <img
                                    src={user.profilePicture}
                                    alt={user.name}
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  <img 
                                    src="/post/card-21.png" 
                                    alt="Avatar" 
                                    className="w-full h-full object-contain" 
                                  />
                                )}
                              </div>
                              {user.isOnline && (
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-gray-900"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold">{user.name}</p>
                              <p className="text-xs text-gray-400">@{user.username}</p>
                            </div>
                            <div className="text-xs text-purple-400">Start Chat</div>
                          </button>
                        ))}
                      </div>
                    )}
                    {!isSearchingUsers && newMessageSearch.trim() && searchedUsers.length === 0 && (
                      <div className="text-center py-2 text-gray-400 text-sm">No users found</div>
                    )}
                    <button 
                      onClick={() => {
                        setShowEditMenu(false)
                        // TODO: Handle group chat creation
                      }}
                      className="w-full text-left px-4 py-2 text-white hover:bg-[#090721] rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Users className="w-4 h-4" />
                      <span>Group Chat</span>
                    </button>
                  </div>
                </div>
              )}
              <button className="text-[#787785] hover:text-white transition-colors">
                <MoreVertical className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>
          {/* horizontal line */}
          <div className="mx-2 my-2 h-px bg-[#FFFFFF33]"></div>
        </div>
        <div className="shrink-0">
          <div className="relative ">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#787785]" />
            {/* vertical line in between icon and placeholder */}
            <div className="absolute left-10 top-1/2 -translate-y-1/2 w-px h-[22px] bg-[#FFFFFF33]"></div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              className="w-full h-[44px] bg-[#14122D] border border-[#FFFFFF1A] mb-2 rounded-lg text-white placeholder-[#787486] focus:outline-none focus:border-purple-500 pl-14 pr-3"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto  min-h-0">
          {/* Show search results if searching */}
          {searchQuery.trim() && searchedUsers.length > 0 ? (
            <div>
              <div className="px-2 py-2 text-xs text-gray-400 font-semibold">Search Results</div>
              {searchedUsers.map((user) => (
                <button
                  key={user._id}
                  onClick={() => handleUserSelect(user._id)}
                  className="w-full p-2 flex items-center gap-3 hover:bg-[#14122D] transition-colors border-b border-[#FFFFFF1A]"
                >
                  <div
                      className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden p-1.5 flex-shrink-0"
                      style={
                        user.profilePicture
                          ? undefined
                          : { background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)' }
                      }
                    >
                      {user.profilePicture ? (
                        <img 
                          src={user.profilePicture} 
                          alt={user.name || 'User'}  
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <img 
                          src="/post/card-21.png" 
                          alt="Avatar" 
                          className="w-full h-full object-contain" 
                        />
                      )}
                  </div>
                  <div className="flex flex-col w-full text-left">
                    <p className="text-white text-[18px] font-semibold">{user.name || 'Unknown'}</p>
                    <p className="text-[#FFFFFF73] text-[14px] font-normal">@{user.username}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : searchQuery.trim() && isSearchingUsers ? (
            <div className="text-center py-8 text-gray-400">Searching users...</div>
          ) : searchQuery.trim() && !isSearchingUsers && searchedUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No users found</div>
          ) : isLoading && chats.length === 0 ? (
            <div className="text-center py-8 text-gray-400">Loading chats...</div>
          ) : chats.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No chats yet</div>
          ) : (
            chats
              .filter((chat) => {
                // If searchQuery is empty, show all chats
                // If searchQuery has value, it will show search results above, so filter chats
                if (searchQuery === '') return true
                if (!chat.participants || !Array.isArray(chat.participants) || chat.participants.length === 0) return false
                // API returns only otherUser, so first participant is the other user
                const otherUser = chat.participants[0]
                const name = otherUser?.name || ''
                return name.toLowerCase().includes(searchQuery.toLowerCase())
              })
              .map((chat) => {
                if (!chat.participants || !Array.isArray(chat.participants) || chat.participants.length === 0) {
                  return null
                }
                // API returns only otherUser in participants array, so first participant is the other user
                const otherUser = chat.participants[0]
                const isSelected = selectedChat?._id === chat._id
                
                if (!otherUser) {
                  return null
                }
                return (
                  <button
                    key={chat._id}
                    onClick={() => handleSelectChat(chat)}
                    className={`w-full p-2 flex items-center gap-3 hover:bg-[#14122D] transition-colors border-b border-[#FFFFFF1A] ${isSelected ? 'bg-[#14122D]' : ''}`}
                  >
                    <div className="relative">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden p-1.5 flex-shrink-0"
                        style={
                          otherUser?.profilePicture
                            ? undefined
                            : { background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)' }
                        }
                      >
                        {otherUser?.profilePicture ? (
                          <img 
                            src={otherUser.profilePicture} 
                            alt={otherUser?.name || 'User'}  
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <img 
                            src="/post/card-21.png" 
                            alt="Avatar" 
                            className="w-full h-full object-contain" 
                          />
                        )}
                      </div>
                      {otherUser?.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex text-left justify-between w-full items-center gap-2">
                        <p className="text-white text-[18px] font-semibold truncate">{otherUser?.name || 'Unknown'}</p>
                        <p className="text-gray-400 text-[14px] flex-shrink-0 whitespace-nowrap">
                          {chat.lastMessage ? formatTimestamp(chat.lastMessage.timestamp) : formatTimestamp(chat.updatedAt)}
                        </p>
                      </div>
                      <div className="flex text-left items-center gap-2">
                        {/* Show typing indicator if someone is typing, otherwise show last message */}
                        {(() => {
                          const chatTypingUsers = typingUsers[chat._id] || []
                          // Filter out current user from typing users
                          const otherTypingUsers = chatTypingUsers.filter(id => {
                            const idStr = String(id || '')
                            const currentIdStr = String(currentUserId || '')
                            return idStr !== currentIdStr
                          })
                          
                          if (otherTypingUsers.length > 0) {
                            return (
                              <p className="text-[#CC66FF] text-[14px] font-normal italic flex items-center gap-1 truncate">
                                <span className="flex gap-0.5 flex-shrink-0">
                                  <span className="w-1 h-1 bg-[#CC66FF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                  <span className="w-1 h-1 bg-[#CC66FF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                  <span className="w-1 h-1 bg-[#CC66FF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </span>
                                <span className="truncate">{otherUser?.name || 'Someone'} is typing...</span>
                              </p>
                            )
                          }
                          
                          return (
                            <div className="flex items-center gap-2 w-full min-w-0">
                              <p className="text-[#FFFFFF73] text-[14px] font-normal truncate flex-1 min-w-0">
                                {chat.lastMessage?.message || 'No messages yet'}
                              </p>
                              {chat.lastMessage?.isRead && (
                                <div className="text-gray-400 text-[14px] flex-shrink-0">
                                  <Check className={`w-5 h-5 ${otherUser?.isOnline ? 'text-purple-500' : 'text-gray-400'}`} />
                                </div>
                              )}
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                  </button>
                )
              })
              .filter(Boolean) // Remove null entries
          )}
        </div>
      </div>

      {/* Chat Window */}
      <ChatWindow 
        selectedChat={selectedChat} 
        onChatDeleted={() => {
          // Refresh chats list when a chat is deleted
          getChats()
          setIsMobileChatOpen(false)
        }}
        onBack={handleBackToChatList}
        isMobileChatOpen={isMobileChatOpen}
      />
    </div>
  )
}

