'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Share2, Bookmark, CheckCircle2, RefreshCcwIcon } from 'lucide-react'

interface FeedPostProps {
  post: {
    id: string
    username: string
    verified: boolean
    timeAgo: string
    walletAddress: string
    content: string
    image: string
    likes: number
    comments: number
    shares: number
    saves: number
  }
}

export default function FeedPost({ post }: FeedPostProps) {
  const [liked, setLiked] = useState(false)
  const likeDelta = liked ? 1 : 0
  return (
    <div className="rounded-2xl border border-[#2A2F4A] bg-gradient-to-b from-[#0F1429]/70 to-[#0B0F1E]/70 p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center shadow">
          <img src="/assets/card-icon.png" alt="Avatar" className="p-2 w-full h-full object-contain" />

        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold truncate">{post.username}</span>
            {/* {post.verified && <CheckCircle2 className="w-4 h-4 text-blue-500" />} */}
            <img src="/assets/verify-tick-icon.png" alt="" />
            <span className="text-gray-500 text-sm">{post.timeAgo}</span>
          </div>
          <p className="text-gray-500 text-xs truncate">{post.walletAddress}</p>
        </div>
      </div>

      {/* Text */}
      {post.content && <p className="text-white/90 mb-4 text-sm leading-relaxed">{post.content}</p>}

      {/* Media */}
      <div className="overflow-hidden rounded-xl w-full">
        <img src="/post/post.png" alt="Post Image" className="w-full  object-cover" />
      </div>
      <div className="border-b-2 border-gray-700 mb-3 p-2" ></div>
      {/* Actions */}
      <div className="flex items-center gap-3 text-gray-400">
        <button
          onClick={() => setLiked((v) => !v)}
          className={`flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full border-r border-gray-700 hover:bg-gray-800/70 ${liked ? 'text-[#FF5500]' : ''
            }`}
        >
          <Heart className="w-5 h-5" fill={liked ? '#FF5500' : 'none'} />
          <span>{((post.likes + likeDelta) / 1000).toFixed(1)}k</span>
        </button>
        {/* <div className='border-s-4'></div> */}
        <button className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full border-r border-gray-700 hover:bg-gray-800/70 hover:text-blue-400">
          <MessageCircle className="w-5 h-5" />
          <span>{post.comments}</span>
        </button>
        <button className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full border-r border-gray-700 hover:bg-gray-800/70 hover:text-green-400">
          <RefreshCcwIcon className="w-5 h-5" />
          <span>{post.shares}</span>
        </button>
        <button className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full border-r border-gray-700 hover:bg-gray-800/70 hover:text-green-400">
          <Share2 className="w-5 h-5" />
          <span>{post.shares}</span>
        </button>
        <button className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full border-r border-gray-700 hover:bg-gray-800/70 hover:text-yellow-400">
          <Bookmark className="w-5 h-5" />
          <span>{post.saves}</span>
        </button>
      </div>
    </div>
  )
}

