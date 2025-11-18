'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'

interface PostPreview {
  username: string
  timeAgo: string
  profilePicture?: string
  content: string
  image?: string
}

interface RepostModalProps {
  isOpen: boolean
  onClose: () => void
  onRepost: (caption: string) => Promise<void>
  isReposting?: boolean
  post?: PostPreview
}

export default function RepostModal({
  isOpen,
  onClose,
  onRepost,
  isReposting = false,
  post,
}: RepostModalProps) {
  const [caption, setCaption] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isReposting) return
    
    try {
      await onRepost(caption.trim())
      setCaption('')
      onClose()
    } catch (error) {
      console.error('Error reposting:', error)
    }
  }

  const handleClose = () => {
    setCaption('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-[#090721] to-[#090721] rounded-2xl shadow-2xl overflow-hidden border border-[#FFFFFF33]">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Modal Content */}
        <div className="p-6 sm:p-8">
          {/* Title */}
          <h2 className="text-white text-2xl text-center sm:text-3xl font-exo2 font-bold mb-4">
            Repost Feed
          </h2>

          {/* Caption Input Field */}
          <div className="mb-4">
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="w-full bg-[#FFFFFF08] border border-[#FFFFFF33] rounded-xl px-4 py-3 text-white placeholder-gray-500 font-exo2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F01E6] focus:border-transparent"
              disabled={isReposting}
              autoFocus
            />
          </div>

          {/* Original Post Preview */}
          {post && (
            <div className="rounded-lg sm:rounded-xl border border-[#4F01E6] bg-[#090721] p-3 sm:p-4 mb-4">
              {/* Post Header */}
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div
                  className="flex items-center justify-center w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] rounded-full overflow-hidden p-1 sm:p-1.5 flex-shrink-0"
                  style={
                    post.profilePicture
                      ? undefined
                      : { background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)' }
                  }
                >
                  {post.profilePicture ? (
                    <img
                      src={post.profilePicture}
                      alt={post.username}
                      className="w-[24px] h-[24px] sm:w-[32px] sm:h-[32px] rounded-full object-cover"
                    />
                  ) : (
                    <img src="/post/card-21.png" alt="Avatar" className="w-[24px] h-[24px] sm:w-[32px] sm:h-[32px] object-contain" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className="text-white font-semibold truncate text-xs sm:text-sm">{post.username}</span>
                    <img src="/post/verify-white.png" alt="" className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="text-gray-500 text-xs whitespace-nowrap">{post.timeAgo}</span>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              {post.content && (
                <p className="text-white/90 mb-2 sm:mb-3 text-xs sm:text-sm leading-relaxed break-words">{post.content}</p>
              )}

              {/* Post Media */}
              {post.image && post.image !== '/post/post.png' && (
                <div className="overflow-hidden rounded-lg w-full">
                  <img
                    src={post.image}
                    alt="Post Image"
                    className="w-full h-auto object-fill max-h-[300px]"
                    style={{ display: 'block' }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          <form onSubmit={handleSubmit}>
            <button
              type="submit"
              disabled={isReposting}
              className="w-full py-3.5 rounded-full bg-gradient-to-b from-[#4F01E6] to-[#25016E] text-[#f0f0f0] font-exo2 font-semibold text-base hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isReposting ? 'Posting...' : 'Post'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

