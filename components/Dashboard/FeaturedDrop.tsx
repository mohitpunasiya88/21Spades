'use client'

import { Ticket } from 'lucide-react'

export default function FeaturedDrop() {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 rounded-xl p-8 mb-6 relative overflow-hidden border border-purple-500/30 shadow-xl">
      <div className="relative z-10 flex items-center justify-between">
        {/* Left Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white text-3xl font-bold mb-3">
                Win a Ferrari Purosangue
              </h2>
              <p className="text-white/90 text-base mb-6 max-w-lg">
                Buy a $50 NFT ticket in USDC for your chance to win the ultimate luxury FUV.
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm font-bold border border-white/30">
              D-DROP by 21SPADES
            </div>
          </div>
          
          {/* Timer */}
          <div className="flex items-center gap-6 mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 text-white border border-white/30">
              <div className="text-2xl font-bold">28</div>
              <div className="text-xs opacity-90">Days</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 text-white border border-white/30">
              <div className="text-2xl font-bold">17</div>
              <div className="text-xs opacity-90">Hours</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 text-white border border-white/30">
              <div className="text-2xl font-bold">38</div>
              <div className="text-xs opacity-90">Minutes</div>
            </div>
          </div>

          {/* Buy Ticket Button */}
          <button className="bg-white text-purple-600 font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-lg">
            <Ticket className="w-5 h-5" />
            Buy Ticket
          </button>
        </div>

        {/* Right - Car Image Placeholder */}
        <div className="hidden lg:block w-80 h-64 ml-8">
          <div className="w-full h-full bg-gradient-to-br from-red-600/30 to-red-800/20 rounded-xl border-2 border-white/20 backdrop-blur-sm flex items-center justify-center relative overflow-hidden">
            {/* Car silhouette placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-40 bg-gradient-to-br from-red-500 to-red-700 rounded-lg opacity-80 transform rotate-6 shadow-2xl"></div>
            </div>
            <span className="text-white/60 text-xs font-semibold relative z-10">Ferrari Purosangue</span>
          </div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
      <div className="absolute right-20 bottom-0 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
    </div>
  )
}
