'use client'

import { create } from 'zustand'
import { apiCaller } from '@/app/interceptors/apicall/apicall'
import authRoutes from '@/lib/routes'
import type { Socket } from 'socket.io-client'

export interface Chat {
  _id: string
  participants: Array<{
    _id: string
    name: string
    username: string
    profilePicture?: string
    isOnline?: boolean
  }>
  lastMessage?: {
    _id: string
    message: string
    senderId: string
    timestamp: string
    isRead: boolean
  }
  unreadCount?: number
  updatedAt: string
  createdAt: string
}

export interface Message {
  _id: string
  chatId: string
  senderId: string
  message: string
  images?: string[]
  timestamp: string
  isRead: boolean
  editedAt?: string
  createdAt: string
}

export interface User {
  _id: string
  name: string
  username: string
  profilePicture?: string
  isOnline?: boolean
}

interface ChatState {
  chats: Chat[]
  messages: Record<string, Message[]> // chatId -> messages
  searchedUsers: User[]
  selectedChat: Chat | null
  isLoading: boolean
  isSendingMessage: boolean
  isSearchingUsers: boolean
  typingUsers: Record<string, string[]> // chatId -> userIds who are typing
  socket: Socket | null

  // Chat operations
  getChats: () => Promise<void>
  createOrGetChat: (userId: string) => Promise<Chat | null>
  searchUsers: (query: string) => Promise<void>
  deleteChat: (chatId: string) => Promise<void>

  // Message operations
  getMessages: (chatId: string) => Promise<void>
  sendMessage: (chatId: string, message: string, images?: string[]) => Promise<Message | null>
  editMessage: (messageId: string, message: string) => Promise<void>
  deleteMessage: (messageId: string) => Promise<void>

  // WebSocket operations
  setSocket: (socket: Socket | null) => void
  initializeSocketListeners: () => void
  sendTypingIndicator: (chatId: string, isTyping: boolean) => void
  markAsRead: (chatId: string) => void

  // Utility
  clearSearchedUsers: () => void
  setSelectedChat: (chat: Chat | null) => void
  addMessage: (message: Message) => void
  updateMessage: (message: Message) => void
  removeMessage: (messageId: string, chatId: string) => void
  updateChat: (chat: Chat) => void
  removeChat: (chatId: string) => void
}


export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  messages: {},
  searchedUsers: [],
  selectedChat: null,
  isLoading: false,
  isSendingMessage: false,
  isSearchingUsers: false,
  typingUsers: {},
  socket: null,

      getChats: async () => {
        set({ isLoading: true })
        try {
          const response = await apiCaller('GET', authRoutes.getChats)
          if (response.success) {
            // Transform API response to match Chat interface
            const chats = (response.data.chats || []).map((chat: any) => {
              // API returns otherUser, but we need participants array
              // The API only returns the other user, not the current user
              const participants = chat.otherUser 
                ? [chat.otherUser] 
                : (chat.participants || [])
              
              // Transform lastMessage if it exists
              const lastMessage = chat.lastMessage ? {
                _id: chat.lastMessage._id || '',
                message: chat.lastMessage.message || chat.lastMessage.text || '',
                senderId: chat.lastMessage.senderId || chat.lastMessage.sender?._id || '',
                timestamp: chat.lastMessage.timestamp || chat.lastMessage.createdAt || chat.lastMessageAt || '',
                isRead: chat.lastMessage.isRead !== undefined ? chat.lastMessage.isRead : true,
              } : undefined

              const transformedChat = {
                _id: chat._id,
                participants,
                lastMessage,
                unreadCount: chat.unreadCount || 0,
                updatedAt: chat.updatedAt || chat.lastMessageAt || chat.createdAt,
                createdAt: chat.createdAt,
              } as Chat
              
              return transformedChat
            })
            set({ 
              chats,
              isLoading: false 
            })
          }
        } catch (error) {
          console.error('Error fetching chats:', error)
          set({ isLoading: false })
          throw error
        }
      },

      createOrGetChat: async (userId: string) => {
        set({ isLoading: true })
        try {
          const response = await apiCaller('POST', authRoutes.createChat, { userId })
          if (response.success) {
            // Transform API response to match Chat interface
            const apiChat = response.data.chat
            const participants = apiChat.otherUser 
              ? [apiChat.otherUser] 
              : (apiChat.participants || [])
            
            const lastMessage = apiChat.lastMessage ? {
              _id: apiChat.lastMessage._id || '',
              message: apiChat.lastMessage.message || apiChat.lastMessage.text || '',
              senderId: apiChat.lastMessage.senderId || apiChat.lastMessage.sender?._id || '',
              timestamp: apiChat.lastMessage.timestamp || apiChat.lastMessage.createdAt || apiChat.lastMessageAt || '',
              isRead: apiChat.lastMessage.isRead !== undefined ? apiChat.lastMessage.isRead : true,
            } : undefined

            const chat = {
              _id: apiChat._id,
              participants,
              lastMessage,
              unreadCount: apiChat.unreadCount || 0,
              updatedAt: apiChat.updatedAt || apiChat.lastMessageAt || apiChat.createdAt,
              createdAt: apiChat.createdAt,
            } as Chat
            // Update chats list
            const chats = get().chats
            const existingChatIndex = chats.findIndex(c => c._id === chat._id)
            if (existingChatIndex >= 0) {
              chats[existingChatIndex] = chat
            } else {
              chats.unshift(chat) // Add to beginning
            }
            set({ 
              chats,
              selectedChat: chat,
              isLoading: false 
            })
            return chat
          }
          return null
        } catch (error) {
          console.error('Error creating/getting chat:', error)
          set({ isLoading: false })
          throw error
        }
      },

  searchUsers: async (query: string) => {
    if (!query.trim()) {
      set({ searchedUsers: [] })
      return
    }
    
    set({ isSearchingUsers: true })
    
    try {
      // Try 'q' parameter first
      const url = `${authRoutes.searchUsers}?q=${encodeURIComponent(query.trim())}`
      
      let response
      try {
        response = await apiCaller('GET', url)
      } catch (error: any) {
        console.error('🔍 [API] Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url
        })
        
        // If 'q' fails, try 'query' parameter
        const url2 = `${authRoutes.searchUsers}?query=${encodeURIComponent(query.trim())}`
        response = await apiCaller('GET', url2)
      }
      
      // Handle different response formats
      let users = []
      if (response) {
        if (response.success) {
          users = response.data?.users || response.data?.data?.users || response.data || []
        } else if (Array.isArray(response.data)) {
          users = response.data
        } else if (Array.isArray(response)) {
          users = response
        } else if (response.users) {
          users = response.users
        } else {
        }
      } else {
      }
      
      set({ 
        searchedUsers: Array.isArray(users) ? users : [],
        isSearchingUsers: false 
      })
    } catch (error: any) {
      console.error('❌ [API] Error searching users:', error)
      console.error('❌ [API] Error response:', error.response?.data)
      console.error('❌ [API] Error status:', error.response?.status)
      console.error('❌ [API] Error message:', error.message)
      console.error('❌ [API] Full error object:', error)
      set({ isSearchingUsers: false, searchedUsers: [] })
    }
  },

  deleteChat: async (chatId: string) => {
    set({ isLoading: true })
    try {
      const response = await apiCaller('DELETE', `${authRoutes.deleteChat}/${chatId}`)
      if (response.success) {
        // Remove chat from list
        const chats = get().chats.filter(chat => chat._id !== chatId)
        // Remove messages for this chat
        const messages = { ...get().messages }
        delete messages[chatId]
        set({ 
          chats,
          messages,
          selectedChat: get().selectedChat?._id === chatId ? null : get().selectedChat,
          isLoading: false 
        })
      }
    } catch (error) {
      console.error('Error deleting chat:', error)
      set({ isLoading: false })
      throw error
    }
  },

  getMessages: async (chatId: string) => {
    set({ isLoading: true })
    try {
      const response = await apiCaller('GET', `${authRoutes.getMessages}/${chatId}/messages`)
      if (response.success) {
        // Transform API response to match Message interface
        const apiMessages = response.data.messages || []
        const transformedMessages: Message[] = apiMessages.map((msg: any) => ({
          _id: msg._id,
          chatId: msg.chat || msg.chatId || chatId,
          senderId: msg.sender?._id || msg.senderId || msg.sender,
          message: msg.text || msg.message || '',
          images: msg.imageUrl ? [msg.imageUrl] : (msg.images || []),
          timestamp: msg.createdAt || msg.timestamp,
          isRead: msg.isRead !== undefined ? msg.isRead : false,
          editedAt: msg.editedAt || msg.isEdited ? msg.editedAt : undefined,
          createdAt: msg.createdAt || msg.timestamp,
        }))
        
        const messages = { ...get().messages }
        messages[chatId] = transformedMessages
        set({ 
          messages,
          isLoading: false 
        })
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      set({ isLoading: false })
      throw error
    }
  },

  sendMessage: async (chatId: string, message: string, images?: string[]) => {
    const socket = get().socket
    if (!socket || !socket.connected) {
      console.error('Socket not connected, cannot send message')
      set({ isSendingMessage: false })
      throw new Error('Socket not connected')
    }

    set({ isSendingMessage: true })
    
    try {
      // Send message via WebSocket (no API call needed)
      const messageData: any = {
        chatId: chatId,
        text: message
      }
      
      // Add images if provided
      if (images && images.length > 0) {
        messageData.imageUrl = images[0] // Backend might expect single imageUrl
        messageData.images = images
      }
      
      socket.emit('send_message', messageData)
      
      // Reset sending state immediately (message will be added via socket event)
      set({ isSendingMessage: false })
      
      // Return a temporary message object (will be replaced by socket event)
      // This allows optimistic UI updates
      const tempMessage: Message = {
        _id: `temp-${Date.now()}`,
        chatId: chatId,
        senderId: '', // Will be set by socket response
        message: message,
        images: images || [],
        timestamp: new Date().toISOString(),
        isRead: false,
        createdAt: new Date().toISOString(),
      }
      
      return tempMessage
    } catch (error) {
      console.error('Error sending message:', error)
      set({ isSendingMessage: false })
      throw error
    }
  },

  editMessage: async (messageId: string, message: string) => {
    try {
      // API expects 'text' field, not 'message'
      const response = await apiCaller('PUT', `${authRoutes.editMessage}/${messageId}`, { text: message })
      if (response.success) {
        const updatedMessage = response.data.message
        // Update message in local state
        const messages = { ...get().messages }
        Object.keys(messages).forEach(chatId => {
          messages[chatId] = messages[chatId].map(msg =>
            msg._id === messageId ? { 
              ...msg, 
              message: updatedMessage.message || updatedMessage.text || message,
              editedAt: updatedMessage.editedAt || new Date().toISOString(),
              ...updatedMessage 
            } : msg
          )
        })
        set({ messages })
        
        // Update lastMessage in chats if this is the last message
        set(state => ({
          chats: state.chats.map(chat => {
            if (chat.lastMessage?._id === messageId) {
              return {
                ...chat,
                lastMessage: {
                  ...chat.lastMessage,
                  message: updatedMessage.message || updatedMessage.text || message,
                }
              }
            }
            return chat
          })
        }))
      }
    } catch (error) {
      console.error('Error editing message:', error)
      throw error
    }
  },

  deleteMessage: async (messageId: string) => {
    try {
      const response = await apiCaller('DELETE', `${authRoutes.deleteMessage}/${messageId}`)
      if (response.success) {
        // Remove message from local state
        const messages = { ...get().messages }
        Object.keys(messages).forEach(chatId => {
          messages[chatId] = messages[chatId].filter(msg => msg._id !== messageId)
        })
        set({ messages })
        // Refresh chats to update lastMessage
        await get().getChats()
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      throw error
    }
  },


  clearSearchedUsers: () => {
    set({ searchedUsers: [] })
  },

  setSelectedChat: (chat: Chat | null) => {
    set({ selectedChat: chat })
    if (chat) {
      // Load messages for selected chat
      get().getMessages(chat._id)
      // Mark messages as read
      get().markAsRead(chat._id)
    }
  },

  // WebSocket methods
  setSocket: (socket: Socket | null) => {
    set({ socket })
    if (socket) {
      get().initializeSocketListeners()
    }
  },

  initializeSocketListeners: () => {
    const socket = get().socket
    if (!socket) return

    // Remove existing listeners to avoid duplicates
    socket.removeAllListeners('new_message')
    socket.removeAllListeners('message_sent')
    socket.removeAllListeners('message_edited')
    socket.removeAllListeners('message_deleted')
    socket.removeAllListeners('chat_updated')
    socket.removeAllListeners('chat_deleted')
    socket.removeAllListeners('user_typing')
    socket.removeAllListeners('error')

    // Listen for new messages (when someone else sends you a message)
    socket.on('new_message', (message: any) => {
      const transformedMessage: Message = {
        _id: message._id,
        chatId: message.chat || message.chatId || message.chatId,
        senderId: message.sender?._id || message.senderId || message.sender || message.senderId,
        message: message.text || message.message || '',
        images: message.imageUrl ? [message.imageUrl] : (message.images || []),
        timestamp: message.createdAt || message.timestamp || new Date().toISOString(),
        isRead: message.isRead !== undefined ? message.isRead : false,
        editedAt: message.editedAt,
        createdAt: message.createdAt || message.timestamp || new Date().toISOString(),
      }
      get().addMessage(transformedMessage)
      
      // Update chat list to show latest message
      get().getChats()
    })

    // Listen for message_sent (confirmation when you send a message)
    socket.on('message_sent', (message: any) => {
      const transformedMessage: Message = {
        _id: message._id,
        chatId: message.chat || message.chatId || message.chatId,
        senderId: message.sender?._id || message.senderId || message.sender || message.senderId,
        message: message.text || message.message || '',
        images: message.imageUrl ? [message.imageUrl] : (message.images || []),
        timestamp: message.createdAt || message.timestamp || new Date().toISOString(),
        isRead: message.isRead !== undefined ? message.isRead : false,
        editedAt: message.editedAt,
        createdAt: message.createdAt || message.timestamp || new Date().toISOString(),
      }
      get().addMessage(transformedMessage)
    })

    // Listen for message edits
    socket.on('message_edited', (message: any) => {
      const transformedMessage: Message = {
        _id: message._id,
        chatId: message.chat || message.chatId,
        senderId: message.sender?._id || message.senderId || message.sender,
        message: message.text || message.message || '',
        images: message.imageUrl ? [message.imageUrl] : (message.images || []),
        timestamp: message.createdAt || message.timestamp,
        isRead: message.isRead !== undefined ? message.isRead : false,
        editedAt: message.editedAt || new Date().toISOString(),
        createdAt: message.createdAt || message.timestamp,
      }
      get().updateMessage(transformedMessage)
    })

    // Listen for message deletions
    socket.on('message_deleted', (data: any) => {
      const messageId = data.messageId || data._id
      const chatId = data.chat || data.chatId
      if (messageId && chatId) {
        get().removeMessage(messageId, chatId)
      }
    })

    // Listen for chat updates
    socket.on('chat_updated', (chat: any) => {
      const participants = chat.otherUser 
        ? [chat.otherUser] 
        : (chat.participants || [])
      
      const lastMessage = chat.lastMessage ? {
        _id: chat.lastMessage._id || '',
        message: chat.lastMessage.message || chat.lastMessage.text || '',
        senderId: chat.lastMessage.senderId || chat.lastMessage.sender?._id || '',
        timestamp: chat.lastMessage.timestamp || chat.lastMessage.createdAt || chat.lastMessageAt || '',
        isRead: chat.lastMessage.isRead !== undefined ? chat.lastMessage.isRead : true,
      } : undefined

      const transformedChat: Chat = {
        _id: chat._id,
        participants,
        lastMessage,
        unreadCount: chat.unreadCount || 0,
        updatedAt: chat.updatedAt || chat.lastMessageAt || chat.createdAt,
        createdAt: chat.createdAt,
      }
      get().updateChat(transformedChat)
    })

    // Listen for chat deletions
    socket.on('chat_deleted', (data: any) => {
      const chatId = data.chatId || data._id
      if (chatId) {
        get().removeChat(chatId)
      }
    })

    // Listen for typing indicators (real-time typing status)
    socket.on('user_typing', (data: { chatId: string; userId: string; isTyping: boolean }) => {
      const { chatId, userId, isTyping } = data
      const typingUsers = { ...get().typingUsers }
      
      if (!typingUsers[chatId]) {
        typingUsers[chatId] = []
      }
      
      if (isTyping) {
        if (!typingUsers[chatId].includes(userId)) {
          typingUsers[chatId] = [...typingUsers[chatId], userId]
        }
      } else {
        typingUsers[chatId] = typingUsers[chatId].filter(id => id !== userId)
      }
      
      set({ typingUsers })
    })

    // Listen for errors
    socket.on('error', (error: any) => {
      console.error('Socket error:', error)
    })
  },

  sendTypingIndicator: (chatId: string, isTyping: boolean) => {
    const socket = get().socket
    if (socket && socket.connected) {
      socket.emit('typing', { chatId, isTyping })
    } else {
      console.warn('⌨️ [SOCKET] Socket not connected, cannot send typing indicator')
    }
  },

  markAsRead: (chatId: string) => {
    const socket = get().socket
    if (socket && socket.connected) {
      socket.emit('mark_read', { chatId })
    }
  },

  // Helper methods for WebSocket updates - Add message in real-time
  addMessage: (message: Message) => {
    const messages = { ...get().messages }
    if (!messages[message.chatId]) {
      messages[message.chatId] = []
    }
    // Check if message already exists (avoid duplicates)
    const messageExists = messages[message.chatId].some(msg => msg._id === message._id)
    if (!messageExists) {
      // Sort messages by timestamp to maintain order
      const updatedMessages = [...messages[message.chatId], message].sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime()
        const timeB = new Date(b.timestamp).getTime()
        return timeA - timeB
      })
      messages[message.chatId] = updatedMessages
      set({ messages })
      
      // Update chat's lastMessage in real-time
      set(state => ({
        chats: state.chats.map(chat => 
          chat._id === message.chatId 
            ? { 
                ...chat, 
                lastMessage: {
                  _id: message._id,
                  message: message.message,
                  senderId: message.senderId,
                  timestamp: message.timestamp,
                  isRead: message.isRead,
                },
                updatedAt: message.timestamp,
              }
            : chat
        )
      }))
    } else {
    }
  },

  updateMessage: (message: Message) => {
    const messages = { ...get().messages }
    Object.keys(messages).forEach(chatId => {
      messages[chatId] = messages[chatId].map(msg =>
        msg._id === message._id ? message : msg
      )
    })
    set({ messages })
    
    // Update lastMessage in chats if this is the last message
    set(state => ({
      chats: state.chats.map(chat => {
        if (chat.lastMessage?._id === message._id) {
          return {
            ...chat,
            lastMessage: {
              ...chat.lastMessage,
              message: message.message,
            }
          }
        }
        return chat
      })
    }))
  },

  removeMessage: (messageId: string, chatId: string) => {
    const messages = { ...get().messages }
    if (messages[chatId]) {
      messages[chatId] = messages[chatId].filter(msg => msg._id !== messageId)
      set({ messages })
    }
    // Refresh chats to update lastMessage
    get().getChats()
  },

  updateChat: (chat: Chat) => {
    const chats = get().chats
    const existingChatIndex = chats.findIndex(c => c._id === chat._id)
    if (existingChatIndex >= 0) {
      chats[existingChatIndex] = chat
    } else {
      chats.unshift(chat)
    }
    set({ chats })
  },

  removeChat: (chatId: string) => {
    set(state => ({
      chats: state.chats.filter(chat => chat._id !== chatId),
      selectedChat: state.selectedChat?._id === chatId ? null : state.selectedChat,
      messages: Object.fromEntries(
        Object.entries(state.messages).filter(([id]) => id !== chatId)
      )
    }))
  },
}))






