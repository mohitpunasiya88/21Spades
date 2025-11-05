'use client'

import { useEffect, useMemo, useState } from 'react'
import FeedPost from '@/components/Dashboard/FeedPost'
import { Image as ImageIcon, Laugh, Tag, Search, ChevronDown } from 'lucide-react'
import FeedRightSidebar from '@/components/Layout/RightSidebar'

interface Post {
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

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories] = useState(['All', 'Crypto', 'Gaming', 'Ticketing', 'Fashion', 'Art', 'AI', 'Real Estate'])
  const [selectedCategory, setSelectedCategory] = useState('All')

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

  useEffect(() => {
    fetch('/api/feed')
      .then((res) => res.json())
      .then((data) => setPosts(data.posts))
  }, [])

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6">
        {/* Left column */}
        <div className="p-4">
          <h1 className="text-white text-2xl font-semibold font-Exo  mb-4">Hello Spades !</h1>

          {/* Input bar (pixel matched) */}
           <div className="flex items-center justify-between">
            <p>??</p>
            <div className="hidden md:flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-3xl px-4 py-4 w-full">
                      <Search className="w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="what's New"
                        className="bg-transparent border-none outline-none text-white placeholder-gray-400 flex-1 text-sm"
                      />
                    </div>
           </div>

            {/* Helper row */}
            <div className="mt-2 flex items-center justify-between text-[13px]">
              <div className="flex items-center gap-6 ps-12 whitespace-nowrap">
                <span className="flex items-center gap-1 text-blue-400">
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-gray-400">Image/Videos</span>
                </span>
                <span className="flex items-center gap-1 text-yellow-400">
                  <Laugh className="w-4 h-4" />
                  <span className="text-gray-400">Emoji</span>
                </span>
                <span className="flex items-center gap-1 text-orange-400">
                  <Tag className="w-4 h-4" />
                  <span className="text-gray-400">Categories</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 ml-1" />
                </span>
              </div>
              <button className="bg-white text-gray-900 font-semibold px-5 py-2 rounded-full shadow">Post</button>
            </div>

            <div className="border-b-2 border-gray-700 mb-10 mt-10" ></div>

          {/* Featured (Ticket) banner */}
          <div className="relative overflow-hidden rounded-2xl border border-[#2A2F4A] bg-gradient-to-br from-[#0F1429] to-[#0B0F1E] p-6 mb-6">
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
              {/* Car placeholder */}
              <div className="hidden md:block w-72 h-36 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 ml-6 shadow-lg" />
            </div>
          </div>

          {/* Discover banner */}
          <div className="relative overflow-hidden rounded-2xl border border-[#2A2F4A] bg-gradient-to-br from-[#19103a] via-[#2a1e70] to-[#0b0f1e] p-6 mb-6">
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
          </div>

          {/* Explore Feed Section */}
          <div className="mb-6">
            <div className="mb-3">
              <h2 className="text-white text-xl font-bold mb-1">Explore Feed</h2>
              <p className="text-gray-400">Explore Feed, the premier Web3 marketplace for securely buying, selling, and trading digital assets.</p>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-[#0B0F1E] text-gray-400 hover:bg-[#151a2f] border border-[#2A2F4A]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Feed Posts */}
            <div className="space-y-4">
              {posts.map((post) => (
                <FeedPost key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="xl:block hidden">
          <FeedRightSidebar />
        </div>
      </div>
    </div>
  )
}

