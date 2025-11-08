'use client'

import { useMemo } from 'react'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useLocaleStore } from '@/lib/store/localeStore'
import { Heart } from 'lucide-react'
import type { NFT } from '@/types/nft'

export default function MarketplacePage() {
  const t = useTranslations('marketplace')
  const { locale } = useLocaleStore()
  const [trending, setTrending] = useState<NFT[]>([])
  const [live, setLive] = useState<NFT[]>([])
  const [selectedCategory, setSelectedCategory] = useState('ALL')

  useEffect(() => {
    fetch('/api/nft/trending')
      .then((res) => res.json())
      .then((data) => setTrending(data.nfts))

    fetch('/api/nft/live')
      .then((res) => res.json())
      .then((data) => setLive(data.nfts))
  }, [])

  const categories = useMemo(() => [
    { key: 'ALL', label: t('all') },
    { key: 'Crypto', label: t('crypto') },
    { key: 'Gaming', label: t('gaming') },
    { key: 'Ticketing', label: t('ticketing') },
    { key: 'Fashion', label: t('fashion') },
    { key: 'NFT', label: t('nft') },
    { key: 'Real Estate', label: t('realEstate') },
    { key: 'AI', label: t('ai') }
  ], [t, locale])

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-yellow-400 text-4xl font-bold mb-4">{t('title')}</h1>
      <p className="text-gray-400 mb-8">
        {t('description')}
      </p>

      {/* Category Filters */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.key
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Trending Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-yellow-400 text-2xl font-bold">{t('trending')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trending.map((nft) => (
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
      </div>

      {/* Live Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-yellow-400 text-2xl font-bold">{t('live')}</h2>
          <div className="flex gap-2">
            <select className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2">
              <option>Avalanche</option>
            </select>
            <button className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2">
              {t('viewAll')}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {live.map((nft) => (
            <div
              key={nft.id}
              className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-purple-600 transition-colors"
            >
              <div className="w-full h-48 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">21</div>
                  <div className="text-white text-xs">SPADES</div>
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
      </div>
    </div>
  )
}

