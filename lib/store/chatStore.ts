'use client'

import { create } from 'zustand'
import { apiCaller } from '@/app/interceptors/apicall/apicall'
import authRoutes from '@/app/routes/route'

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

  // Utility
  clearSearchedUsers: () => void
  setSelectedChat: (chat: Chat | null) => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  messages: {},
  searchedUsers: [],
  selectedChat: null,
  isLoading: false,
  isSendingMessage: false,
  isSearchingUsers: false,

      getChats: async () => {
        set({ isLoading: true })
        try {
          const response = await apiCaller('GET', authRoutes.getChats)
          console.log('getChats response', response)
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
              
              console.log('Transformed chat:', transformedChat)
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
          console.log('createOrGetChat response', response)
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
      const response = await apiCaller('GET', `${authRoutes.searchUsers}?query=${encodeURIComponent(query)}`)
      console.log('searchUsers response', response)
      if (response.success) {
        set({ 
          searchedUsers: response.data.users || [],
          isSearchingUsers: false 
        })
      }
    } catch (error) {
      console.error('Error searching users:', error)
      set({ isSearchingUsers: false })
      throw error
    }
  },

  deleteChat: async (chatId: string) => {
    set({ isLoading: true })
    try {
      const response = await apiCaller('DELETE', `${authRoutes.deleteChat}/${chatId}`)
      console.log('deleteChat response', response)
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
      console.log('getMessages response', response)
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
    set({ isSendingMessage: true })
    try {
      const response = await apiCaller('POST', `${authRoutes.sendMessage}/${chatId}/messages`, {
        message,
        images: images || []
      })
      console.log('sendMessage response', response)
      if (response.success) {
        const apiMessage = response.data.message
        console.log('API message response:', apiMessage)
        
        // Transform API response to match Message interface
        // Backend might return 'text' instead of 'message', or 'sender' object instead of 'senderId'
        const newMessage: Message = {
          _id: apiMessage._id,
          chatId: apiMessage.chatId || apiMessage.chat || chatId,
          senderId: apiMessage.senderId || apiMessage.sender?._id || apiMessage.sender || '',
          message: apiMessage.message || apiMessage.text || message, // Use original message as fallback
          images: apiMessage.images || (apiMessage.imageUrl ? [apiMessage.imageUrl] : []),
          timestamp: apiMessage.timestamp || apiMessage.createdAt || new Date().toISOString(),
          isRead: apiMessage.isRead !== undefined ? apiMessage.isRead : false,
          createdAt: apiMessage.createdAt || apiMessage.timestamp || new Date().toISOString(),
        }
        
        console.log('Transformed message:', newMessage)
        
        // Add message to local state
        const messages = { ...get().messages }
        if (!messages[chatId]) {
          messages[chatId] = []
        }
        // Check if message already exists (avoid duplicates)
        const messageExists = messages[chatId].some(msg => msg._id === newMessage._id)
        if (!messageExists) {
          messages[chatId] = [...messages[chatId], newMessage]
        }
        
        set({ 
          messages,
          isSendingMessage: false 
        })
        
        // Update chat's lastMessage in chats list
        set(state => ({
          chats: state.chats.map(chat => 
            chat._id === chatId 
              ? { 
                  ...chat, 
                  lastMessage: {
                    _id: newMessage._id,
                    message: newMessage.message,
                    senderId: newMessage.senderId,
                    timestamp: newMessage.timestamp,
                    isRead: newMessage.isRead,
                  },
                  updatedAt: newMessage.timestamp,
                }
              : chat
          )
        }))
        
        return newMessage
      }
      return null
    } catch (error) {
      console.error('Error sending message:', error)
      set({ isSendingMessage: false })
      throw error
    }
  },

  editMessage: async (messageId: string, message: string) => {
    try {
      const response = await apiCaller('PUT', `${authRoutes.editMessage}/${messageId}`, { message })
      console.log('editMessage response', response)
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
      console.log('deleteMessage response', response)
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

  deleteChat: async (chatId: string) => {
    try {
      const response = await apiCaller('DELETE', `${authRoutes.deleteChat}/${chatId}`)
      console.log('deleteChat response', response)
      if (response.success) {
        // Remove chat from local state
        set(state => ({
          chats: state.chats.filter(chat => chat._id !== chatId),
          selectedChat: state.selectedChat?._id === chatId ? null : state.selectedChat,
          messages: Object.fromEntries(
            Object.entries(state.messages).filter(([id]) => id !== chatId)
          )
        }))
      }
    } catch (error) {
      console.error('Error deleting chat:', error)
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
    }
  },
}))

