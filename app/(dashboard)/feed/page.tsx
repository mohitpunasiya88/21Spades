'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useLocaleStore } from '@/lib/store/localeStore'
import { translateObject } from '@/lib/utils/translate'
import FeedPost from '@/components/Dashboard/FeedPost'
import { Image as ImageIcon, Laugh, Tag, Search, ChevronDown } from 'lucide-react'
import FeedRightSidebar from '@/components/Layout/FeedRightSidebar'
import { Badge } from 'antd'

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
  const t = useTranslations('feed')
  const { locale } = useLocaleStore()
  const [posts, setPosts] = useState<Post[]>([])
  const categories = useMemo(() => [
    { key: 'all', label: t('all') }, 
    { key: 'crypto', label: t('crypto') }, 
    { key: 'gaming', label: t('gaming') }, 
    { key: 'ticketing', label: t('ticketing') }, 
    { key: 'fashion', label: t('fashion') }, 
    { key: 'art', label: t('art') }, 
    { key: 'ai', label: t('ai') }, 
    { key: 'realEstate', label: t('realEstate') }
  ], [t, locale]) // Add locale dependency to force re-compute when language changes
  const [selectedCategory, setSelectedCategory] = useState('all')

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

  // Fetch and translate posts
  useEffect(() => {
    fetch('/api/feed')
      .then((res) => res.json())
      .then((data) => {
        // Translate backend content based on current locale
        const translatedPosts = data.posts.map((post: Post) => 
          translateObject(post, locale, ['content'])
        )
        setPosts(translatedPosts)
      })
  }, [locale]) // Re-fetch and translate when locale changes

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6 font-exo2" >
        {/* Left column */}
        <div className="p-4">
          <h1 className="text-white text-2xl font-semibold font-exo2  mb-4">{t('hello')}</h1>

          {/* Input bar (pixel matched) */}
          <div className="flex items-start gap-6">
            <div className="relative">
              <div
                className="flex items-center justify-center w-[48px] h-[48px] rounded-full overflow-hidden p-2"
                style={{
                  background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)'
                }}
              >
                {/* Avatar */}
                <img src="/post/card-21.png" alt="Avatar" className="w-[40px] h-[40px] object-contain" />
              </div>
            </div>
            <div className="flex-1">
              <div className="hidden md:flex items-center gap-2 bg-[#FFFFFF08] rounded-3xl px-4 py-4 w-full">
                <input
                  type="text"
                  placeholder={t('whatsNew')}
                  className="bg-transparent border-none outline-none text-white placeholder-[#FFFFFF4D] flex-1 text-sm font-exo2"
                />
              </div>
              {/* Helper row */}
              <div className="p-4 flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-6 whitespace-nowrap">
                  <span className="flex items-center gap-1 text-blue-400">
                    <ImageIcon className="w-4 h-4" />
                    <span className="text-[#FFFFFF4D]">{t('imageVideos')}</span>
                  </span>
                  {/* dot in center */}
                  <div className="w-1 h-1 rounded-full bg-[#FFFFFF4D]" />
                  <span className="flex items-center gap-1 text-yellow-400">
                    <Laugh className="w-4 h-4" />
                    <span className="text-[#FFFFFF4D]">{t('emoji')}</span>
                  </span>
                  <div className="w-1 h-1 rounded-full bg-[#FFFFFF4D]" />
                  <span className="flex items-center gap-1 text-orange-400">
                    <Tag className="w-4 h-4" />
                    <span className="text-[#FFFFFF4D]">{t('categories')}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500 ml-1" />
                  </span>
                </div>
                <button className="bg-white text-[#020019] text-[18px] font-[600] px-4 py-1 rounded-full shadow font-exo2">{t('post')}</button>
              </div>
            </div>
          </div>

          <div className="border-b-1 border-[#FFFFFF33] mb-4" ></div>

          {/* Featured (Ticket) banner */}
          {/* <div className="relative overflow-hidden rounded-2xl border border-[#2A2F4A] bg-gradient-to-br from-[#0F1429] to-[#0B0F1E] p-6 mb-6">
            <div className="flex items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-purple-300 px-2 py-1 rounded bg-purple-500/15 border border-purple-500/30">{t('ddrop')}</span>
                  <span className="text-xs text-blue-300 px-2 py-1 rounded bg-blue-500/15 border border-blue-500/30">{t('verified')}</span>
                </div>
                <h3 className="text-white text-2xl font-extrabold leading-tight mb-1 font-exo2">{t('winFerrari')}</h3>
                <p className="text-purple-300 font-bold text-lg mb-2 font-exo2">{t('purosangue')}</p>
                <p className="text-gray-300 mb-4 max-w-[520px] font-exo2">{t('buyTicketDesc')}</p>
                <div className="flex items-center gap-3 mb-5">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-semibold shadow font-exo2">{t('buyTicket')}</button>
                  <button className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-lg border border-white/20 font-exo2">{t('cart')}</button>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-300 font-exo2">
                  <span><b className="text-white">{dd}</b> {t('days')}</span>
                  <span><b className="text-white">{hh}</b> {t('hours')}</span>
                  <span><b className="text-white">{mm}</b> {t('minutes')}</span>
                </div>
              </div>
              <div className="hidden md:block w-72 h-36 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 ml-6 shadow-lg" />
            </div>
          </div> */}

          {/* Discover banner */}
          {/* <div className="relative overflow-hidden rounded-2xl border border-[#2A2F4A] bg-gradient-to-br from-[#19103a] via-[#2a1e70] to-[#0b0f1e] p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-xl">
                <h4 className="text-white text-xl font-bold mb-2 font-exo2">{t('discoverTitle')}</h4>
                <p className="text-gray-300 mb-4 font-exo2">{t('discoverDesc')}</p>
                <button className="bg-white text-gray-900 font-semibold px-5 py-2 rounded-lg font-exo2">{t('discoverNow')}</button>
              </div>
              <div className="hidden md:flex items-end gap-6 pr-2">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-yellow-400 flex items-center justify-center text-white font-bold font-exo2">21</div>
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-yellow-400 flex items-center justify-center text-white font-bold font-exo2">♠</div>
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-yellow-400 flex items-center justify-center text-white font-bold font-exo2">21</div>
              </div>
            </div>
          </div> */}

          {/* Explore Feed Section */}
          <div className="mb-6">
            <div className="mb-4">
              <h2 className="text-white text-2xl md:text-3xl font-bold mb-2 font-exo2">{t('exploreFeed')}</h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed font-exo2">{t('exploreFeedDesc')}</p>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-6 mb-4 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors border-b-2 font-exo2 ${selectedCategory === cat.key
                      ? 'text-purple-400 border-purple-500'
                      : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
                    }`}
                >
                  {cat.label}
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

