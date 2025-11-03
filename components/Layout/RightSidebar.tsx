'use client'

import { useEffect, useState } from 'react'

interface MarketData {
  fearGreed: {
    value: number
    label: string
    price: string
  }
  marketCap: {
    value: string
    change: string
    trend: string
  }
}

export default function RightSidebar() {
  const [marketData, setMarketData] = useState<MarketData | null>(null)

  useEffect(() => {
    fetch('/api/market')
      .then((res) => res.json())
      .then((data) => setMarketData(data))
  }, [])

  return (
    <aside className="w-80 bg-gray-900 border-l border-gray-800 h-screen overflow-y-auto p-6">
      {/* Fear & Greed Index */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-semibold">Fear & Greed Index</h3>
          <div className="flex gap-2 text-xs">
            <span className="text-gray-400">AAX</span>
            <span className="text-gray-400">BTC</span>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="gray"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="green"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${marketData?.fearGreed.value || 60 * 3.51} 352`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-green-400 font-bold text-xl">
                {marketData?.fearGreed.value || 60}%
              </span>
            </div>
          </div>
          <p className="text-center text-green-400 mb-2">
            {marketData?.fearGreed.label || 'Greed'}
          </p>
          <p className="text-center text-gray-400 text-sm">
            {marketData?.fearGreed.price || '120,530.31 USD'}
          </p>
        </div>
      </div>

      {/* Market Cap */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-semibold">Market Cap</h3>
          <button className="text-purple-500 text-sm">See All &gt;</button>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-white text-2xl font-bold mb-1">
            {marketData?.marketCap.value || '$5.02 T'}
          </p>
          <p className="text-green-400 text-sm">
            {marketData?.marketCap.change || '+0.50%'}
          </p>
        </div>
      </div>

      {/* Trending in Web3 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Trending in Web3</h3>
          <button className="text-purple-500 text-sm">See All &gt;</button>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-purple-500 text-xs px-2 py-1 bg-purple-500/20 rounded">Web3</span>
              <span className="text-purple-500 text-xs px-2 py-1 bg-purple-500/20 rounded">Tech</span>
            </div>
            <h4 className="text-white font-semibold mb-1">
              Here's what happened in crypto
            </h4>
            <p className="text-gray-400 text-xs mb-2">Tuesday, 21 Sep 2025</p>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs">2.1k views • 1 day ago</span>
              <button className="text-purple-500 text-xs">Read More</button>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Web3 Events */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Upcoming Web3 Events</h3>
          <button className="text-purple-500 text-sm">See All &gt;</button>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="w-full h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg mb-3 flex items-center justify-center">
            <span className="text-white text-sm">web3 summit</span>
          </div>
          <h4 className="text-white font-semibold mb-1">Web3 Event</h4>
          <p className="text-gray-400 text-xs mb-2">21 SEP • 36 Guild Street London, UK</p>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 bg-purple-600 rounded-full border-2 border-gray-800"
                ></div>
              ))}
            </div>
            <span className="text-gray-400 text-xs">19 Going</span>
          </div>
        </div>
      </div>

      {/* Learn Web3 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Learn Web3</h3>
          <button className="text-purple-500 text-sm">See All &gt;</button>
        </div>
        <div className="space-y-3">
          <div className="bg-gray-800 rounded-lg p-3 flex gap-3">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg"></div>
            <div className="flex-1">
              <h4 className="text-white text-sm font-semibold">What is Web3?</h4>
              <p className="text-gray-400 text-xs">2.1k views • 20 min ago</p>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 flex gap-3">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg"></div>
            <div className="flex-1">
              <h4 className="text-white text-sm font-semibold">What is NFT?</h4>
              <p className="text-gray-400 text-xs">2.1k views • 30 min ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* New Collection */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">New Collection</h3>
          <button className="text-purple-500 text-sm">See All &gt;</button>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-3 flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">21</span>
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-semibold">21Spades</p>
                <p className="text-gray-400 text-xs">35s ago • 0.91 ETH</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

