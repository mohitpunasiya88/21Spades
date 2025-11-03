'use client'

import { useEffect, useState } from 'react'
import { Search, MoreVertical, Smile, Paperclip, Mic } from 'lucide-react'

interface Chat {
  id: string
  name: string
  time: string
  avatar: string
  isOnline?: boolean
}

interface Message {
  id: string
  senderId: string
  message: string
  timestamp: string
  isRead: boolean
  images?: string[]
}

export default function MessagesPage() {
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    fetch('/api/chat')
      .then((res) => res.json())
      .then((data) => setChats(data.chats))
  }, [])

  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId)
    // Load messages for this chat
    setMessages([
      {
        id: '1',
        senderId: '1',
        message: 'coool',
        timestamp: 'Yesterday, 18:04',
        isRead: true,
      },
      {
        id: '2',
        senderId: '2',
        message: "okay, see ya at 6",
        timestamp: 'Yesterday, 18:04',
        isRead: true,
      },
      {
        id: '3',
        senderId: '1',
        message: 'heyy',
        timestamp: 'Today, 12:21',
        isRead: true,
      },
      {
        id: '4',
        senderId: '2',
        message: "i've arived",
        timestamp: 'Today, 12:21',
        isRead: true,
      },
      {
        id: '5',
        senderId: '1',
        message: 'heyyy',
        timestamp: 'Today, 12:25',
        isRead: true,
      },
      {
        id: '6',
        senderId: '1',
        message: 'can you send me the photos from yesterday?',
        timestamp: 'Today, 12:25',
        isRead: true,
      },
      {
        id: '7',
        senderId: '1',
        message: 'greg really likes them :)',
        timestamp: 'Today, 12:25',
        isRead: true,
      },
      {
        id: '8',
        senderId: '2',
        message: 'here you go',
        timestamp: 'Today, 12:30',
        isRead: true,
        images: ['/api/placeholder/200/200', '/api/placeholder/200/200'],
      },
      {
        id: '9',
        senderId: '2',
        message: 'they look pretty good',
        timestamp: 'Today, 12:30',
        isRead: true,
      },
      {
        id: '10',
        senderId: '1',
        message: 'hahaha sure',
        timestamp: 'Today, 12:35',
        isRead: true,
      },
      {
        id: '11',
        senderId: '1',
        message: 'thanks a bunch!',
        timestamp: 'Today, 12:35',
        isRead: true,
      },
    ])
  }

  const selectedChatData = chats.find((c) => c.id === selectedChat)

  return (
    <div className="flex h-full">
      {/* Chat List */}
      <div className="w-80 border-r border-gray-800 bg-gray-900">
        <div className="p-4 border-b border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-120px)]">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleSelectChat(chat.id)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-gray-800 transition-colors ${
                selectedChat === chat.id ? 'bg-gray-800' : ''
              }`}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{chat.name[0]}</span>
                </div>
                {chat.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="text-white font-semibold">{chat.name}</p>
                <p className="text-gray-400 text-sm">{chat.time}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-gray-950">
        {selectedChatData ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-800 bg-gray-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{selectedChatData.name[0]}</span>
                  </div>
                  {selectedChatData.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                  )}
                </div>
                <div>
                  <p className="text-white font-semibold">{selectedChatData.name}</p>
                  <p className="text-gray-400 text-xs">
                    {selectedChatData.isOnline ? 'Online' : 'Last seen 5 min ago'}
                  </p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-white">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, idx) => {
                const isMine = msg.senderId === '1'
                const showTimestamp = idx === 0 || messages[idx - 1].timestamp !== msg.timestamp

                return (
                  <div key={msg.id}>
                    {showTimestamp && (
                      <p className="text-center text-gray-500 text-xs mb-2">{msg.timestamp}</p>
                    )}
                    <div
                      className={`flex ${isMine ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-md px-4 py-2.5 rounded-2xl ${
                          isMine
                            ? 'bg-gray-800/80 text-white rounded-bl-sm'
                            : 'bg-purple-600 text-white rounded-br-sm'
                        } shadow-md`}
                      >
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                        {msg.images && (
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            {msg.images.map((img, i) => (
                              <div
                                key={i}
                                className="w-32 h-32 bg-gradient-to-br from-orange-300 to-orange-500 rounded-lg overflow-hidden shadow-md"
                              >
                                <div className="w-full h-full bg-gradient-to-br from-orange-200/50 to-blue-200/50"></div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-800 bg-gray-900">
              <div className="flex items-center gap-2">
                <button className="text-gray-400 hover:text-white">
                  <Smile className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  placeholder="Type your message here ..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
                <button className="text-gray-400 hover:text-white">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-white">
                  <Mic className="w-5 h-5" />
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

