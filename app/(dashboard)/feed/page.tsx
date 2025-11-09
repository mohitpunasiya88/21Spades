'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import FeedPost from '@/components/Dashboard/FeedPost'
import { Image as ImageIcon, Laugh, LayoutGrid, Search, ChevronDown } from 'lucide-react'
import FeedRightSidebar from '@/components/Layout/FeedRightSidebar'
import { Badge } from 'antd'
import { useCategoriesStore, useFeedStore, type Post } from '@/lib/store/authStore'

// Helper function to format time ago
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds}s`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`
  return `${Math.floor(diffInSeconds / 604800)}w`
}

// Transform API Post to FeedPost props
function transformPost(post: Post) {
  // Check if this is a repost (has originalPost)
  const isRepost = !!post.originalPost
  const originalPost = post.originalPost
  
  // For reposts, use original post data for display, but keep repost post ID for interactions
  const displayPost = isRepost && originalPost ? {
    text: originalPost.text || post.text || '',
    postUrl: originalPost.postUrl || post.postUrl || '',
    likesCount: originalPost.likesCount || post.likesCount || 0,
    commentsCount: originalPost.commentsCount || post.commentsCount || 0,
    sharesCount: originalPost.sharesCount || post.sharesCount || 0,
    savesCount: originalPost.savesCount || post.savesCount || 0,
    repostsCount: post.repostsCount || 0,
  } : {
    text: post.text || '',
    postUrl: post.postUrl || '',
    likesCount: post.likesCount || 0,
    commentsCount: post.commentsCount || 0,
    sharesCount: post.sharesCount || 0,
    savesCount: post.savesCount || 0,
    repostsCount: post.repostsCount || 0,
  }

  // For reposts, use original post author, otherwise use repost author
  const author = (isRepost && originalPost?.author) 
    ? originalPost.author 
    : (post.author || {
        _id: 'unknown',
        name: 'Unknown User',
        username: 'unknown',
        profilePicture: undefined
      })

  return {
    id: post._id, // Keep repost post ID for tracking
    originalPostId: isRepost && originalPost ? originalPost._id : undefined, // Store original post ID for likes
    username: author.username || author.name || 'Unknown User',
    verified: true, // You can add verified field to user model later
    timeAgo: formatTimeAgo(post.createdAt || new Date().toISOString()),
    walletAddress: author._id ? author._id.slice(-8) : 'unknown',
    profilePicture: author.profilePicture,
    content: displayPost.text,
    image: displayPost.postUrl || '/post/post.png',
    likes: displayPost.likesCount,
    comments: displayPost.commentsCount,
    shares: displayPost.sharesCount,
    reposts: displayPost.repostsCount,
    saves: displayPost.savesCount,
    isLiked: post.isLiked || false,
    isSaved: post.isSaved || false,
    isReposted: post.isReposted || false,
  }
}

export default function FeedPage() {
  const { posts, isLoading, getPosts } = useFeedStore()
  const { categories, getCategories } = useCategoriesStore()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const categoriesRef = useRef<HTMLDivElement>(null)

  // Prepare categories list with "All" option at the beginning
  const categoriesList = useMemo(() => {
    const allCategories = categories.filter(cat => cat.isActive).map(cat => cat.name)
    return ['All', ...allCategories]
  }, [categories])

  // Countdown (dummy target ~ 3 days later)
  const target = useMemo(() => Date.now() + 3 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000 + 38 * 60 * 1000, [])
  const [remaining, setRemaining] = useState(target - Date.now())
  useEffect(() => {
    const id = setInterval(() => setRemaining(Math.max(0, target - Date.now())), 1000)
    return () => clearInterval(id)
  }, [target])
  const dd = Math.floor(remaining / (24 * 60 * 60 * 1000))
  const hh = Math.floor((remaining / (60 * 60 * 1000)) % 24)
  const mm = Math.floor((remaining / (60 * 1000)) % 60)

  // Fetch categories on mount
  useEffect(() => {
    getCategories()
  }, [getCategories])

  // Fetch posts when category changes
  useEffect(() => {
    const categoryId = selectedCategory === 'All' 
      ? undefined 
      : categories.find(cat => cat.name === selectedCategory)?._id
    
    getPosts({ 
      categoryId,
      page: 1,
      limit: 20
    })
  }, [selectedCategory, categories, getPosts])

  // Close categories dropdown on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) {
        setIsCategoriesOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-4 md:gap-6 font-exo2">
        {/* Left column */}
        <div className="p-2 sm:p-3 md:p-4">
          <h1 className="text-white text-xl sm:text-2xl font-semibold font-exo2 mb-3 md:mb-4">Hello Spades !</h1>

          {/* Input bar (pixel matched) */}
          <div className="flex items-start gap-3 sm:gap-4 md:gap-6">
            <div className="relative flex-shrink-0">
              <div
                className="flex items-center justify-center w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] rounded-full overflow-hidden p-1.5 sm:p-2"
                style={{
                  background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)'
                }}
              >
                {/* Avatar */}
                <img src="/post/card-21.png" alt="Avatar" className="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] object-contain" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 bg-[#FFFFFF08] rounded-2xl sm:rounded-3xl px-3 sm:px-4 py-3 sm:py-4 w-full">
                <input
                  type="text"
                  placeholder="What's New?"
                  className="bg-transparent border-none outline-none text-white placeholder-[#FFFFFF4D] flex-1 text-sm font-exo2 w-full"
                />
              </div>
              {/* Helper row */}
              <div className="p-2 sm:p-3 md:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 text-[11px] sm:text-[13px]">
                <div className="flex items-center flex-wrap gap-2 sm:gap-4 md:gap-6">
                  <span className="flex items-center gap-1 text-blue-400">
                    <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="text-[#FFFFFF4D] hidden xs:inline">Image/Videos</span>
                    <span className="text-[#FFFFFF4D] xs:hidden">Media</span>
                  </span>
                  {/* dot in center */}
                  <div className="w-1 h-1 rounded-full bg-[#FFFFFF4D]" />
                  <span className="flex items-center gap-1 text-yellow-400">
                    <Laugh className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="text-[#FFFFFF4D]">Emoji</span>
                  </span>
                  <div className="w-1 h-1 rounded-full bg-[#FFFFFF4D]" />
                  {/* Categories Dropdown */}
                  <div className="relative" ref={categoriesRef}>
                    <button
                      onClick={() => setIsCategoriesOpen((v) => !v)}
                      className="flex items-center gap-1.5 sm:gap-2 text-orange-400 px-2 sm:px-3 py-1 rounded-lg hover:bg-white/5 transition-colors"
                      style={{ backdropFilter: 'blur(4px)' }}
                    >
                      <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-[#FFFFFFCC] text-xs sm:text-sm">Categories</span>
                      <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 ml-0.5 sm:ml-1 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isCategoriesOpen && (
                      <div
                        className="absolute left-0 mt-2 rounded-xl overflow-hidden z-50"
                        style={{
                          background: 'rgba(17, 24, 39, 0.98)',
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                          backdropFilter: 'blur(20px)',
                          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.2)',
                          minWidth: '200px',
                        }}
                      >
                        {categoriesList.map((cat, index) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setSelectedCategory(cat)
                              setIsCategoriesOpen(false)
                            }}
                            className="w-full text-left px-5 py-3 text-sm text-white transition-all hover:bg-purple-600/30 flex items-center justify-between group"
                            style={{
                              borderBottom: index < categoriesList.length - 1 ? '1px solid rgba(139, 92, 246, 0.1)' : 'none',
                            }}
                          >
                            <span className="group-hover:text-purple-300 transition-colors">{cat}</span>
                            {cat === selectedCategory && (
                              <span className="text-green-400 text-sm font-bold">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button className="bg-white text-[#020019] text-sm sm:text-base md:text-[18px] font-[600] px-3 sm:px-4 py-1 rounded-full shadow font-exo2 whitespace-nowrap w-full sm:w-auto">Post</button>
              </div>
            </div>
          </div>

          <div className="border-b-1 border-[#FFFFFF33] mb-4" ></div>

          {/* Featured (Ticket) banner */}
          {/* <div className="relative overflow-hidden rounded-2xl border border-[#2A2F4A] bg-gradient-to-br from-[#0F1429] to-[#0B0F1E] p-6 mb-6">
            <div className="flex items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-purple-300 px-2 py-1 rounded bg-purple-500/15 border border-purple-500/30">D-DROP</span>
                  <span className="text-xs text-blue-300 px-2 py-1 rounded bg-blue-500/15 border border-blue-500/30">99% VERIFIED</span>
                </div>
                <h3 className="text-white text-2xl font-extrabold leading-tight mb-1">Win a Ferrari</h3>
                <p className="text-purple-300 font-bold text-lg mb-2">Purosangue</p>
                <p className="text-gray-300 mb-4 max-w-[520px]">Buy a 50 NFT ticket in USDC for your chance to win the ultimate luxury SUV.</p>
                <div className="flex items-center gap-3 mb-5">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-semibold shadow">Buy Ticket</button>
                  <button className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-lg border border-white/20">Cart</button>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-300">
                  <span><b className="text-white">{dd}</b> Days</span>
                  <span><b className="text-white">{hh}</b> Hours</span>
                  <span><b className="text-white">{mm}</b> Minutes</span>
                </div>
              </div>
              <div className="hidden md:block w-72 h-36 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 ml-6 shadow-lg" />
            </div>
          </div> */}

          {/* Discover banner */}
          {/* <div className="relative overflow-hidden rounded-2xl border border-[#2A2F4A] bg-gradient-to-br from-[#19103a] via-[#2a1e70] to-[#0b0f1e] p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-xl">
                <h4 className="text-white text-xl font-bold mb-2">Discover and sell your own tokenized assets</h4>
                <p className="text-gray-300 mb-4">Create, trade, and showcase what's uniquely yours from digital art to real‑world experiences.</p>
                <button className="bg-white text-gray-900 font-semibold px-5 py-2 rounded-lg">Discover Now</button>
              </div>
              <div className="hidden md:flex items-end gap-6 pr-2">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-yellow-400 flex items-center justify-center text-white font-bold">21</div>
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-yellow-400 flex items-center justify-center text-white font-bold">♠</div>
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-yellow-400 flex items-center justify-center text-white font-bold">21</div>
              </div>
            </div>
          </div> */}

          {/* Explore Feed Section */}
          <div className="mb-4 sm:mb-6">
            <div className="mb-2 sm:mb-3">
              <h2 className="text-white text-lg sm:text-xl font-bold mb-1">Explore Feed</h2>
              <p className="text-gray-400 text-sm sm:text-base">Explore Feed, the premier Web3 marketplace for securely buying, selling, and trading digital assets.</p>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 mb-3 sm:mb-4 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium whitespace-nowrap transition-colors border-b-2 text-sm sm:text-base flex-shrink-0 ${selectedCategory === cat
                      ? 'text-purple-400 border-purple-500'
                      : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Feed Posts */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center text-gray-400 py-8">Loading posts...</div>
              ) : posts.length === 0 ? (
                <div className="text-center text-gray-400 py-8">No posts found</div>
              ) : (
                posts
                  .filter((post) => post && post._id) // Filter out invalid posts
                  .map((post) => (
                    <FeedPost key={post._id} post={transformPost(post)} />
                  ))
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="hidden lg:block">
          <FeedRightSidebar />
        </div>
      </div>
    </div>
  )
}

