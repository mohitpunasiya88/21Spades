'use client'

import React from 'react'
import Image from 'next/image'
import { ArrowUp, Check, Heart, ShoppingCart, Share2, ChevronDown } from 'lucide-react'
import spadesImage from '../assets/21spades.png'

interface NFTDetailsProps {
  id: string
  name?: string
  owner?: string
  currentPrice?: string
  currentUsd?: string
  timeLeft?: string
}

function MiniCard({ title }: { title: string }) {
  return (
    <div className="relative bg-[#0A0D1F] rounded-xl p-4 ring-1 ring-white/5 hover:ring-white/10 transition w-full">
      {/* Image Area */}
      <div className="relative h-[220px] w-full rounded-lg overflow-hidden ring-1 ring-white/10 bg-[#050616]">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 120% at 50% 0%,rgb(78, 13, 255) 0%, #180B34 68%, #070817 100%)' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Image src={spadesImage} alt="21" width={140} height={140} className="object-contain pointer-events-none select-none" />
        </div>
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/10 ring-1 ring-white/20 hover:bg-white/20 transition">
          <Heart className="w-4 h-4 text-white" />
        </button>
      </div>
      
      {/* Content Area */}
      <div className="mt-4">
        {/* Title */}
        <p className="text-white text-sm font-exo2 mb-3">{title}</p>
        
        {/* Price and Details Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ArrowUp className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span className="text-white text-sm font-exo2 font-semibold">A. 8.56</span>
          </div>
          <button className="px-3 py-1.5 text-xs text-gray-300 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors font-exo2">Details</button>
        </div>
      </div>
    </div>
  )
}

export default function NFTDetails({
  id,
  name = 'new_Spades.avax',
  owner = 'Ulrich Nielsen',
  currentPrice = '8.41',
  currentUsd = '$ 22.93',
  timeLeft = '19d 6h',
}: NFTDetailsProps) {
  return (
    <div className="w-full min-h-screen bg-[#0F0F23]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Media */}
          <div className="relative bg-[#0A0D1F] rounded-2xl p-4 ring-1 ring-white/5">
            <div className="relative h-[420px] rounded-xl overflow-visible ring-1 ring-white/10 bg-[#050616]">
              <div className="absolute inset-0 rounded-xl overflow-hidden" style={{ background: 'radial-gradient(120% 120% at 50% 0%,rgb(78, 13, 255) 0%, #180B34 68%, #070817 100%)' }} />
              
              {/* Three Overlapping Spade Images */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Left Spade - Smaller, Behind */}
                <div className="absolute left-[20%] top-1/2 -translate-y-1/2 z-10 opacity-90">
                  <Image 
                    src={spadesImage} 
                    alt="21" 
                    width={200} 
                    height={200} 
                    className="object-contain pointer-events-none select-none drop-shadow-2xl" 
                  />
                </div>
                
                {/* Center Spade - Largest, Most Prominent */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <Image 
                    src={spadesImage} 
                    alt="21" 
                    width={260} 
                    height={260} 
                    className="object-contain pointer-events-none select-none drop-shadow-2xl" 
                  />
                </div>
                
                {/* Right Spade - Smaller, Behind */}
                <div className="absolute right-[20%] top-1/2 -translate-y-1/2 z-10 opacity-90">
                  <Image 
                    src={spadesImage} 
                    alt="21" 
                    width={200} 
                    height={200} 
                    className="object-contain pointer-events-none select-none drop-shadow-2xl" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-[#0A0D1F] rounded-2xl p-6 ring-1 ring-white/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Owner</span>
                <Check className="w-4 h-4 text-[#60A5FA]" />
                <span className="text-[#8FB2FF] text-sm underline">{owner}</span>
              </div>
              <button className="flex items-center gap-1 text-gray-300 text-sm px-3 py-1.5 border border-gray-700 rounded-lg hover:bg-white/5 transition">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
            <h1 className="text-white text-2xl md:text-3xl font-exo2 font-bold mb-3">{name}</h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Born from grit, discipline, and hustle. The Spades inspire the pursuit of excellence.
            </p>

            {/* Price and CTA */}
            <div className="mb-5">
              <p className="text-gray-400 text-xs mb-2">Current Price</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <ArrowUp className="w-4 h-4 text-red-500 fill-red-500" />
                  <span className="text-white font-exo2 text-lg">A. {currentPrice}</span>
                </div>
                <span className="text-gray-300 font-exo2">{currentUsd}</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-5 py-2.5 rounded-lg bg-[#7E6BEF] text-white font-exo2 hover:bg-[#6d59ee] transition">
                  Buy Now
                </button>
                <button className="px-5 py-2.5 rounded-lg border border-gray-700 text-white hover:bg-white/5 transition flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
              <p className="mt-3 text-gray-400 text-xs">Time Left <span className="text-white font-mono">{timeLeft}</span></p>
            </div>

            {/* Accordions (static visual) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <button className="flex items-center justify-between w-full bg-[#101226] text-white px-4 py-3 rounded-lg ring-1 ring-white/5">
                <span className="font-exo2">Token Detail</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              <button className="flex items-center justify-between w-full bg-[#101226] text-white px-4 py-3 rounded-lg ring-1 ring-white/5">
                <span className="font-exo2">Bids</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* More from this collection */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-exo2 text-lg">More from this collection</h2>
            <button className="px-3 py-1.5 text-sm text-white bg-[#1A1A2E] border border-white/10 rounded-lg hover:bg-[#252540] transition">
              Explore all
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {['sleeper_tyu.avax','qetchr.avax','buiquat.avax','dashmond.avax'].map((t) => (
              <MiniCard key={t} title={t} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


