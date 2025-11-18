'use client'

import { useEffect, useState, useRef } from 'react'
import { MoreVertical, Smile, Paperclip, Mic, Edit, Check, CheckCheck, Trash2, Send, X, ArrowLeft } from 'lucide-react'
import { useChatStore, type Chat, type Message } from '@/lib/store/chatStore'
import { useAuthStore } from '@/lib/store/authStore'
import { useSocket } from '@/lib/hooks/useSocket'
import EmojiPicker from 'emoji-picker-react'

interface ChatWindowProps {
    selectedChat: Chat | null
    onChatDeleted?: () => void
    onBack?: () => void
    isMobileChatOpen?: boolean
}

export default function ChatWindow({ selectedChat, onChatDeleted, onBack, isMobileChatOpen }: ChatWindowProps) {
    const { user } = useAuthStore()
    const {
        messages,
        isLoading,
        isSendingMessage,
        typingUsers,
        deleteChat,
        editMessage,
        deleteMessage,
        sendMessage,
        setSelectedChat,
        sendTypingIndicator,
        getChats,
    } = useChatStore()

    const { socket } = useSocket()

    const [selectedMessage, setSelectedMessage] = useState<string | null>(null)
    const [showPopup, setShowPopup] = useState(false)
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })
    const [messageMenuOpen, setMessageMenuOpen] = useState<string | null>(null)
    const [editingMessage, setEditingMessage] = useState<string | null>(null)
    const [editText, setEditText] = useState('')
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [showDeleteChatConfirm, setShowDeleteChatConfirm] = useState(false)
    const [messageInput, setMessageInput] = useState('')
    const [showChatMenu, setShowChatMenu] = useState(false)
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
    const [selectedImages, setSelectedImages] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])

    const popupRef = useRef<HTMLDivElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const emojiPickerRef = useRef<HTMLDivElement>(null)
    const messageInputRef = useRef<HTMLInputElement>(null)
    const chatMenuRef = useRef<HTMLDivElement>(null)

    const currentUserId = user?.id || (user as any)?._id || ''
    // Load messages handled by store when chat is selected

    // Get current chat's messages
    const currentMessages = selectedChat ? (messages[selectedChat._id] || []) : []

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (selectedChat && messagesEndRef.current && currentMessages.length > 0) {
            const timeoutId = setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
            }, 100)
            return () => clearTimeout(timeoutId)
        }
    }, [selectedChat, currentMessages.length, messages])

    // Handle typing indicator
    useEffect(() => {
        if (!selectedChat || !messageInput.trim()) {
            if (selectedChat && typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current)
                typingTimeoutRef.current = null
                sendTypingIndicator(selectedChat._id, false)
            }
            return
        }

        if (selectedChat && socket && socket.connected) {
            sendTypingIndicator(selectedChat._id, true)

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current)
            }

            typingTimeoutRef.current = setTimeout(() => {
                sendTypingIndicator(selectedChat._id, false)
                typingTimeoutRef.current = null
            }, 1000)
        }

        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current)
            }
        }
    }, [messageInput, selectedChat, sendTypingIndicator, socket])

    // Get other participant
    const otherParticipant = selectedChat?.participants?.[0]

    // Format last seen status
    // Calculate from lastMessage.timestamp or updatedAt (frontend calculation)
    const formatLastSeen = (participant: typeof otherParticipant): string => {
        if (!participant) return 'Unknown'
        
        // If user is online, show "Online"
        if (participant.isOnline) {
            return 'Online'
        }
        
        // Calculate from chat's lastMessage or updatedAt
        if (!selectedChat) {
            return 'Last seen recently'
        }
        
        // Prefer lastMessage.timestamp (when user last sent/received a message)
        // Fallback to updatedAt (when chat was last updated)
        const lastSeenTimestamp = selectedChat.lastMessage?.timestamp || selectedChat.updatedAt
        
        if (!lastSeenTimestamp) {
            return 'Last seen recently'
        }
        
        try {
            const lastSeenDate = new Date(lastSeenTimestamp)
            if (isNaN(lastSeenDate.getTime())) {
                return 'Last seen recently'
            }
            
            const now = new Date()
            const diff = now.getTime() - lastSeenDate.getTime()
            
            // Handle negative diff (future dates)
            if (diff < 0) {
                return 'Last seen recently'
            }
            
            const seconds = Math.floor(diff / 1000)
            const minutes = Math.floor(seconds / 60)
            const hours = Math.floor(minutes / 60)
            const days = Math.floor(hours / 24)
            
            if (seconds < 60) {
                return 'Last seen just now'
            } else if (minutes < 60) {
                return `Last seen ${minutes} min ago`
            } else if (hours < 24) {
                return `Last seen ${hours} hour${hours > 1 ? 's' : ''} ago`
            } else if (days === 1) {
                return 'Last seen yesterday'
            } else if (days < 7) {
                return `Last seen ${days} days ago`
            } else {
                return `Last seen ${lastSeenDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
            }
        } catch (error) {
            return 'Last seen recently'
        }
    }

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

    // Format message time
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

    // Handle message click to show menu
    const handleMessageClick = (e: React.MouseEvent, messageId: string) => {
        e.stopPropagation()
        const message = currentMessages.find((m) => m._id === messageId)

        if (message) {
            const msgSenderId = String(message.senderId || '')
            const userId = String(currentUserId || '')
            if (msgSenderId === userId) {
                // Toggle menu - close if already open for this message, open if closed or different message
                setMessageMenuOpen(messageMenuOpen === messageId ? null : messageId)
                setSelectedMessage(messageId)
            }
        }
    }

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (messageMenuOpen) {
                const target = event.target as HTMLElement
                // Check if click is inside the menu
                const menuElement = target.closest('[data-menu-id]')
                // Check if click is on any message bubble
                const messageElement = target.closest('[data-message-id]')
                const clickedMessageId = messageElement?.getAttribute('data-message-id')
                
                // Close menu if click is not inside the menu and not on the message that opened it
                // (Clicking on the same message will be handled by handleMessageClick which toggles)
                if (!menuElement && (!clickedMessageId || clickedMessageId !== messageMenuOpen)) {
                    setMessageMenuOpen(null)
                }
            }
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setShowPopup(false)
                setSelectedMessage(null)
            }
        }

        if (messageMenuOpen || showPopup) {
            // Use click event in bubble phase (fires after onClick) to allow onClick handlers to process first
            document.addEventListener('click', handleClickOutside)

            return () => {
                document.removeEventListener('click', handleClickOutside)
            }
        }
    }, [messageMenuOpen, showPopup])

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

    // Handle delete chat
    const handleDeleteChat = async () => {
        if (!selectedChat) return
        
        try {
            await deleteChat(selectedChat._id)
            setSelectedChat(null)
            setShowChatMenu(false)
            setShowDeleteChatConfirm(false)
            getChats()
            onChatDeleted?.()
        } catch (error) {
            console.error('Error deleting chat:', error)
            alert('Failed to delete chat. Please try again.')
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

    // Handle image selection
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            const newFiles = Array.from(files)
            setSelectedImages(prev => [...prev, ...newFiles])
            
            // Create previews
            newFiles.forEach(file => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    if (reader.result) {
                        setImagePreviews(prev => [...prev, reader.result as string])
                    }
                }
                reader.readAsDataURL(file)
            })
        }
        // Reset input to allow selecting same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    // Remove image
    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index))
        setImagePreviews(prev => prev.filter((_, i) => i !== index))
    }

    // Handle emoji selection
    const handleEmojiSelect = (emojiData: any) => {
        const emoji = emojiData.emoji
        if (messageInputRef.current) {
            const input = messageInputRef.current
            const start = input.selectionStart || 0
            const end = input.selectionEnd || 0
            const newText = messageInput.substring(0, start) + emoji + messageInput.substring(end)
            setMessageInput(newText)
            // Set cursor position after emoji
            setTimeout(() => {
                input.focus()
                input.setSelectionRange(start + emoji.length, start + emoji.length)
            }, 0)
        } else {
            setMessageInput(prev => prev + emoji)
        }
        setIsEmojiPickerOpen(false)
    }

    // Handle send message
    const handleSendMessage = async () => {
        // Allow sending if there's text OR images
        if ((!messageInput.trim() && imagePreviews.length === 0) || !selectedChat || isSendingMessage) return

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
            typingTimeoutRef.current = null
        }
        sendTypingIndicator(selectedChat._id, false)

        try {
            // Convert image previews to URLs (for now using data URLs, in production upload to server first)
            const imageUrls = imagePreviews.length > 0 ? imagePreviews : undefined
            
            await sendMessage(selectedChat._id, messageInput.trim(), imageUrls)
            setMessageInput('')
            setSelectedImages([])
            setImagePreviews([])
        } catch (error) {
            console.error('Error sending message:', error)
        }
    }

    // Cancel edit
    const handleCancelEdit = () => {
        setEditingMessage(null)
        setEditText('')
    }

    // Handle click outside chat menu, delete chat modal, and emoji picker
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            
            // Close chat menu dropdown
            if (showChatMenu) {
                if (chatMenuRef.current && !chatMenuRef.current.contains(target)) {
                    const menuButton = target.closest('button[data-chat-menu-button]')
                    if (!menuButton) {
                        setShowChatMenu(false)
                    }
                }
            }
            
            // Delete chat modal backdrop click is handled directly in the modal component
            
            // Close emoji picker
            if (isEmojiPickerOpen && emojiPickerRef.current && !emojiPickerRef.current.contains(target)) {
                // Check if click is on the emoji button (to allow toggle)
                const emojiButton = target.closest('button[data-emoji-button]')
                if (!emojiButton) {
                    setIsEmojiPickerOpen(false)
                }
            }
        }

        if (showChatMenu || showDeleteChatConfirm || isEmojiPickerOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showChatMenu, showDeleteChatConfirm, isEmojiPickerOpen])

    if (!selectedChat) {
        return (
            <div className={`flex-1 flex items-center justify-center bg-[#090721] border border-[#FFFFFF33] rounded-[21px] mr-2 md:mr-5 font-exo2 min-h-0 transition-all duration-300 ${
                isMobileChatOpen ? 'hidden' : 'hidden md:flex'
            }`}>
                <p className="text-gray-400">Select a chat to start messaging</p>
            </div>
        )
    }

    return (
        <div className={`flex-1 min-w-0 flex flex-col bg-[#090721] border border-[#FFFFFF33] rounded-[21px] mr-2 md:mr-5 font-exo2 min-h-0 transition-all duration-300 ${
            isMobileChatOpen ? 'flex' : 'hidden md:flex'
        }`}>
            {/* Chat Header */}
            <div className="p-4 rounded-t-[21px] border-b border-[#14122D] bg-[#14122D] flex items-center justify-between font-exo2">
                <div className="flex items-center gap-3">
                    {/* Back Button for Mobile */}
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="md:hidden text-white hover:text-gray-300 transition-colors mr-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    )}
                    <div className="relative">
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden p-1.5 flex-shrink-0"
                            style={
                                otherParticipant?.profilePicture
                                    ? undefined
                                    : { background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)' }
                            }
                        >
                            {otherParticipant?.profilePicture ? (
                                <img
                                    src={otherParticipant.profilePicture}
                                    alt={otherParticipant?.name || 'User'}
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
                        {otherParticipant?.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                        )}
                    </div>
                    <div>
                        <p className="text-white text-[16px] font-semibold">{otherParticipant?.name || 'Unknown'}</p>
                        <p className="text-[#CC66FF] text-[14px]">
                            {formatLastSeen(otherParticipant)}
                        </p>
                    </div>
                </div>
                <div className="relative">
                    <button
                        data-chat-menu-button
                        onClick={() => setShowChatMenu(!showChatMenu)}
                        className="text-gray-400 hover:text-white"
                    >
                        <MoreVertical className="w-5 h-5" />
                    </button>
                    {/* Chat Menu Dropdown */}
                    {showChatMenu && (
                        <div 
                            ref={chatMenuRef}
                            className="absolute right-0 top-full mt-2 bg-[#14122D] border border-[#FFFFFF33] rounded-lg shadow-2xl p-2 min-w-[160px] z-50 backdrop-blur-sm"
                        >
                            <button
                                onClick={() => {
                                    setShowChatMenu(false)
                                    setShowDeleteChatConfirm(true)
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
                                <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
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
                                            className={`max-w-md group relative ${isMine ? 'flex flex-col items-end' : 'flex flex-col items-start'
                                                }`}
                                            data-message-id={msg._id}
                                        >
                                            <div className="relative w-full">
                                                {msg.images && msg.images.length > 0 && (
                                                    <div 
                                                        onClick={(e) => isMine && handleMessageClick(e, msg._id)}
                                                        className={`grid gap-2 mb-2 ${isMine ? 'ml-auto' : 'mr-auto'} cursor-pointer`} 
                                                        style={{ maxWidth: '100%', width: 'fit-content' }}
                                                    >
                                                        {msg.images.map((img, i) => (
                                                            <div
                                                                key={i}
                                                                className="rounded-lg overflow-hidden"
                                                            >
                                                                <img 
                                                                    src={img} 
                                                                    alt={`Image ${i + 1}`} 
                                                                    className="w-full h-auto max-w-full object-contain rounded-lg bg-transparent" 
                                                                    style={{ backgroundColor: 'transparent' }}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {msg.message && (
                                                    <div
                                                        onClick={(e) => isMine && handleMessageClick(e, msg._id)}
                                                        className={`px-4 py-2.5 rounded-2xl cursor-pointer transition-all ${isMine
                                                                ? 'bg-[#4E00E5] text-white text-[14px] rounded-br-sm hover:bg-[#5A00FF]'
                                                                : 'bg-[#FFFFFF29] text-white text-[16px] rounded-bl-sm hover:bg-[#FFFFFF35]'
                                                            } shadow-md ${isMine ? 'hover:shadow-lg' : ''}`}
                                                    >
                                                        <p className="text-sm leading-relaxed">{msg.message}</p>
                                                        <div className="flex items-center justify-end gap-1.5 mt-1">
                                                            {msg.editedAt && (
                                                                <p className="text-xs text-gray-300 italic">(edited)</p>
                                                            )}
                                                            <p className="text-xs text-gray-400">{formatMessageTime(msg.timestamp)}</p>
                                                            {isMine && (
                                                                <div className="flex items-center gap-0.5">
                                                                    {msg.isRead ? (
                                                                        // Double blue tick - Message read (WhatsApp style)
                                                                        <CheckCheck className="w-4 h-4 text-blue-400" />
                                                                    ) : (
                                                                        // Single gray tick - Message sent but not read (WhatsApp style)
                                                                        <Check className="w-4 h-4 text-gray-400" />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                                {/* Show timestamp and read receipt for image-only messages */}
                                                {msg.images && msg.images.length > 0 && !msg.message && (
                                                    <div className="flex items-center justify-end gap-1.5 mt-1">
                                                        <p className="text-xs text-gray-400">{formatMessageTime(msg.timestamp)}</p>
                                                        {isMine && (
                                                            <div className="flex items-center gap-0.5">
                                                                {msg.isRead ? (
                                                                    <CheckCheck className="w-4 h-4 text-blue-400" />
                                                                ) : (
                                                                    <Check className="w-4 h-4 text-gray-400" />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {/* Edit/Delete Menu - Only for user's own messages */}
                                                {isMine && messageMenuOpen === msg._id && (
                                                    <div 
                                                        className={`absolute ${isMine ? 'right-0' : 'left-0'} top-full mt-2 bg-[#14122D] border border-[#FFFFFF33] rounded-lg shadow-2xl p-2 min-w-[180px] z-[100] backdrop-blur-sm`}
                                                        data-menu-id={msg._id}
                                                    >
                                                        <div className="flex flex-col gap-1">
                                                            {msg.message && (
                                                                <>
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
                                                                </>
                                                            )}
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
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })
                )}

                {/* Typing Indicator */}
                {selectedChat && typingUsers[selectedChat._id] && (() => {
                    // Filter out current user from typing users
                    const otherTypingUsers = typingUsers[selectedChat._id].filter(id => {
                        const idStr = String(id || '')
                        const currentIdStr = String(currentUserId || '')
                        return idStr !== currentIdStr
                    })
                    
                    // Only show if someone else is typing (not the current user)
                    if (otherTypingUsers.length === 0) return null
                    
                    
                    return (
                        <div className="flex justify-start">
                            <div className="max-w-md px-4 py-2.5 rounded-2xl bg-[#FFFFFF29] text-white rounded-bl-sm shadow-md">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {otherParticipant?.name || 'Someone'} is typing...
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                })()}

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

                {/* Delete Message Confirmation Dialog */}
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

                {/* Delete Chat Confirmation Dialog */}
                {showDeleteChatConfirm && (
                    <div 
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        onClick={(e) => {
                            // Close modal if clicking on backdrop
                            if (e.target === e.currentTarget) {
                                setShowDeleteChatConfirm(false)
                            }
                        }}
                    >
                        <div 
                            ref={chatMenuRef}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#14122D] border border-[#FFFFFF33] rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 font-exo2"
                        >
                            <h3 className="text-white text-lg font-semibold mb-2">Delete Chat</h3>
                            <p className="text-gray-400 text-sm mb-6">
                                Are you sure you want to delete this chat? This action cannot be undone and all messages will be permanently deleted.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => {
                                        setShowDeleteChatConfirm(false)
                                    }}
                                    className="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors font-exo2"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteChat}
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
                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                    <div className="mb-3 flex gap-2 overflow-x-auto">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative flex-shrink-0">
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />
                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-2 relative">
                    {/* Emoji Picker Button */}
                    <div className="relative">
                        <button
                            data-emoji-button
                            onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                            className="text-white hover:text-gray-300 transition-colors"
                        >
                            <Smile className="w-5 h-5" />
                        </button>
                        {/* Emoji Picker */}
                        {isEmojiPickerOpen && (
                            <div ref={emojiPickerRef} className="absolute bottom-full left-0 mb-2 z-50">
                                <EmojiPicker
                                    onEmojiClick={handleEmojiSelect}
                                    width={360}
                                    height={400}
                                />
                            </div>
                        )}
                    </div>

                    {/* Image Upload Button */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-white hover:text-gray-300 transition-colors"
                    >
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                    />

                    <input
                        ref={messageInputRef}
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

                    {/* <button className="text-white hover:text-gray-300 transition-colors">
                        <Mic className="w-5 h-5" />
                    </button> */}
                    <button
                        onClick={handleSendMessage}
                        disabled={(!messageInput.trim() && imagePreviews.length === 0) || isSendingMessage}
                        className="text-white hover:text-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}