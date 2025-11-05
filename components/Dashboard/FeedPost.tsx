'use client'

import { Heart, MessageCircle, Share2, Bookmark, CheckCircle2 } from 'lucide-react'

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
  return (
    <div className="rounded-2xl border border-[#2A2F4A] bg-gradient-to-b from-[#0F1429]/70 to-[#0B0F1E]/70 p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center shadow">
          <span className="text-white font-bold">{post.username[0]}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold truncate">{post.username}</span>
            {post.verified && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
            <span className="text-gray-500 text-sm">{post.timeAgo}</span>
          </div>
          <p className="text-gray-500 text-xs truncate">{post.walletAddress}</p>
        </div>
      </div>

      {/* Text */}
      {post.content && <p className="text-white/90 mb-4 text-sm leading-relaxed">{post.content}</p>}

      {/* Media */}
      <div className="w-full aspect-[16/9] bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
        <span className="text-white/90 text-sm">NFT Image</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 text-gray-400">
        <button className="flex items-center gap-2 hover:text-red-500">
          <Heart className="w-5 h-5" />
          <span>{(post.likes / 1000).toFixed(1)}k</span>
        </button>
        <button className="flex items-center gap-2 hover:text-blue-500">
          <MessageCircle className="w-5 h-5" />
          <span>{post.comments}</span>
        </button>
        <button className="flex items-center gap-2 hover:text-green-500">
          <Share2 className="w-5 h-5" />
          <span>{post.shares}</span>
        </button>
        <button className="flex items-center gap-2 hover:text-yellow-500">
          <Bookmark className="w-5 h-5" />
          <span>{post.saves}</span>
        </button>
      </div>
    </div>
  )
}

