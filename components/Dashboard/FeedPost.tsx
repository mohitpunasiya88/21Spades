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
    <div className="rounded-2xl border border-[#FFFFFF33] bg-[#090721] p-8 font-exo2">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="flex items-center justify-center w-[48px] h-[48px] rounded-full overflow-hidden p-2"
          style={{
            background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)'
          }}
        >
          {/* Avatar */}
          <img src="/post/card-21.png" alt="Avatar" className="w-[40px] h-[40px] object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold truncate">{post.username}</span>
            {/* {post.verified && <CheckCircle2 className="w-4 h-4 text-blue-500" />} */}
            <img src="/post/verify-white.png" alt="" />
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
      <div className="border-b-2 border-[#FFFFFF33] mb-3 p-2" ></div>
      {/* Actions */}
      <div className="flex justify-between items-center gap-3 text-gray-400">
        <button
          onClick={() => setLiked((v) => !v)}
          className={`flex items-center gap-2 bg-[#FFFFFF0D] px-3 py-1.5 rounded-full border-[0.6px solid #FFFFFF0D] hover:bg-gray-800/70 ${liked ? 'text-[#FF5500]' : ''
            }`}
        >
          <Heart className="w-5 h-5" fill={liked ? '#FF5500' : 'none'} />
          <span>{((post.likes + likeDelta) / 1000).toFixed(1)}k</span>
        </button>
        {/* vertical line */}
        <div className="w-px h-[19px] bg-[#6B757E4D]" />
        {/* <div className='border-s-4'></div> */}
        <button className="flex items-center gap-2 bg-[#FFFFFF0D] px-3 py-1.5 rounded-full border-[0.6px solid #FFFFFF0D] hover:bg-gray-800/70 hover:text-blue-400">
          <MessageCircle className="w-5 h-5" />
          <span>{post.comments}</span>
        </button>
        {/* vertical line */}
        <div className="w-px h-[19px] bg-[#6B757E4D]" />
        <button className="flex items-center gap-2 bg-[#FFFFFF0D] px-3 py-1.5 rounded-full border-[0.6px solid #FFFFFF0D] hover:bg-gray-800/70 hover:text-green-400">
          <RefreshCcwIcon className="w-5 h-5" />
          <span>{post.shares}</span>
        </button>
        {/* vertical line */}
        <div className="w-px h-[19px] bg-[#6B757E4D]" />
        <button className="flex items-center gap-2 bg-[#FFFFFF0D] px-3 py-1.5 rounded-full border-[0.6px solid #FFFFFF0D] hover:bg-gray-800/70 hover:text-green-400">
          <Share2 className="w-5 h-5" />
          <span>{post.shares}</span>
        </button>
        {/* vertical line */}
        <div className="w-px h-[19px] bg-[#6B757E4D]" />
        <button className="flex items-center gap-2 bg-[#FFFFFF0D] px-3 py-1.5 rounded-full border-[0.6px solid #FFFFFF0D] hover:bg-gray-800/70 hover:text-yellow-400">
          <Bookmark className="w-5 h-5" />
          <span>{post.saves}</span>
        </button>
      </div>
    </div>
  )
}

