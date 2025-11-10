'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, MoreVertical, Smile, Paperclip, Mic, Edit, Check, CheckCheck, Trash2, Send, Users, X } from 'lucide-react'
import { useChatStore, type Chat, type Message } from '@/lib/store/chatStore'
import { useAuthStore } from '@/lib/store/authStore'

export default function MessagesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuthStore()
  const {
    chats,
    messages,
    searchedUsers,
    selectedChat,
    isLoading,
    isSendingMessage,
    isSearchingUsers,
    getChats,
    getMessages,
    createOrGetChat,
    searchUsers,
    deleteChat,
    editMessage,
    deleteMessage,
    sendMessage,
    clearSearchedUsers,
    setSelectedChat,
  } = useChatStore()

  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })
  const [messageMenuOpen, setMessageMenuOpen] = useState<string | null>(null)
  const [editingMessage, setEditingMessage] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showEditMenu, setShowEditMenu] = useState(false)
  const [newMessageSearch, setNewMessageSearch] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const [showChatMenu, setShowChatMenu] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)
  const editMenuRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  // Get current user ID - API uses _id format, but user object might have id
  // We need to check both formats for comparison
  const currentUserId = user?.id || (user as any)?._id || ''

  // Load chats on mount
  useEffect(() => {
    getChats()
  }, [getChats])

  // Debug: Log chats and user info
  useEffect(() => {
    if (chats.length > 0) {
      
    }
  }, [chats, currentUserId, user])

  // Handle URL query parameters for chat selection
  useEffect(() => {
    const chatId = searchParams.get('chat')
    const userId = searchParams.get('userId')
    
    if (chatId && chats.length > 0) {
      const chat = chats.find(c => c._id === chatId)
      if (chat) {
        setSelectedChat(chat)
        // Ensure messages are loaded for this chat
        if (!messages[chatId] || messages[chatId]?.length === 0) {
          getMessages(chatId)
        }
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
        // Ensure messages are loaded for this chat
        if (!messages[chat._id] || messages[chat._id]?.length === 0) {
          getMessages(chat._id)
        }
      } else {
        // Create new chat with this user
        createOrGetChat(userId)
      }
    }
  }, [searchParams, chats, setSelectedChat, createOrGetChat, messages, getMessages])

  // Search users when typing in new message search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (newMessageSearch.trim()) {
        searchUsers(newMessageSearch)
      } else {
        clearSearchedUsers()
      }
    }, 300) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [newMessageSearch, searchUsers, clearSearchedUsers])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (selectedChat && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedChat, messages])

  const handleSelectChat = useCallback((chat: Chat) => {
    setSelectedChat(chat)
    // Ensure messages are loaded when chat is selected
    if (!messages[chat._id] || messages[chat._id]?.length === 0) {
      getMessages(chat._id)
    }
  }, [setSelectedChat, messages, getMessages])

  // Get current chat's messages
  const currentMessages = selectedChat ? (messages[selectedChat._id] || []) : []

  // Get other participant - API returns only otherUser, so first participant is the other user
  const otherParticipant = selectedChat?.participants?.[0]

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

  // Format message time (relative time like "5 min ago", "2 hours ago", etc.)
  const formatMessageTime = (timestamp: string) => {
    if (!timestamp) return ''
    try {
      const date = new Date(timestamp)
      if (isNaN(date.getTime())) return ''
      
      const now = new Date()
      const diff = now.getTime() - date.getTime()
      const seconds = Math.floor(diff / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)
      
      if (seconds < 60) {
        return 'Just now'
      } else if (minutes < 60) {
        return `${minutes} min ago`
      } else if (hours < 24) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`
      } else if (days === 1) {
        return 'Yesterday'
      } else if (days < 7) {
        return `${days} days ago`
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined })
      }
    } catch (error) {
      console.error('Error formatting message time:', timestamp, error)
      return ''
    }
  }

  // Handle message click to show popup
  const handleMessageClick = (e: React.MouseEvent, messageId: string) => {
    e.stopPropagation()
    const message = currentMessages.find((m) => m._id === messageId)
    
    // Only allow edit/delete for own messages
    if (message) {
      const msgSenderId = String(message.senderId || '')
      const userId = String(currentUserId || '')
      if (msgSenderId === userId) {
        setSelectedMessage(messageId)
        // Get the message element's position
        const messageElement = e.currentTarget as HTMLElement
        const rect = messageElement.getBoundingClientRect()
        const messagesContainer = messageElement.closest('.overflow-y-auto')
        if (messagesContainer) {
          const containerRect = messagesContainer.getBoundingClientRect()
          setPopupPosition({ 
            x: rect.right - containerRect.left, 
            y: rect.top - containerRect.top 
          })
        } else {
          setPopupPosition({ x: e.clientX, y: e.clientY })
        }
        setShowPopup(true)
      }
    }
  }

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false)
        setSelectedMessage(null)
      }
      // Close message menu when clicking outside
      if (messageMenuOpen) {
        const target = event.target as HTMLElement
        if (!target.closest('.relative')) {
          setMessageMenuOpen(null)
        }
      }
    }

    if (showPopup || messageMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPopup, messageMenuOpen])

  // Handle delete message
  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId)
      setShowPopup(false)
      setShowDeleteConfirm(false)
      setSelectedMessage(null)
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  // Show delete confirmation
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
    setShowPopup(false)
  }

  // Handle edit message
  const handleEditMessage = (messageId: string) => {
    const message = currentMessages.find((m) => m._id === messageId)
    if (message) {
      setEditingMessage(messageId)
      setEditText(message.message)
      setShowPopup(false)
    }
  }

  // Save edited message
  const handleSaveEdit = async (messageId: string) => {
    if (editText.trim()) {
      try {
        await editMessage(messageId, editText.trim())
        setEditingMessage(null)
        setEditText('')
      } catch (error) {
        console.error('Error editing message:', error)
      }
    }
  }

  // Handle send message
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat || isSendingMessage) return
    
    try {
      await sendMessage(selectedChat._id, messageInput.trim())
      setMessageInput('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  // Handle user selection from search
  const handleUserSelect = async (userId: string) => {
    try {
      await createOrGetChat(userId)
      setShowEditMenu(false)
      setNewMessageSearch('')
      clearSearchedUsers()
    } catch (error) {
      console.error('Error creating chat:', error)
    }
  }

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingMessage(null)
    setEditText('')
  }

  // Handle click outside edit menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editMenuRef.current && !editMenuRef.current.contains(event.target as Node)) {
        setShowEditMenu(false)
      }
      // Close chat menu when clicking outside
      const target = event.target as HTMLElement
      if (!target.closest('.relative')) {
        setShowChatMenu(false)
      }
    }

    if (showEditMenu || showChatMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEditMenu, showChatMenu])

  return (
    <div className="flex h-[calc(100vh-120px)] mt-10 font-exo2 w-full  overflow-hidden min-h-0">
      {/* Chat List */}
      <div className="w-80 bg-[#090721] border border-[#FFFFFF33] rounded-[21px] mx-5 font-exo2 px-2 flex flex-col h-full min-h-0">
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
                    {searchedUsers.length > 0 && (
                      <div className="max-h-60 overflow-y-auto mb-2">
                        {searchedUsers.map((user) => (
                          <button
                            key={user._id}
                            onClick={() => handleUserSelect(user._id)}
                            className="w-full text-left px-4 py-2 text-white hover:bg-[#090721] rounded-lg transition-colors flex items-center gap-3"
                          >
                            <img
                              src={user.profilePicture || '/assets/avatar.jpg'}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <p className="text-sm font-semibold">{user.name}</p>
                              <p className="text-xs text-gray-400">@{user.username}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    {isSearchingUsers && (
                      <div className="text-center py-2 text-gray-400 text-sm">Searching...</div>
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
        <div className="flex-1 overflow-y-auto min-h-0">
          {isLoading && chats.length === 0 ? (
            <div className="text-center py-8 text-gray-400">Loading chats...</div>
          ) : chats.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No chats yet</div>
          ) : (
            chats
              .filter((chat) => {
                if (searchQuery === '') return true
                if (!chat.participants || !Array.isArray(chat.participants) || chat.participants.length === 0) return false
                // API returns only otherUser, so first participant is the other user
                const otherUser = chat.participants[0]
                const name = otherUser?.name || ''
                return name.toLowerCase().includes(searchQuery.toLowerCase())
              })
              .map((chat) => {
                if (!chat.participants || !Array.isArray(chat.participants) || chat.participants.length === 0) {
                  console.log('Chat with no participants:', chat)
                  return null
                }
                // API returns only otherUser in participants array, so first participant is the other user
                const otherUser = chat.participants[0]
                const isSelected = selectedChat?._id === chat._id
                
                if (!otherUser) {
                  console.log('No other user found for chat:', chat)
                  return null
                }
                return (
                  <button
                    key={chat._id}
                    onClick={() => handleSelectChat(chat)}
                    className={`w-full p-2 flex items-center gap-3 hover:bg-[#14122D] transition-colors border-b border-[#FFFFFF1A] ${isSelected ? 'bg-[#14122D]' : ''}`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full items-center justify-center">
                        <img 
                          src={otherUser?.profilePicture || '/assets/avatar.jpg'} 
                          alt={otherUser?.name || 'User'}  
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      {otherUser?.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                      )}
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="flex text-left justify-between w-full items-center">
                        <p className="text-white text-[18px] font-semibold">{otherUser?.name || 'Unknown'}</p>
                        <p className="text-gray-400 text-[14px]">
                          {chat.lastMessage ? formatTimestamp(chat.lastMessage.timestamp) : formatTimestamp(chat.updatedAt)}
                        </p>
                      </div>
                      <div className="flex text-left justify-between w-full items-center">
                        <p className="text-[#FFFFFF73] text-[14px] font-normal truncate">
                          {chat.lastMessage?.message || 'No messages yet'}
                        </p>
                        {chat.lastMessage?.isRead && (
                          <p className="text-gray-400 text-[14px]">
                            <Check className={`w-5 h-5 ${otherUser?.isOnline ? 'text-purple-500' : 'text-gray-400'}`} />
                          </p>
                        )}
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
      <div className="flex-1 min-w-0 flex flex-col bg-[#090721] border border-[#FFFFFF33] rounded-[21px] mr-5 font-exo2 min-h-0">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 rounded-t-[21px] border-b border-[#14122D] bg-[#14122D] flex items-center justify-between font-exo2">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center">
                    <img 
                      src={otherParticipant?.profilePicture || '/assets/avatar.jpg'} 
                      alt={otherParticipant?.name || 'User'}  
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  {otherParticipant?.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                  )}
                </div>
                <div>
                  <p className="text-white text-[16px] font-semibold">{otherParticipant?.name || 'Unknown'}</p>
                  <p className="text-[#CC66FF] text-[14px]">
                    {otherParticipant?.isOnline ? 'Online' : 'Last seen 5 min ago'}
                  </p>
                </div>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowChatMenu(!showChatMenu)}
                  className="text-gray-400 hover:text-white"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                {/* Chat Menu Dropdown */}
                {showChatMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-[#14122D] border border-[#FFFFFF33] rounded-lg shadow-2xl p-2 min-w-[160px] z-50 backdrop-blur-sm">
                    <button
                      onClick={async () => {
                        if (selectedChat && window.confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
                          try {
                            await deleteChat(selectedChat._id)
                            setSelectedChat(null)
                            setShowChatMenu(false)
                            // Refresh chats list
                            getChats()
                          } catch (error) {
                            console.error('Error deleting chat:', error)
                            alert('Failed to delete chat. Please try again.')
                          }
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors text-sm w-full text-left font-exo2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Chat</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-4 relative">
              {isLoading && currentMessages.length === 0 ? (
                <div className="text-center py-8 text-gray-400">Loading messages...</div>
              ) : currentMessages.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No messages yet. Start the conversation!</div>
              ) : (
                currentMessages.map((msg, idx) => {
                  // Compare senderId with currentUserId (handle both string and object formats)
                  const msgSenderId = String(msg.senderId || '')
                  const userId = String(currentUserId || '')
                  const isMine = msgSenderId === userId
                  const showTimestamp = idx === 0 || formatTimestamp(currentMessages[idx - 1].timestamp) !== formatTimestamp(msg.timestamp)
                  const isEditing = editingMessage === msg._id

                  return (
                    <div key={msg._id}>
                      {showTimestamp && (
                        <p className="text-center text-gray-500 text-xs mb-2">{formatTimestamp(msg.timestamp)}</p>
                      )}
                      <div
                        className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        {isEditing ? (
                          // Edit Mode
                          <div className="max-w-md w-full px-4 py-2.5 rounded-2xl bg-[#FFFFFF29] text-white rounded-bl-sm shadow-md">
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full bg-transparent border border-purple-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleSaveEdit(msg._id)
                                } else if (e.key === 'Escape') {
                                  handleCancelEdit()
                                }
                              }}
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => handleSaveEdit(msg._id)}
                                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Normal Message
                          <div
                            className={`max-w-md group relative ${
                              isMine ? 'flex flex-col items-end' : 'flex flex-col items-start'
                            }`}
                          >
                            <div
                              onClick={(e) => isMine && handleMessageClick(e, msg._id)}
                              className={`px-4 py-2.5 rounded-2xl cursor-pointer transition-all ${
                                isMine
                                  ? 'bg-[#4E00E5] text-white text-[14px] rounded-br-sm hover:bg-[#5A00FF]'
                                  : 'bg-[#FFFFFF29] text-white text-[16px] rounded-bl-sm hover:bg-[#FFFFFF35]'
                              } shadow-md ${isMine ? 'hover:shadow-lg' : ''}`}
                            >
                              <p className="text-sm leading-relaxed">{msg.message}</p>
                              {msg.images && msg.images.length > 0 && (
                                <div className="grid grid-cols-2 gap-2 mt-3">
                                  {msg.images.map((img, i) => (
                                    <div
                                      key={i}
                                      className="w-32 h-32 bg-gradient-to-br from-orange-300 to-orange-500 rounded-lg overflow-hidden shadow-md"
                                    >
                                      <img src={img} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div className="flex items-center justify-end gap-1.5 mt-1">
                                {msg.editedAt && (
                                  <p className="text-xs text-gray-300 italic">(edited)</p>
                                )}
                                {/* Message time */}
                                <p className="text-xs text-gray-400">{formatMessageTime(msg.timestamp)}</p>
                                {/* Seen status - only for user's own messages */}
                                {isMine && (
                                  <div className="flex items-center gap-0.5">
                                    {msg.isRead ? (
                                      // Read message - show double tick if online, single if offline
                                      otherParticipant?.isOnline ? (
                                        <CheckCheck className="w-4 h-4 text-blue-300" />
                                      ) : (
                                        <Check className="w-4 h-4 text-blue-300" />
                                      )
                                    ) : (
                                      // Unread message - single gray tick
                                      <Check className="w-4 h-4 text-gray-400" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            {/* Edit/Delete Menu Button - Only for user's own messages */}
                            {isMine && (
                              <div className="relative mt-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setMessageMenuOpen(messageMenuOpen === msg._id ? null : msg._id)
                                  }}
                                  className="p-1.5 rounded-full hover:bg-[#FFFFFF1A] transition-colors opacity-0 group-hover:opacity-100"
                                  title="Edit or Delete message"
                                >
                                  <MoreVertical className="w-4 h-4 text-gray-400 hover:text-white" />
                                </button>
                                {/* Dropdown Menu */}
                                {messageMenuOpen === msg._id && (
                                  <div className="absolute right-0 top-full mt-1 bg-[#14122D] border border-[#FFFFFF33] rounded-lg shadow-2xl p-2 min-w-[160px] z-50 backdrop-blur-sm">
                                    <div className="flex flex-col gap-1">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleEditMessage(msg._id)
                                          setMessageMenuOpen(null)
                                        }}
                                        className="flex items-center gap-2 px-4 py-2.5 text-white hover:bg-[#FFFFFF1A] rounded-lg transition-colors text-sm w-full text-left font-exo2"
                                      >
                                        <Edit className="w-4 h-4" />
                                        <span>Edit Message</span>
                                      </button>
                                      <div className="h-px bg-[#FFFFFF1A] my-1"></div>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setSelectedMessage(msg._id)
                                          setMessageMenuOpen(null)
                                          setShowDeleteConfirm(true)
                                        }}
                                        className="flex items-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors text-sm w-full text-left font-exo2"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                        <span>Delete Message</span>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />

              {/* Popup for Edit/Delete */}
              {showPopup && selectedMessage && (
                <div
                  ref={popupRef}
                  className="absolute z-50 bg-[#14122D] border border-[#FFFFFF33] rounded-lg shadow-2xl p-2 min-w-[180px] backdrop-blur-sm"
                  style={{
                    left: `${Math.min(popupPosition.x - 90, window.innerWidth - 220)}px`,
                    top: `${Math.max(popupPosition.y + 10, 10)}px`,
                  }}
                >
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleEditMessage(selectedMessage)}
                      className="flex items-center gap-2 px-4 py-2.5 text-white hover:bg-[#FFFFFF1A] rounded-lg transition-colors text-sm w-full text-left font-exo2"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit Message</span>
                    </button>
                    <div className="h-px bg-[#FFFFFF1A] my-1"></div>
                    <button
                      onClick={handleDeleteClick}
                      className="flex items-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors text-sm w-full text-left font-exo2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Message</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Delete Confirmation Dialog */}
              {showDeleteConfirm && selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                  <div className="bg-[#14122D] border border-[#FFFFFF33] rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 font-exo2">
                    <h3 className="text-white text-lg font-semibold mb-2">Delete Message</h3>
                    <p className="text-gray-400 text-sm mb-6">
                      Are you sure you want to delete this message? This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false)
                          setSelectedMessage(null)
                        }}
                        className="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors font-exo2"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(selectedMessage)}
                        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors font-exo2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-[#FFFFFF1A] bg-[#14122D] rounded-b-[21px]">
              <div className="flex items-center gap-2 h-[24px]">
                <button className="text-white hover:text-gray-300 transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
                <button className="text-white hover:text-gray-300 transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  placeholder="Type your message here ..."
                  className="flex-1 px-4 py-2 bg-transparent text-white placeholder-[#A3AED0B2] focus:outline-none"
                  disabled={isSendingMessage}
                />
                
                <button className="text-white hover:text-gray-300 transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || isSendingMessage}
                  className="text-white hover:text-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}

