'use client'

import { useEffect, useState } from 'react'
import GaugeComponent from 'react-gauge-component'
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

export default function FeedRightSidebar() {
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [selected, setSelected] = useState('AVAX')
  useEffect(() => {
    fetch('/api/market')
      .then((res) => res.json())
      .then((data) => setMarketData(data))
  }, [])

  const value = marketData?.fearGreed.value ?? 60
  const label = marketData?.fearGreed.label ?? 'Greed'
  const price = marketData?.fearGreed.price ?? '120,530.31 USD'

  return (
    <aside
      id="right-sidebar"
      className="rounded-2xl h-screen overflow-y-auto p-4"
      style={{
        background: 'linear-gradient(180deg, #0F0F23 0%, #0F0F23 75%, rgb(38,42,66) 115%)',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
    >
      {/* Fear & Greed Index */}
      <div className="mb-6 p-4 rounded-2xl border border-[#2A2F4A] bg-[#0F1429]/60">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-semibold">Fear & Greed Index</h3>
          <div className="flex items-center justify-center ">
            <div className="inline-flex rounded-full bg-[#2a2a3e]">
              <button
                onClick={() => setSelected('AVAX')}
                className={` rounded-full font-semibold text-sm transition-all p-1  duration-300 ${selected === 'AVAX'
                    ? 'bg-gradient-to-r from-[#5C09FF] to-[#8b5cf6] text-white shadow-lg shadow-purple-500/50'
                    : 'text-gray-400 hover:text-white'
                  }`}
              >
                AVAX
              </button>
              <button
                onClick={() => setSelected('BTC')}
                className={` rounded-full font-semibold text-sm transition-all p-1 duration-300 ${selected === 'BTC'
                    ? 'bg-gradient-to-r from-[#5C09FF] to-[#8b5cf6] text-white shadow-lg shadow-purple-500/50'
                    : 'text-gray-400 hover:text-white'
                  }`}
              >
                BTC
              </button>
            </div>
          </div>
        </div>
        <div className=" p-4">
          <div className="flex items-center gap-2 text-xs mb-2">
            <span className="text-gray-300">{price}</span>
            <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">{label}</span>
          </div>
          <div className="relative mx-auto mt-4 mb-2 -mx-4" style={{ width: 'calc(100% + 2rem)', height: 180 }}>
            {/* Inner glow background to match design */}
            <div className="pointer-events-none absolute left-1/2 bottom-2 -translate-x-1/2 w-[220px] h-[140px] rounded-b-[120px]" style={{
              background: 'radial-gradient(120px 80px at 50% 100%, rgba(124,58,237,0.5) 0%, rgba(11,15,30,0.0) 70%)'
            }} />
            <GaugeComponent
              type="semicircle"
              arc={{
                width: 0.25,
                padding: 0.01,
                cornerRadius: 1,
                subArcs: [
                  { limit: 20, color: '#EA4228' },
                  { limit: 40, color: '#F5CD19' },
                  { limit: 60, color: '#5BE12C' },
                  { limit: 80, color: '#F5CD19' },
                  { limit: 100, color: '#EA4228' }
                ]
              }}
              pointer={{
                color: '#7C3AED',
                length: 0.82,
                width: 12,
              }}
              labels={{
                valueLabel: { formatTextValue: () => '' },
                tickLabels: { type: 'outer', ticks: [] }
              }}
              value={value}
              minValue={0}
              maxValue={100}
            />
            {/* White hub with glow */}
            <div className="pointer-events-none absolute left-1/2 bottom-[38px] -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.6)]" />
            {/* Centered percentage overlay */}
            <div className="pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 text-white text-3xl font-semibold">
              {Math.round(Number(value))}%
            </div>
          </div>
        </div>
      </div>

      {/* Market Cap */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-semibold">Market Cap <span className="text-gray-500">›</span></h3>
          <button className="text-purple-400 text-sm">See All &gt;</button>
        </div>
        <div className="rounded-2xl border border-[#2A2F4A] bg-[#0F1429]/60 p-4">
          <div className="flex items-end justify-between mb-1">
            <p className="text-white text-2xl font-bold">{marketData?.marketCap.value || '$5.02 T'}</p>
            <p className="text-green-400 text-sm">^ {marketData?.marketCap.change || '+0.50%'}</p>
          </div>
          {/* Area chart with glow */}
          <svg viewBox="0 0 240 70" className="w-full h-[70px]">
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,50 20,52 40,45 60,48 80,38 100,40 120,32 140,36 160,30 180,34 200,28 220,32 240,30 L240,70 L0,70 Z" fill="url(#area)" />
            <polyline filter="url(#glow)" fill="none" stroke="#22c55e" strokeLinecap="round" strokeWidth="2" points="0,50 20,52 40,45 60,48 80,38 100,40 120,32 140,36 160,30 180,34 200,28 220,32 240,30" />
          </svg>
        </div>
      </div>

      {/* Trending in Web3 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Trending in Web3</h3>
          <button className="text-purple-400 text-sm">See All &gt;</button>
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-[#2A2F4A] bg-[#0F1429]/60 p-4">
              <div className="flex items-center justify-between text-[10px] mb-2">
                <span className="px-2 py-0.5 rounded bg-[#1b2140] text-gray-300 border border-[#2A2F4A]">Sunday , 21 Sep 2025</span>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">Web3</span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30">News</span>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-semibold mb-1 truncate">Here's what happened in crypto</h4>
                  <p className="text-gray-400 text-xs line-clamp-2">Web3 is a proposed next generation of the World Wide Web that emphasizes decentralization...</p>
                  <div className="flex items-center justify-between mt-3 text-[11px] text-gray-400">
                    <div className="flex gap-4 items-center">
                      <span className="inline-flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path><circle cx="12" cy="12" r="3"></circle></svg> 2k</span>
                      <span className="inline-flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"></path></svg> 245</span>
                      <span className="inline-flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path></svg> 58</span>
                    </div>
                    <button className="text-purple-400">Read More &gt;</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
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

