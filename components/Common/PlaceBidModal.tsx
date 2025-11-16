'use client'

import React, { useState } from 'react'
import { X, ChevronUp, ChevronDown } from 'lucide-react'

interface PlaceBidModalProps {
  isOpen: boolean
  onClose: () => void
  minBid?: number
  balance?: number
  balanceUsd?: number
}

export default function PlaceBidModal({
  isOpen,
  onClose,
  minBid = 47.9,
  balance = 124,
  balanceUsd = 150.6,
}: PlaceBidModalProps) {
  const [bidAmount, setBidAmount] = useState<string>('0.00')

  if (!isOpen) return null

  const handleIncrement = () => {
    const current = parseFloat(bidAmount) || 0
    setBidAmount((current + 0.01).toFixed(2))
  }

  const handleDecrement = () => {
    const current = parseFloat(bidAmount) || 0
    if (current > 0) {
      setBidAmount(Math.max(0, current - 0.01).toFixed(2))
    }
  }

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setBidAmount(value)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-[#090721] to-[#090721] rounded-2xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Modal Content */}
        <div className="p-6 sm:p-8">
          {/* Title */}
          <h2 className="text-white text-2xl text-center sm:text-3xl font-exo2 font-bold mb-2">
            Place Your Bid
          </h2>

          {/* Description */}
          <p className="text-white/90 text-sm text-center sm:text-base font-exo2 mt-2">
            Enter your bid amount to place for NFT
          </p>

          {/* Balance Information */}
          <div className="mb-6">
            <p className="text-white text-sm text-center sm:text-base font-exo2">
              Balance : <span className="text-[#FF6B9D]">{balance} AVAX</span> (${balanceUsd})
            </p>
          </div>

          {/* Bid Input Field */}
          <div className="mb-4">
            <label className="block text-white/80 text-sm font-exo2 mb-2">
              Enter your bid amount in AVAX
            </label>
            <div className="relative">
              <input
                type="text"
                value={bidAmount}
                onChange={handleBidChange}
                placeholder="0.00 AVAX"
                className="w-full bg-[#1A1A2E] border border-white/20 rounded-lg px-4 py-3 pr-20 text-white font-exo2 text-base focus:outline-none focus:ring-2 focus:ring-[#4F01E6] focus:border-transparent"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                <button
                  onClick={handleIncrement}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <ChevronUp className="w-4 h-4 text-white/70" />
                </button>
                <button
                  onClick={handleDecrement}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <ChevronDown className="w-4 h-4 text-white/70" />
                </button>
              </div>
            </div>
          </div>

          {/* Minimum Bid */}
          <div className="mb-6">
            <p className="text-white text-sm text-right font-exo2">
              Min bid: <span className="text-[#FF6B9D]">{minBid} AVAX</span>
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={() => {
              // Handle bid submission
            }}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#4F01E6] to-[#25016E] text-white font-exo2 font-semibold text-base hover:opacity-90 transition-opacity shadow-lg"
          >
            Add AVAX
          </button>
        </div>
      </div>
    </div>
  )
}

