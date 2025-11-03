'use client'

import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import type { NFT } from '@/types/nft'

export default function TrendingSection() {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [selectedCategory, setSelectedCategory] = useState('ALL')

  useEffect(() => {
    fetch('/api/nft/trending')
      .then((res) => res.json())
      .then((data) => setNfts(data.nfts))
  }, [])

  const categories = ['ALL', 'Crypto', 'Gaming', 'Ticketing', 'Fashion', 'NFT', 'Real Estate', 'AI']

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-yellow-400 text-3xl font-bold mb-2">Trending</h2>
          <p className="text-gray-400">
            Discover a curated collection of unique digital assets and rare collectibles from top artists.
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
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

      {/* NFT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {nfts.map((nft) => (
          <div
            key={nft.id}
            className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-purple-600 transition-colors"
          >
            <div className="w-full h-64 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-white mb-2">21</div>
                <div className="text-white text-sm">SPADES</div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-400 text-sm mb-1">{nft.collection}</p>
              <p className="text-gray-500 text-xs mb-2">{nft.edition}</p>
              <p className="text-white font-semibold mb-3">{nft.name}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-purple-500">Ξ</span>
                  <span className="text-white font-semibold">{nft.price} ETH</span>
                </div>
                <button className="flex items-center gap-1 text-gray-400 hover:text-red-500">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs">{nft.likes}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors">
        Explore All
      </button>
    </div>
  )
}

