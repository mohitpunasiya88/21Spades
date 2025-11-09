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
      className="rounded-2xl h-full p-2 mt-5 mb-5 font-exo2 bg-[#090721] border-[0.5px] border-[#FFFFFF33]"
    >
      {/* Fear & Greed Index */}
      <div className="mb-6 p-4 pb-0 rounded-2xl border-[0.5px] border-[#FFFFFF33] bg-[#FFFFFF0A]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-semibold">Fear & Greed Index</h3>
          <div className="flex items-center justify-center ">
            <div className="inline-flex rounded-full bg-[#FFFFFF08] font-exo2 ">
              <button
                onClick={() => setSelected('AVAX')}
                className={` rounded-full font-[600] text-[10px] transition-all font-exo2 duration-300 px-2 py-1 ${selected === 'AVAX'
                  ? 'bg-[#5C09FF] text-white'
                  : 'text-[#FFFFFF4D] hover:text-white'
                  }`}
              >
                AVAX
              </button>
              <button
                onClick={() => setSelected('BTC')}
                className={` rounded-full font-[600] text-[10px] transition-all font-exo2 duration-300 px-2 py-1 ${selected === 'BTC'
                  ? 'bg-[#5C09FF] text-white'
                  : 'text-[#FFFFFF4D] hover:text-white'
                  }`}
              >
                BTC
              </button>
            </div>
          </div>
        </div>
        <div className="">
          <div className="w-full h-[0.5px] bg-[#FFFFFF1A] mb-2" />
          <div className="flex items-center gap-2 text-xs">
            <span className="text-white font-semibold">{price}</span>
            <span className="px-2 py-0.5 rounded-full bg-[#5C09FF] text-white border border-[#5C09FF]">{label}</span>
          </div>
          <div className="relative w-full h-full">
            {/* Inner glow background */}
            <div
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 w-[260px] h-[14 0px] rounded-t-[140px]"
              style={{
                background:
                  'radial-gradient(circle at 50% 100%, rgba(92,9,255,0.45) 0%, rgba(92,9,255,0.20) 35%, rgba(11,15,30,0.00) 65%)',
                filter: 'blur(14px)'
              }}
            />
            
            <GaugeComponent
              type="semicircle"
              arc={{
                width: 0.2,
                padding: 0.03,
                cornerRadius: 1,
                subArcs: [
                  { limit: 20, color: '#EA4228' },
                  { limit: 40, color: '#F87171' },
                  { limit: 50, color: '#FBBF24' },
                  { limit: 60, color: '#FDE047' },
                  { limit: 80, color: '#A3E635' },
                  { limit: 90, color: '#4ADE80' },
                  { limit: 100, color: '#22C55E' }
                ]
              }}
              pointer={{
                color: '#5C09FF',
                length: 0.75,
                width: 12,
                elastic: false
              }}
              labels={{
                valueLabel: { hide: true },
                tickLabels: { hideMinMax: true, ticks: [] }
              }}
              value={value}
              minValue={0}
              maxValue={100}
            />

            {/* White hub at center */}
            <div className="pointer-events-none absolute left-1/2 bottom-2 -translate-x-1/2 w-5 h-5 rounded-full bg-white" />

            {/* Centered percentage */}
            <div className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/3 text-white text-2xl font-bold">
              {Math.round(Number(value))}%
            </div>
          </div>
        </div>
      </div>

      {/* Market Cap */}
      <div className="mb-6 font-exo2">

        <div className="rounded-2xl border-[0.5px] border-[#FFFFFF33] bg-[#FFFFFF0A] p-4">
          <div className="flex items-center justify-between mb-2 ">
            <h3 className="text-white font-semibold">Market Cap <span className="text-gray-500">›</span></h3>
            <button className="text-purple-400 text-sm">See All &gt;</button>
          </div>
          {/* horizontal line */}
          <div className="w-full h-[0.5px] bg-[#FFFFFF33] mb-2" />
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
      <div className="mb-6 font-exo2 rounded-2xl border-[0.5px] border-[#FFFFFF33] bg-[#FFFFFF0A] p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Trending in Web3</h3>
          <button className="text-purple-400 text-sm">See All &gt;</button>
        </div>
        <div className="w-full h-[0.5px] bg-[#FFFFFF0D] mb-5" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="">
              <div className="flex items-center justify-between text-[10px] mb-2">
                <span className="text-[#884DFF] text-[10px] font-[500]">Sunday , 21 Sep 2025</span>
                <div className="flex gap-2">
                  <span className="text-[#884DFF] text-[10px] font-[500]">Web3</span>
                  <span className="text-white text-[10px] font-[500]">Tech</span>
                </div>
              </div>
              <div className="font-exo2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[5px] overflow-hidden" >
                    <img src="/post/news-img-1.jpg" alt="Avatar" className="w-full h-full " />
                  </div>
                  <h4 className="text-white text-sm font-semibold mb-1 truncate">Here's what happened in crypto</h4>
                </div>
                <div className="flex-1 min-w-0 mt-2">
                  <p className="text-[#A3AED069] text-xs line-clamp-2">
                    Web3 is a proposed next generation of the World Wide Web that emphasizes decentralization  World Wide Web that emphasizes decentralization
                  </p>
                  <div className="flex items-center justify-between mt-3 text-[11px] text-gray-400">
                    <div className="flex gap-4 items-center">
                      <span className="inline-flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path><circle cx="12" cy="12" r="3"></circle></svg> 2k</span>
                      <span className="inline-flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"></path></svg> 1hr ago</span>
                    </div>
                    <button className="text-white px-2 py-1 rounded-full border-[0.5px] border-[#FFFFFF0D]">Read More </button>
                  </div>
                </div>
              </div>
              <div className="w-full h-[0.5px] bg-[#FFFFFF0D] mb-2 mt-2" />
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Web3 Events */}
      <div className="mb-6 font-exo2 rounded-2xl border-[0.5px] border-[#FFFFFF33] bg-[#FFFFFF0A] p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Upcoming Web3 Events</h3>
          <button className="text-white text-sm">See All  &gt;</button>
        </div>
        <div className="w-full h-[0.5px] bg-[#FFFFFF0D] mb-5" />
        <div className="bg-white text-black p-1 rounded-[5px] ">
          <div className="w-full h-32 rounded-[5px] mb-3 flex items-center justify-center">
            <img src="/post/web-event-img.jpg" alt="Event" className="w-full h-full rounded-[5px] object-cover" />
          </div>
          <h4 className="text-black font-semibold mb-1">Web3 Event</h4>
          <div className="flex items-center justify-between gap-2">
            <p className="text-[#030208] text-[10px] mb-2 font-[500]">⚲ 36 Guild Street London, UK</p>
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-4 h-4 bg-[#884DFF] rounded-full border-2 border-[#884DFF]"
                ></div>
              ))}
              <span className="text-[#030208] text-[8px] ml-2 font-[500]">+19 Going</span>
            </div>
          </div>
        </div>
      </div>

      {/* Learn Web3 */}
      <div className="mb-6 font-exo2 rounded-2xl border-[0.5px] border-[#FFFFFF33] bg-[#FFFFFF0A] p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Learn Web3</h3>
          <button className="text-white text-sm">See All &gt;</button>
        </div>
        <div className="w-full h-[0.5px] bg-[#FFFFFF0D] mb-5" />
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-24 h-16 aspect-square rounded-[5px] overflow-hidden" >
              <img src="/post/news-img-1.jpg" alt="Avatar" className="w-full h-full " />
            </div>
            <div className="flex-1">
              <h4 className="text-white text-sm font-semibold">What is Web3?</h4>
              <p className="text-[#A3AED069] text-xs line-clamp-1">Web3 is a proposed next generation of the World Wide Web that emphasizes decentralization</p>
              <p className="text-white text-[10px] font-[500] flex items-center gap-2"><span className="">⏲ 2.1k views</span> <span className="">⏲ 20 min</span></p>
            </div>
          </div>
          <div className="w-full h-[0.5px] bg-[#FFFFFF0D] mb-2 mt-2" />
          <div className="flex items-center gap-2">
            <div className="w-24 h-16 aspect-square rounded-[5px] overflow-hidden" >
              <img src="/post/news-img-1.jpg" alt="Avatar" className="w-full h-full " />
            </div>
            <div className="flex-1">
              <h4 className="text-white text-sm font-semibold">What is Web3?</h4>
              <p className="text-[#A3AED069] text-xs line-clamp-1">Web3 is a proposed next generation of the World Wide Web that emphasizes decentralization</p>
              <p className="text-white text-[10px] font-[500] flex items-center gap-2"><span className="">⏲ 2.1k views</span> <span className="">⏲ 20 min</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* New Collection */}
      <div className="mb-6 font-exo2 rounded-2xl border-[0.5px] border-[#FFFFFF33] bg-[#FFFFFF0A] p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">New Collection</h3>
          <button className="text-white text-sm">See All &gt;</button>
        </div>
        <div className="w-full h-[0.5px] bg-[#FFFFFF0D] mb-5" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div key={i} className="flex items-center gap-2">
                <div className="w-12 h-12 aspect-square rounded-[5px] overflow-hidden bg-gradient-to-br from-[#4F01E6] to-[#020019]  p-2" >
                  <img src="/assets/nft-card-icon.png" alt="Avatar" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col items-start gap-[0.5px] w-full">
                  <div className="flex flex-row items-center justify-between w-full">
                    <p className="text-white text-[16px] font-semibold">21Spades</p>
                    <p className="text-[#FFFFFF99] text-[10px]">35s ago</p>
                  </div>
                  <div className="flex flex-row items-center justify-between w-full">
                    <p className="text-white text-[12px] font-[500]">By <span className="text-[#884DFF]">21Spades</span></p>
                    <p className="text-white text-[12px]">⟠ 0.91 ETH</p>
                  </div>
                </div>
                {/* horizontal line */}
              </div>
              <div className="w-full h-[0.5px] bg-[#FFFFFF0D] mb-2 mt-2" />
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

