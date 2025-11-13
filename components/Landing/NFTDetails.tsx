'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ArrowUp, Check, Heart, ShoppingCart, Share2, ChevronDown } from 'lucide-react'
import spadesImage from '../assets/21spades.png'
import { Avatar } from 'antd'
import { MessageSquareText,Share  } from "lucide-react";

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
        className="flex items-center justify-between w-full text-white px-4 py-3 hover:bg-white/5 transition-colors"
      >
        <span className="font-exo2">{title}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && children && (
        <div className="px-4 pb-3 text-gray-300 font-exo2 text-sm">
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
    <div className="w-full min-h-screen bg-[#0F0F23]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Media */}
          <div className="relative bg-[#0A0D1F] rounded-2xl p-4 ring-1 ring-white/5">
            <div className="relative h-[420px] rounded-xl overflow-visible ring-1 ring-white/10 bg-[#050616]">
              <div className="absolute inset-0 rounded-xl overflow-hidden bg-[#25016E] bg-gradient-to-b from-[#4F01E6] to-[#25016E]"/>
              
              {/* Three Overlapping Spade Images */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Left Spade - Smaller, Behind */}
                <div className="absolute left-[15%] top-1/2 -translate-y-1/2 z-10 opacity-90">
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
                <div className="absolute right-[15%] top-1/2 -translate-y-1/2 z-10 opacity-90">
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Avatar 
                  size={40}
                  className="!bg-[#1A1A2E] !flex !items-center !justify-center"
                  style={{
                    width: '40px',
                    height: '40px',
                  }}
                >
                  <span className="text-[#60A5FA] text-base font-exo2">U</span>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-gray-400 text-sm font-exo2">Owner</span>
                  <span className="text-[#8FB2FF] text-sm font-exo2 underline cursor-pointer">{owner}</span>
                </div>
                <MessageSquareText className="w-6 h-6 text-white" />
              </div>
              <button className="w-28 flex items-center gap-2 text-white text-sm px-4 py-2 rounded-full border border-gray-700 bg-[#1A1A2E] hover:bg-[#252540] transition font-exo2">
              <Share className="w-4 h-6 text-grey" />
                Share
              </button>
            </div>
            
            <h1 className="text-white text-3xl font-exo2 font-bold mb-4">{name}</h1>
            
            <p className="text-gray-400 text-sm font-exo2 leading-relaxed mb-8">
              Born from grit, discipline, and hustle. The Spades inspire the pursuit of excellence.
            </p>

            {/* Price and CTA */}
            <div>
              <p className="text-gray-400 font-exo2 text-xs mb-3">Current Price</p>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1.5">
                  <ArrowUp className="w-4 h-4 text-red-500 fill-red-500" />
                  <span className="text-white font-exo2 text-lg font-bold">A. {currentPrice}</span>
                </div>
                <span className="text-gray-300 font-exo2 text-lg">{currentUsd}</span>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <button className="px-10 py-3.5 rounded-full bg-gradient-to-r from-[#4F01E6] to-[#25016E] text-white font-exo2 font-semibold hover:opacity-90 transition text-base">
                  Buy Now
                </button>
                <button className="px-5 py-2.5 rounded-full border border-gray-700 bg-[#0A0D1F] text-white hover:bg-white/5 transition flex items-center gap-2 font-exo2">
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
              
              <p className="text-gray-400 text-xs font-exo2">
                Time Left <span className="text-white font-mono font-exo2">{timeLeft}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Accordion title="Token Detail">
            {/* Token detail content can go here */}
          </Accordion>

          <Accordion title="Bids">
            {/* Bids content can go here */}
          </Accordion>
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


