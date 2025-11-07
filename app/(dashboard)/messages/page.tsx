'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Search, MoreVertical, Smile, Paperclip, Mic, Edit, Check } from 'lucide-react'

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
  const t = useTranslations('messages')
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
    <div className="flex h-[calc(100vh-120px)] mt-10 font-exo2 w-full overflow-hidden min-h-0">
      {/* Chat List */}
      <div className="w-80 bg-[#090721] border border-[#FFFFFF33] rounded-[21px] mx-5 font-exo2 px-2 flex flex-col h-full min-h-0">
        <div>
          <div className="flex items-center justify-between p-2 my-2">
            <h2 className="text-white text-[24px] font-[700]">{t('chats')}</h2>
            <div className='gap-2 flex'>
              <button className="text-[#787785] hover:text-white">
                <Edit className="w-[18px] h-[18px]" />
              </button>
              <button className="text-[#787785] hover:text-white">
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
              placeholder={t('search')}
              className="w-full h-[44px] bg-[#14122D] border border-[#FFFFFF1A] mb-2 rounded-lg text-white placeholder-[#787486] focus:outline-none focus:border-purple-500 pl-14 pr-3"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleSelectChat(chat.id)}
              className={`w-full p-2 flex items-center gap-3 hover:bg-[#14122D] transition-colors border-b border-[#FFFFFF1A] ${selectedChat === chat.id ? 'bg-[#14122D]' : ''
                }`}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full items-center justify-center">
                  <img src="/assets/avatar.jpg" alt="avatar"  className="w-full h-full rounded-full object-cover"/>
                </div>
                {chat.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                )}
              </div>
              <div className="flex flex-col w-full">
              <div className="flex text-left justify-between w-full items-center">
                <p className="text-white text-[18px] font-semibold">{chat.name}</p>
                <p className="text-gray-400 text-[14px]">{chat.time}</p>
              </div>
              <div className="flex text-left justify-between w-full items-center">
                <p className="text-[#FFFFFF73] text-[14px] font-normal">{chat.name}</p>
                <p className="text-gray-400 text-[14px]"><Check className={`w-5 h-5 ${chat.isOnline ? 'text-purple-500' : 'text-gray-400'}`} /></p>
              </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 min-w-0 flex flex-col bg-[#090721] border border-[#FFFFFF33] rounded-[21px] mr-5 font-exo2 min-h-0">
        {selectedChatData ? (
          <>
            {/* Chat Header */}
            <div className="p-4 rounded-t-[21px] border-b border-[#14122D] bg-[#14122D] flex items-center justify-between font-exo2">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center">
                    <img src="/assets/avatar.jpg" alt="avatar"  className="w-full h-full rounded-full object-cover"/>
                  </div>
                  {selectedChatData.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                  )}
                </div>
                <div>
                  <p className="text-white text-[16px] font-semibold">{selectedChatData.name}</p>
                  <p className="text-[#CC66FF] text-[14px]">
                    {selectedChatData.isOnline ? t('online') : t('lastSeen', { minutes: 5 })}
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
                        className={`max-w-md px-4 py-2.5 rounded-2xl ${isMine
                            ? 'bg-[#FFFFFF29] text-white text-[16px] rounded-bl-sm'
                            : 'bg-[#4E00E5] text-white text-[14px] rounded-br-sm'
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
            <div className="p-4 border-t border-[#FFFFFF1A] bg-[#14122D] rounded-b-[21px]">
              <div className="flex items-center gap-2 h-[24px]">
                <button className="text-white ">
                  <Smile className="w-5 h-5" />
                </button>
                <button className="text-white ">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  placeholder={t('typeMessage')}
                  className="flex-1 px-4 py-2 text-white placeholder-[#A3AED0B2] focus:outline-none"
                />
                
                <button className="text-white">
                  <Mic className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400">{t('selectChat')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

