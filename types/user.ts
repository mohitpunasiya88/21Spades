export interface ChatUser {
  id: string
  name: string
  avatar: string
  status: string
  lastSeen?: string
  isOnline: boolean
}

export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  message: string
  timestamp: string
  images?: string[]
  isRead: boolean
}

