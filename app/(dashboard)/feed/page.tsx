'use client'

import { useEffect, useState } from 'react'
import FeaturedDrop from '@/components/Dashboard/FeaturedDrop'
import FeedPost from '@/components/Dashboard/FeedPost'
import TrendingSection from '@/components/Dashboard/TrendingSection'

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

  useEffect(() => {
    fetch('/api/feed')
      .then((res) => res.json())
      .then((data) => setPosts(data.posts))
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-white text-2xl font-bold mb-6">Hello Spades, 👋</h1>

      {/* What's New Input */}
      <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <input
            type="text"
            placeholder="What's New?"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <button className="text-gray-400 hover:text-white text-sm">Image/Videos</button>
            <button className="text-gray-400 hover:text-white text-sm">Emoji</button>
            <button className="text-gray-400 hover:text-white text-sm">Categories</button>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium">
            Post
          </button>
        </div>
      </div>

      <FeaturedDrop />

      {/* Discover Banner */}
      <div className="bg-purple-600 rounded-lg p-6 mb-6 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-white/90 mb-4">
              Lorem ipsum dolor sit amet consectetur. Accumsan bibendum pretium eu justo. Tortor sed velit egestas.
            </p>
            <button className="bg-white text-purple-600 font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              Discover Now
            </button>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-16 h-16 bg-white/20 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Explore Feed Section */}
      <div className="mb-6">
        <div className="mb-4">
          <h2 className="text-white text-xl font-bold mb-2">Explore Feed</h2>
          <p className="text-gray-400">
            Explore Feed, the premier Web3 marketplace for securely buying, selling, and trading digital assets.
          </p>
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
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Feed Posts */}
        <div>
          {posts.map((post) => (
            <FeedPost key={post.id} post={post} />
          ))}
        </div>
      </div>

      <TrendingSection />
    </div>
  )
}

