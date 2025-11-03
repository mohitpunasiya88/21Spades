'use client'

import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react'

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
    <div className="bg-gray-900 rounded-lg p-6 mb-4 border border-gray-800">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">{post.username[0]}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">{post.username}</span>
            {post.verified && (
              <span className="text-blue-500">✓</span>
            )}
            <span className="text-gray-500 text-sm">{post.timeAgo}</span>
          </div>
          <p className="text-gray-400 text-sm">{post.walletAddress}</p>
        </div>
      </div>

      <p className="text-white mb-4">{post.content}</p>

      <div className="w-full h-96 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg mb-4 flex items-center justify-center">
        <span className="text-white text-lg">NFT Image</span>
      </div>

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

