'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ArrowUp, Check, Heart, ShoppingCart, Share2, ChevronDown } from 'lucide-react'
import spadesImage from '../assets/21spades.png'
import { Avatar } from 'antd'
import { MessageSquareText,Share  } from "lucide-react";
import AuthFooter from '../Auth/AuthFooter'

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
    <div className="relative bg-[#0A0D1F] rounded-xl p-3 sm:p-4 ring-1 ring-white/5 hover:ring-white/10 transition w-full">
      {/* Image Area */}
      <div className="relative h-[180px] sm:h-[220px] w-full rounded-lg overflow-hidden ring-1 ring-white/10 bg-[#050616]">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 120% at 50% 0%,rgb(78, 13, 255) 0%, #180B34 68%, #070817 100%)' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Image src={spadesImage} alt="21" width={120} height={120} className="sm:w-[140px] sm:h-[140px] object-contain pointer-events-none select-none" />
        </div>
        <button className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full bg-white/10 ring-1 ring-white/20 hover:bg-white/20 transition">
          <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        </button>
      </div>
      
      {/* Content Area */}
      <div className="mt-3 sm:mt-4">
        {/* Title */}
        <p className="text-white text-xs sm:text-sm font-exo2 mb-2 sm:mb-3">{title}</p>
        
        {/* Price and Details Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <ArrowUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500 fill-red-500" />
            <span className="text-white text-xs sm:text-sm font-exo2 font-semibold">A. 8.56</span>
          </div>
          <button className="px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs text-gray-300 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors font-exo2">Details</button>
        </div>
      </div>
    </div>
  )
}

interface AccordionProps {
  title: string
  children?: React.ReactNode
}

function Accordion({ title, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-[#101226] rounded-lg ring-1 ring-white/5 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-white px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-white/5 transition-colors"
      >
        <span className="font-exo2 text-sm sm:text-base">{title}</span>
        <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && children && (
        <div className="px-3 sm:px-4 pb-2.5 sm:pb-3 text-gray-300 font-exo2 text-xs sm:text-sm">
          {children}
        </div>
      )}
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
    <div className="w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Top section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Media */}
          <div className="relative rounded-xl sm:rounded-2xl">
            <div className="relative h-[280px] sm:h-[350px] lg:h-[420px] rounded-xl overflow-visible">
              <div className="absolute inset-0 rounded-xl overflow-hidden bg-gradient-to-b from-[#4F01E6] to-[#25016E]"/>
              
              {/* Three Overlapping Spade Images */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Left Spade - Smaller, Behind */}
                <div className="absolute left-[15%] top-1/2 -translate-y-1/2 z-10 opacity-90">
                  <Image 
                    src={spadesImage} 
                    alt="21" 
                    width={140} 
                    height={140} 
                    className="sm:w-[180px] sm:h-[180px] lg:w-[200px] lg:h-[200px] object-contain pointer-events-none select-none drop-shadow-2xl" 
                  />
                </div>
                
                {/* Center Spade - Largest, Most Prominent */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <Image 
                    src={spadesImage} 
                    alt="21" 
                    width={180} 
                    height={180} 
                    className="sm:w-[220px] sm:h-[220px] lg:w-[260px] lg:h-[260px] object-contain pointer-events-none select-none drop-shadow-2xl" 
                  />
                </div>
                
                {/* Right Spade - Smaller, Behind */}
                <div className="absolute right-[15%] top-1/2 -translate-y-1/2 z-10 opacity-90">
                  <Image 
                    src={spadesImage} 
                    alt="21" 
                    width={140} 
                    height={140} 
                    className="sm:w-[180px] sm:h-[180px] lg:w-[200px] lg:h-[200px] object-contain pointer-events-none select-none drop-shadow-2xl" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-4 sm:p-6 font-exo2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-3 sm:mb-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <Avatar 
                  size={36}
                  className="!bg-[#1A1A2E] !flex !items-center !justify-center"
                  style={{
                    width: '36px',
                    height: '36px',
                  }}
                >
                  <span className="text-[#60A5FA] text-sm sm:text-base font-exo2">U</span>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-xs sm:text-sm font-exo2">Owner</span>
                  <span className="text-[#884DFF] text-xs sm:text-sm font-exo2 cursor-pointer">{owner}</span>
                </div>
                <MessageSquareText className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-1 sm:ml-2" />
              </div>
              <button className="w-24 sm:w-28 flex items-center justify-center gap-1.5 sm:gap-2 text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#A3AED04D] hover:border-white font-exo2">
              <Share className="w-3.5 h-3.5 sm:w-4 sm:h-6 text-grey" />
                Share
              </button>
            </div>
            
            <h1 className="text-white text-xl sm:text-2xl lg:text-[32px] font-exo2 font-[600] mb-2">{name}</h1>
            
            <p className="text-[#A3AED0] max-w-full sm:max-w-[400px] text-xs sm:text-sm font-exo2 leading-relaxed mb-6 sm:mb-10">
              Born from grit, discipline, and hustle. The Spades inspire the pursuit of excellence.
            </p>

            {/* Price and CTA */}
            <div className="mt-6 sm:mt-12 lg:mt-24">
              <p className="text-white font-exo2 text-xs sm:text-sm">Current Price</p>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-2">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 fill-red-500" />
                  <span className="text-white font-exo2 text-base sm:text-lg font-bold">A. {currentPrice}</span>
                </div>
                <span className="text-[#884DFF] font-exo2 text-base sm:text-lg">{currentUsd}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-2">
                <button className="px-6 sm:px-10 py-2 sm:py-2.5 w-full sm:w-[200px] lg:w-[300px] rounded-full bg-gradient-to-r from-[#4F01E6] to-[#25016E] text-white font-exo2 font-semibold hover:opacity-90 transition text-sm sm:text-base">
                  Buy Now
                </button>
                <button className="px-5 py-2.5 rounded-full border border-gray-700 bg-[#0A0D1F] text-white hover:bg-white/5 transition flex items-center gap-2 font-exo2">
                  <ShoppingCart className="w-4 h-4" />
                  Bids Now
                </button>
              </div>
              
              <p className="text-gray-400 text-xs font-exo2">
                Auction Ends In <span className="text-white font-mono font-exo2">{timeLeft}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
          <Accordion title="Token Detail">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-400 text-sm font-exo2">Creator</span>
                <span className="text-white text-sm font-exo2">{owner}</span>
              </div>
              <div className="flex items-center justify-between ">
                <span className="text-gray-400 text-sm font-exo2">Token Standard</span>
                <span className="text-white text-sm font-exo2">ERC-721</span>
              </div>
              <div className="flex items-center justify-between ">
                <span className="text-gray-400 text-sm font-exo2">Blockchain</span>
                <span className="text-white text-sm font-exo2">Avalanche</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm font-exo2">Last Updated</span>
                <span className="text-white text-sm font-exo2">October 13, 2025</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-400 text-sm font-exo2">Category</span>
                <span className="text-white text-sm font-exo2">Art</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-400 text-sm font-exo2">Creator Fee</span>
                <span className="text-[#A855F7] text-sm font-exo2 font-semibold">10%</span>
              </div>
            </div>
          </Accordion>

          <Accordion title="Bids">
            {/* Bids content can go here */}
          </Accordion>
        </div>

        {/* More from this collection */}
        <div className="mt-6 sm:mt-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
            <h2 className="text-white font-exo2 text-base sm:text-lg">More from this collection</h2>
            <button className="px-6 sm:px-10 py-2 w-full sm:w-auto sm:max-w-[300px] text-xs sm:text-sm text-white border border-white/10 rounded-full hover:bg-[#252540] transition">
              Explore all
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {['sleeper_tyu.avax','qetchr.avax','buiquat.avax','dashmond.avax'].map((t) => (
              <MiniCard key={t} title={t} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


