'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { ArrowUp, Heart, ShoppingCart, ChevronDown, X, ChevronUp, Coins } from 'lucide-react'
import spadesImage from '../assets/21spades.png'
import { Avatar, Spin } from 'antd'
import { MessageSquareText, Share } from "lucide-react";
import { useCollectionStore, mapApiNftToCollectionNft, type CollectionNFT } from '@/lib/store/collectionStore'
import { apiCaller } from '@/app/interceptors/apicall/apicall'
import authRoutes from '@/lib/routes'
import { useMessage } from '@/lib/hooks/useMessage'
import { useRouter } from 'next/navigation'
import { useMarketplace } from '@/app/hooks/contracts/useMarketplace'
import { useWallets } from '@privy-io/react-auth'
import { ethers } from 'ethers'
import bidIcon from '@/components/assets/image.png'

const parseNumericValue = (input: unknown): number | undefined => {
  if (input === undefined || input === null) return undefined
  if (typeof input === 'number') return Number.isFinite(input) ? input : undefined
  const numeric = parseFloat(String(input).replace(/[^0-9.\-]/g, ''))
  return Number.isFinite(numeric) ? numeric : undefined
}

const formatAvaxAmount = (value?: number): string => {
  if (value === undefined || value === null || !Number.isFinite(value)) {
    return '0.00'
  }
  const amount = Number(value)
  return amount >= 1 ? amount.toFixed(2) : amount.toFixed(4)
}

const formatUsdAmount = (value?: number): string | undefined => {
  if (value === undefined || value === null || !Number.isFinite(value)) return undefined
  const amount = Number(value)
  return amount >= 1 ? amount.toFixed(2) : amount.toFixed(4)
}

const formatDurationFromMs = (ms: number): string => {
  if (!Number.isFinite(ms) || ms <= 0) return '0s'
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const parts: string[] = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0 || days > 0) parts.push(`${hours}h`)
  if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`)
  parts.push(`${seconds}s`)
  return parts.join(' ')
}

interface Bid {
  _id?: string
  id?: string
  price?: number | string
  createdAt?: string
  user?: {
    name?: string
    profilePicture?: string | null
    walletAddress?: string
  }
}

type BidOrder = '' | 'asc' | 'desc' | 'low' | 'high'

interface NFTDetailsProps {
  id: string
  collectionId?: string
  name?: string
  owner?: string
  currentPrice?: string
  currentUsd?: string
  timeLeft?: string
  method?: 'fixed-rate' | 'auction' // New prop for method type
}

function MiniCard({ nft, onClick }: { nft: CollectionNFT; onClick: () => void }) {
  const imageSource = nft.imageUrl || nft.image || spadesImage
  return (
    <button
      onClick={onClick}
      className="relative bg-[#0A0D1F] rounded-xl p-3 sm:p-4 ring-1 ring-white/5 hover:ring-white/10 transition w-full text-left"
    >
      <div className="relative h-[280px] sm:h-[250px] w-full rounded-lg overflow-hidden ring-1 ring-white/10 bg-[#050616]">
        <div className="absolute" style={{ background: 'radial-gradient(120% 120% at 50% 0%,rgb(78, 13, 255) 0%, #180B34 68%, #070817 100%)' }} />
        <div className="absolute  ">
          <Image src={imageSource} alt={nft.name} width={240} height={340} className="sm:w-[100%] h-[291px] sm:h-[250px] object-contain pointer-events-none select-none" />
        </div>
        <span className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full bg-white/10 ring-1 ring-white/20 hover:bg-white/20 transition">
          <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        </span>
      </div>
      <div className="mt-3 sm:mt-4">
        <p className="text-white text-xs sm:text-sm font-exo2 mb-2 sm:mb-3">{nft.name}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <ArrowUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500 fill-red-500" />
            <span className="text-white text-xs sm:text-sm font-exo2 font-semibold">A. {nft.price}</span>
          </div>
          <span className="px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs text-gray-300 border border-gray-600 rounded-lg font-exo2">Details</span>
        </div>
      </div>
    </button>
  )
}

interface AccordionProps {
  title: React.ReactNode
  children?: React.ReactNode
  isOpen?: boolean
  onToggle?: () => void
  id?: string
}

function Accordion({ title, children, isOpen: controlledIsOpen, onToggle, id }: AccordionProps) {
  // Create a unique state key based on id to ensure independent state
  const [internalIsOpen, setInternalIsOpen] = useState(false)

  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
  const handleToggle = onToggle || (() => {
    setInternalIsOpen(prev => !prev)
  })

  return (
    <div className="bg-[#101226] rounded-lg ring-1 ring-white/5 overflow-hidden">
      <button
        onClick={handleToggle}
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

// Place Bid Modal Component
function PlaceBidModal({
  isOpen,
  onClose,
  onConfirm,
  nftName = 'MOONLIGHT',
  nftImage,
  minBidAmount = 0,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: (bidAmount: string) => Promise<void> | void
  nftName?: string
  nftImage?: string
  minBidAmount?: number
}) {
  const [bidAmount, setBidAmount] = useState<string>('0.00')
  const [showSummary, setShowSummary] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [inputError, setInputError] = useState<string>('')
  const balance = 124
  const balanceUsd = 150.6
  const gasFee = 0.5
  const gasFeeUsd = 0.84
  const currentBid = 56.5

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setBidAmount('0.00')
      setShowSummary(false)
      setIsConfirming(false)
      setInputError('')
    }
  }, [isOpen, minBidAmount])

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
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setBidAmount(value)
      if (value === '') {
        setInputError('Enter a bid amount')
      } else if (parseFloat(value) < minBidAmount) {
        setInputError(`Bid must be greater than ${formatAvaxAmount(minBidAmount)} AVAX`)
      } else {
        setInputError('')
      }
    }
  }

  const handleInputBitAmount = () => {
    const bidAmountNum = parseFloat(bidAmount) || 0
    if (bidAmountNum >= minBidAmount) {
      setShowSummary(true)
      setInputError('')
    } else {
      setInputError(`Bid must be greater than ${formatAvaxAmount(minBidAmount)} AVAX`)
    }
  }

  const handleConfirm = async () => {
    if (isConfirming) return
    setIsConfirming(true)
    try {
      await onConfirm(bidAmount)
    } finally {
      setIsConfirming(false)
    }
  }

  const bidAmountNum = parseFloat(bidAmount) || 0
  const isBelowMinBid = bidAmountNum < minBidAmount
  const bidAmountUsd = (bidAmountNum * 0.3).toFixed(2)
  const total = (bidAmountNum + gasFee).toFixed(2)
  const totalUsd = ((bidAmountNum + gasFee) * 0.3).toFixed(2)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-[#090721] to-[#090721] rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Confirming Overlay */}
        {isConfirming && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-2xl">
            <div className="text-center">
              <h3 className="text-yellow-400 text-3xl font-bold font-exo2 mb-2">Confirming</h3>
              <p className="text-white text-sm font-exo2 mb-4">Please wait..</p>
              <div className="flex gap-2 justify-center">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal Content */}
        <div className="p-6 sm:p-8">
          {/* Title */}
          <h2 className="text-white text-2xl text-center sm:text-3xl font-exo2 font-bold mb-2">
            Place Your Bid
          </h2>

          {/* Description */}
          <p className="text-white/90 text-sm text-center sm:text-base font-exo2 mb-6">
            Enter your bid amount to place for NFT
          </p>

          {/* Balance Information */}
          {/* <div className="mb-6 flex items-center justify-center gap-2 bg-[#1A1A2E] rounded-lg p-3">
            <Coins className="w-5 h-5 text-yellow-400" />
            <p className="text-white text-sm sm:text-base font-exo2">
              Balance : <span className="text-[#7E6BEF]">{balance} AVAX</span> (<span className="text-[#7E6BEF]">${balanceUsd}</span>)
            </p>
          </div> */}

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
                className="w-full bg-black/40 border border-gray-600 rounded-lg px-4 py-3 pr-20 text-white font-exo2 text-base focus:outline-none focus:ring-1 focus:ring-[#7E6BEF] focus:border-[#7E6BEF]"
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
            {inputError && (
              <p className="mt-2 text-xs text-red-400 font-exo2">{inputError}</p>
            )}
          </div>

          {/* Minimum Bid */}
          <div className="mb-6">
            <p className="text-white text-sm text-right font-exo2">
              Min bid: <span className="text-[#7E6BEF]">{formatAvaxAmount(minBidAmount)} AVAX</span>
            </p>
          </div>

          {/* Summary Section - Show only after clicking Add AVAX */}
          {showSummary && (
            <div className="mb-6 bg-[#1A1A2E] rounded-lg p-4 space-y-3">
              <h3 className="text-white font-bold text-base font-exo2 mb-3">Summary</h3>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm font-exo2">Item</span>
                <span className="text-[#7E6BEF] text-sm font-exo2">{nftName}</span>
              </div>
              {/* <div className="flex justify-between">
                <span className="text-gray-400 text-sm font-exo2">Current Bid</span>
                <span className="text-white text-sm font-exo2">{currentBid} AVAX</span>
              </div> */}
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm font-exo2">Your Bid</span>
                <span className="text-white text-sm font-exo2">
                  {bidAmountNum} AVAX (<span className="text-[#7E6BEF]">${bidAmountUsd}</span>)
                </span>
              </div>
              {/* <div className="flex justify-between">
                <span className="text-gray-400 text-sm font-exo2">Gas Fee</span>
                <span className="text-white text-sm font-exo2">
                  {gasFee} AVAX (<span className="text-[#7E6BEF]">${gasFeeUsd}</span>)
                </span>
              </div> */}
              {/* <div className="flex justify-between pt-2 border-t border-white/10">
                <span className="text-white font-semibold text-sm font-exo2">Total</span>
                <span className="text-white font-semibold text-sm font-exo2">
                  {total} AVAX (<span className="text-[#7E6BEF]">${totalUsd}</span>)
                </span>
              </div> */}
            </div>
          )}

          {/* Action Button */}
          {!showSummary ? (
            <button
              onClick={handleInputBitAmount}
              disabled={isBelowMinBid}
              className="w-full py-3.5 rounded-full bg-gradient-to-b from-[#4F01E6] to-[#25016E] text-white font-exo2 font-semibold text-base hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Procced for Bid
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={isConfirming}
              className="w-full py-3.5 rounded-full bg-gradient-to-b from-[#4F01E6] to-[#25016E] text-white font-exo2 font-semibold text-base hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isConfirming && (
                <span className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
              )}
              {isConfirming ? 'Creating bid...' : 'Confirm Bid'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Make an Offer Modal Component
function MakeOfferModal({ isOpen, onClose, onConfirm, nftName = 'new_Spades.avax' }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; nftName?: string }) {
  const [offerAmount, setOfferAmount] = useState<string>('0.00')
  const minBid = 47.9
  const balance = 124
  const balanceUsd = 150.6

  const handleIncrement = () => {
    const current = parseFloat(offerAmount) || 0
    setOfferAmount((current + 0.01).toFixed(2))
  }

  const handleDecrement = () => {
    const current = parseFloat(offerAmount) || 0
    if (current > 0) {
      setOfferAmount(Math.max(0, current - 0.01).toFixed(2))
    }
  }

  const handleOfferChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setOfferAmount(value)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-[#090721] to-[#090721] rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
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
            Make an Offer
          </h2>

          {/* Description */}
          <p className="text-white/90 text-sm text-center sm:text-base font-exo2 mb-6">
            Enter your bid amount to make an offer
          </p>

          {/* Balance Information */}
          <div className="mb-6 flex items-center justify-center gap-2 bg-[#1A1A2E] rounded-lg p-3">
            <Coins className="w-5 h-5 text-yellow-400" />
            <p className="text-white text-sm sm:text-base font-exo2">
              Balance: <span className="text-[#7E6BEF]">{balance} AVAX</span> (<span className="text-[#7E6BEF]">${balanceUsd}</span>)
            </p>
          </div>

          {/* Offer Input Field */}
          <div className="mb-4">
            <label className="block text-white/80 text-sm font-exo2 mb-2">
              Enter your bid amount in AVAX
            </label>
            <div className="relative">
              <input
                type="text"
                value={offerAmount}
                onChange={handleOfferChange}
                placeholder="0.00 AVAX"
                className="w-full bg-black/40 border border-gray-600 rounded-lg px-4 py-3 pr-20 text-white font-exo2 text-base focus:outline-none focus:ring-1 focus:ring-[#7E6BEF] focus:border-[#7E6BEF]"
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
              Min bid: <span className="text-[#7E6BEF]">{minBid} AVAX</span>
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={onConfirm}
            disabled={parseFloat(offerAmount) < minBid}
            className="w-full py-3.5 rounded-full bg-gradient-to-b from-[#4F01E6] to-[#25016E] text-white font-exo2 font-semibold text-base hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Offer
          </button>
        </div>
      </div>
    </div>
  )
}

// Bid Placed Successfully Modal
function BidPlacedSuccessModal({ isOpen, onClose, bidAmount = '77.9', nftName = 'MOONLIGHT', nftImage }: { isOpen: boolean; onClose: () => void; bidAmount?: string; nftName?: string; nftImage?: string }) {
  const hash = '0x3a...D4F1'
  const bidUsd = (parseFloat(bidAmount) * 0.3).toFixed(2)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4 bg-gradient-to-br from-[#090721] to-[#090721] rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Modal Content */}
        <div className="p-6 sm:p-8">
          {/* NFT Image Section */}
          {nftImage && (
            <div className="relative mb-6 rounded-xl overflow-hidden">
              <div className="relative h-[200px] sm:h-[250px] w-full bg-gradient-to-b from-[#4F01E6] to-[#25016E]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src={nftImage}
                    alt={nftName}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Live Badge */}
                <div className="absolute top-3 left-3 bg-green-500/90 rounded-full px-3 py-1 flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-[#33E030] rounded-full animate-pulse"></div>
                  <span className="text-[#33E030] text-xs font-exo2 font-semibold">Live</span>
                </div>
                {/* Timer Badge */}
                <div className="absolute top-3 right-3 bg-black/60 rounded-full px-3 py-1">
                  <span className="text-white text-xs font-exo2">13h 50m 2s left</span>
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <h2 className="text-white text-2xl text-center sm:text-3xl font-exo2 font-bold mb-2">
            Bid Placed Successfully
          </h2>

          {/* Description */}
          <p className="text-white/90 text-sm text-center sm:text-base font-exo2 mb-6">
            Your Bid of <span className="font-bold">{bidAmount} AVAX</span> was placed
          </p>

          {/* Auction Info Box */}
          <div className="mb-6 bg-[#1A1A2E] rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm font-exo2">NFT Title</span>
              <span className="text-white text-sm font-exo2 text-right">{nftName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm font-exo2">Hash</span>
              <span className="text-white text-sm font-exo2 text-right">{hash}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm font-exo2">Your Bid</span>
              <span className="text-white text-sm font-exo2 text-right">
                {bidAmount} AVAX (<span className="text-[#7E6BEF]">${bidUsd}</span>)
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-full bg-gradient-to-b from-[#4F01E6] to-[#25016E] text-white font-exo2 font-semibold text-base hover:opacity-90 transition-opacity shadow-lg"
          >
            View Auctions
          </button>
        </div>
      </div>
    </div>
  )
}

// Offer Submitted Modal
function OfferSubmittedModal({ isOpen, onClose, offerAmount = '77.9', nftName = 'new_Spades.avax' }: { isOpen: boolean; onClose: () => void; offerAmount?: string; nftName?: string }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4 bg-gradient-to-br from-[#090721] to-[#090721] rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
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
            Offer Submitted
          </h2>

          {/* Description */}
          <p className="text-white/90 text-sm text-center sm:text-base font-exo2 mb-6">
            Your offer of <span className="font-bold">{offerAmount} AVAX</span> for {nftName} has been sent to seller
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-gray-600 bg-[#1A1A2E] text-white font-exo2 font-semibold text-sm hover:bg-white/5 transition"
            >
              Notify Me
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-full bg-gradient-to-b from-[#4F01E6] to-[#25016E] text-white font-exo2 font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              View Auction
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NFTDetails({
  id,
  collectionId,
  name = 'new_Spades.avax',
  owner = 'Ulrich Nielsen',
  currentPrice = '8.41',
  currentUsd = '$ 22.93',
  timeLeft = 'NA',
  method = 'auction',
}: NFTDetailsProps) {
  const router = useRouter()
  const { message } = useMessage()
  const { nfts: cachedNfts, setCollectionData } = useCollectionStore()
  const [currentNft, setCurrentNft] = useState<CollectionNFT | null>(null)
  const [relatedNfts, setRelatedNfts] = useState<CollectionNFT[]>([])
  const [isLoadingDetails, setIsLoadingDetails] = useState(true)
  const [isPlaceBidOpen, setIsPlaceBidOpen] = useState(false)
  const [isMakeOfferOpen, setIsMakeOfferOpen] = useState(false)
  const [isBidPlacedOpen, setIsBidPlacedOpen] = useState(false)
  const [isOfferSubmittedOpen, setIsOfferSubmittedOpen] = useState(false)
  const [placedBidAmount, setPlacedBidAmount] = useState<string>('77.9')
  const [bids, setBids] = useState<Bid[]>([])
  const [bidsLoading, setBidsLoading] = useState(false)
  const [bidsLoadingMore, setBidsLoadingMore] = useState(false)
  const [bidsPage, setBidsPage] = useState(1)
  const [bidsHasMore, setBidsHasMore] = useState(false)
  const [bidsOrder, setBidsOrder] = useState<BidOrder>('high')
  const BID_PAGE_SIZE = 10
  const [auctionTimerLabel, setAuctionTimerLabel] = useState('Auction Ends In')
  const [auctionTimerValue, setAuctionTimerValue] = useState(timeLeft)
  const [hasAuctionEnded, setHasAuctionEnded] = useState(false)
  const [hasAuctionStarted, setHasAuctionStarted] = useState(false)
  const [isAuctionLive, setIsAuctionLive] = useState(false)
  
  // Independent state for each accordion
  const [isTokenDetailOpen, setIsTokenDetailOpen] = useState(false)
  const [isBidsOpen, setIsBidsOpen] = useState(false)

  const matchNftById = useCallback(
    (nft: CollectionNFT, target: string) => {
      const possibleIds = [nft._id, nft.id, nft.nftId, nft.nftLongId]
      return possibleIds.filter(Boolean).map((val) => val!.toString()).includes(target)
    },
    [],
  )

  const normalizeListData = useCallback((data: any) => {
    if (Array.isArray(data)) return data
    return data?.items || data?.nfts || data?.data || data?.results || []
  }, [])

const currentNftIdentifier = useMemo(() => {
  const possibleIds = [
    currentNft?._id,
    currentNft?.id,
    id,
  ]
  const found = possibleIds.find((value) => value)
  return found ? String(found) : undefined
}, [currentNft, id])

  const loadFromCache = useCallback(
    (list: CollectionNFT[]) => {
      const match = list.find((nft) => matchNftById(nft, id))
      if (match) {
        setCurrentNft(match)
        setRelatedNfts(list.filter((nft) => !matchNftById(nft, id)))
        setIsLoadingDetails(false)
        return true
      }
      return false
    },
    [id, matchNftById],
  )

  const fetchNftDetails = useCallback(async () => {
    setIsLoadingDetails(true)
    try {
      if (collectionId) {
        const queryParams = new URLSearchParams({
          collectionId,
          page: '1',
          limit: '100',
          blocked: 'false',
        })
        const listResponse = await apiCaller(
          'GET',
          `${authRoutes.getNFTsByCollection}?${queryParams.toString()}`,
          null,
          true,
        )
        console.log('Submitting bid...1111111111111111111', listResponse)
        if (listResponse.success && listResponse.data) {
          const listData = normalizeListData(listResponse.data)
          const mappedList: CollectionNFT[] = listData.map(mapApiNftToCollectionNft)
          const match = mappedList.find((nft) => matchNftById(nft, id)) || mappedList[0] || null
          if (match) {
            setCurrentNft(match)
          }
          setRelatedNfts(mappedList.filter((nft) => !matchNftById(nft, id)))
          setCollectionData({
            collectionId,
            collectionData: listResponse.data.collection || listResponse.data.collectionData,
            nfts: mappedList,
          })
          return
        }
      }

      const response = await apiCaller('GET', `${authRoutes.getNFTsByCollection}/${id}`, null, true)
      if (response.success && response.data) {
        const rawNft = response.data.nft || response.data
        const mappedNft = mapApiNftToCollectionNft(rawNft)
        setCurrentNft(mappedNft)

        const associatedCollectionId = mappedNft.collectionId
        if (associatedCollectionId && typeof associatedCollectionId === 'string') {
          const listResponse = await apiCaller(
            'GET',
            `${authRoutes.getNFTsByCollection}?collectionId=${associatedCollectionId}&page=1&limit=100&blocked=false`,
            null,
            true,
          )
          if (listResponse.success && listResponse.data) {
            const listData = normalizeListData(listResponse.data)
            const mappedList: CollectionNFT[] = listData.map(mapApiNftToCollectionNft)
            setRelatedNfts(mappedList.filter((nft: CollectionNFT) => !matchNftById(nft, id)))
            setCollectionData({
              collectionId: associatedCollectionId,
              collectionData: listResponse.data.collection || listResponse.data.collectionData,
              nfts: mappedList,
            })
          }
        } else if (!associatedCollectionId) {
          setRelatedNfts([])
        }
      } else {
        message.error('NFT not found')
      }
    } catch (error) {
      console.error('Failed to fetch NFT details', error)
      message.error('Failed to fetch NFT details')
    } finally {
      setIsLoadingDetails(false)
    }
  }, [collectionId, id, matchNftById, message, normalizeListData, setCollectionData])

  useEffect(() => {
    if (id && !loadFromCache(cachedNfts)) {
      void fetchNftDetails()
    }
  }, [id, cachedNfts, collectionId, loadFromCache, fetchNftDetails])


  const { bid, getBrokerage, decimalPrecision, auctions } = useMarketplace()
  const address = useWallets()?.wallets[0]?.address
  const fetchBids = useCallback(
    async (page = 1, orderOverride?: BidOrder) => {
      if (!currentNftIdentifier) return
      const isLoadMore = page > 1
      isLoadMore ? setBidsLoadingMore(true) : setBidsLoading(true)
      const orderParam = orderOverride ?? bidsOrder
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(BID_PAGE_SIZE),
          nftId: currentNftIdentifier,
        })
        if (orderParam) {
          params.set('order', orderParam)
        }

        const response = await apiCaller(
          'GET',
          `${authRoutes.bids}?${params.toString()}`,
          null,
          true,
        )

        if (response?.success) {
          const payload =
            response?.data?.bids ??
            response?.data?.items ??
            response?.data?.data?.bids ??
            response?.data?.data?.items ??
            response?.data?.data ??
            response?.bids ??
            []

          const list = Array.isArray(payload)
            ? payload
            : Array.isArray((payload as any)?.data)
              ? (payload as any).data
              : []

          const normalized: Bid[] = list.map((entry: any) => {
            const createdBy = entry?.createdBy
            return {
              _id: entry?._id || entry?.id,
              id: entry?.id,
              price: entry?.price ?? entry?.amount,
              createdAt: entry?.createdAt || entry?.created_at,
              user:
                entry?.user ||
                entry?.bidder ||
                (createdBy
                  ? {
                      name: createdBy?.name || createdBy?.username,
                      profilePicture: createdBy?.profilePicture || null,
                      walletAddress: createdBy?.walletAddress,
                    }
                  : {
                      name: entry?.userName || entry?.username,
                      profilePicture: entry?.avatar || entry?.profilePicture || null,
                      walletAddress: entry?.walletAddress,
                    }),
            }
          })

          setBids((prev) => (page === 1 ? normalized : [...prev, ...normalized]))
          setBidsPage(page)

          const pagination =
            response?.data?.pagination ||
            response?.pagination ||
            response?.data?.data?.pagination

          if (pagination?.pages) {
            setBidsHasMore(page < pagination.pages)
          } else {
            setBidsHasMore(normalized.length === BID_PAGE_SIZE)
          }
        } else if (page === 1) {
          setBids([])
          setBidsHasMore(false)
        }
      } catch (error) {
        console.error('Failed to fetch bids', error)
        if (page === 1) {
          setBids([])
        }
        setBidsHasMore(false)
      } finally {
        isLoadMore ? setBidsLoadingMore(false) : setBidsLoading(false)
      }
    },
    [BID_PAGE_SIZE, bidsOrder, currentNftIdentifier],
  )

  useEffect(() => {
    if (isBidsOpen && currentNftIdentifier) {
      void fetchBids(1, bidsOrder)
    } else if (!isBidsOpen) {
      setBidsPage(1)
      setBidsHasMore(false)
    }
  }, [currentNftIdentifier, isBidsOpen, bidsOrder, fetchBids])

  useEffect(() => {
    if (isPlaceBidOpen && currentNftIdentifier && bids.length === 0) {
      void fetchBids(1, bidsOrder)
    }
  }, [isPlaceBidOpen, currentNftIdentifier, bids.length, bidsOrder, fetchBids])

  const handleBidConfirm = async (bidAmount: string) => {
    console.log(bidAmount,'bidAmount',currentNft)
      const response = await apiCaller('GET', `${authRoutes.getNFTsByCollection}/${id}`, null, true)
      console.log(response,'response1222222222222')
      const NFTDetails = response?.data?.nft;
      const bidPayload = {
        erc20Token: NFTDetails?.ipfsHash,
        price: bidAmount,
        nftId: Number(NFTDetails?.nftId),
        collectionAddress: NFTDetails?.collectionId?.collectionAddress,
        nonce: Number(NFTDetails?.nonce),
        sign: NFTDetails?.signature,
      }
console.log(bidPayload,'bidPayloadbidPayload')
    if (!bidAmount || Number(bidAmount) <= 0) {
      message.error('Enter a valid bid amount')
      return
    }
    if (!currentNftIdentifier) {
      message.error('NFT identifier missing')
      return
    }
    let loadingMessage: any = null
    try {
      // loadingMessage = message.loading('Submitting bid...', 0)
      const payload = {
        price: bidAmount,
        nftId: currentNftIdentifier,   /// _id pass ho rahi hai
      }
      // call blockchain bid hook 



      let overrides: ethers.Overrides = {};
      if (currentNft?.erc20Token === ethers.ZeroAddress) {
        const br = await getBrokerage(ethers.ZeroAddress) as { seller: bigint; buyer: bigint };
        const precision = await decimalPrecision() as bigint; // 100
        const buyerFee = (br.buyer * ethers.parseEther(bidAmount)) / (BigInt(100) * precision);
        overrides = { value: ethers.parseEther(bidAmount) + buyerFee };
      }
// ------------------------------
debugger
if (bidPayload?.nftId && bidPayload?.collectionAddress && bidPayload?.nonce && bidPayload?.sign) {
  const auction = await auctions(bidPayload?.collectionAddress, bidPayload?.nftId)
        
        console.log("auction11111111111111", auction)

        // Normalize auction (ethers v6 Result is read-only)
        const auctionStruct = {
          seller: auction.seller,
          currentBid: BigInt(auction.currentBid ?? 0),
          highestBidder: auction.highestBidder ?? auction.currentBidder ?? auction.bidder ?? address,
          auctionType: BigInt(auction.auctionType ?? 2),
          startingPrice: BigInt(auction.startingPrice),
          startingTime: BigInt(auction.startingTime),
          closingTime: BigInt(auction.closingTime),
          erc20Token: auction.erc20Token,
        }

        const receipt = await bid(BigInt(bidPayload?.nftId),
          bidPayload?.collectionAddress,
          ethers.parseEther(bidAmount),
          address,
          auctionStruct,
          BigInt(bidPayload?.nonce),
          bidPayload?.sign as `0x${string}`,
          overrides,
        )
        console.log("receipt", receipt)
      }
      const response = await apiCaller('POST', authRoutes.bids, payload, true)
      if (response?.success) {
        message.success(response?.message || 'Bid submitted successfully')
    setPlacedBidAmount(bidAmount)
    setIsPlaceBidOpen(false)
    setIsBidPlacedOpen(true)
        if (isBidsOpen) {
          await fetchBids(1, bidsOrder)
        }
      } else {
        message.error(response?.message || 'Failed to submit bid')
      }
    } catch (error: any) {
      console.error('❌ Failed to submit bid', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to submit bid'
      message.error(errorMessage)
    } finally {
      if (loadingMessage) {
        message.destroy(loadingMessage as any)
      }
    }
  }


  const handleBuyNow = () => {

    // get current nft details
    // call blockchain buy now hook
    
  }

  const handleCollect = () => {
    message.info('Collect feature coming soon')
  }

  const handleOfferConfirm = () => {
    setIsMakeOfferOpen(false)
    setIsOfferSubmittedOpen(true)
  }

  const displayName = currentNft?.name ?? name
  const displayOwner =
    currentNft?.createdBy?.name ||
    currentNft?.ownerName ||
    currentNft?.owner ||
    owner
  const profilePictureCollection = currentNft?.creator?.profilePicture
  const ownerAvatar = profilePictureCollection ? (
    <Avatar
      src={profilePictureCollection}
      size={36}
      className="!flex !items-center !justify-center !bg-[#1A1A2E]"
      style={{ width: 36, height: 36 }}
    />
  ) : (
    <Avatar
      size={36}
      className="!bg-[#1A1A2E] !flex !items-center !justify-center"
      style={{ width: '36px', height: '36px' }}
    >
      <span className="text-[#60A5FA] text-sm sm:text-base font-exo2">
        {displayOwner?.[0]?.toUpperCase() || 'U'}
      </span>
    </Avatar>
  )
  const displayPrice = currentNft?.price ?? currentPrice
  const displayUsd = currentUsd
  const displayDescription =
    currentNft?.description && currentNft.description.trim().length > 0
      ? currentNft.description
      : 'Born from grit, discipline, and hustle. The Spades inspire the pursuit of excellence.'
  const currentImage = currentNft?.imageUrl || currentNft?.image || null
  const displayCategory =
    currentNft?.category ||
    currentNft?.collectionCategory ||
    currentNft?.collection?.category ||
    'N/A'
  const lastUpdatedText = useMemo(() => {
    const updatedAt = currentNft?.updatedAt || currentNft?.lastUpdated
    if (!updatedAt) return '—'
    const date = new Date(updatedAt)
    if (Number.isNaN(date.getTime())) return '—'
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
  }, [currentNft])

  const baseAvaxPrice = useMemo(
    () => parseNumericValue(currentNft?.price ?? currentPrice),
    [currentNft?.price, currentPrice],
  )

  const baseUsdValue = useMemo(() => parseNumericValue(currentUsd), [currentUsd])

  const highestBidAmount = useMemo(() => {
    if (!bids.length) {
      return undefined
    }
    return bids.reduce<number | undefined>((max, bidEntry) => {
      const amount = parseNumericValue(bidEntry.price)
      if (amount === undefined) return max
      if (max === undefined) return amount
      return amount > max ? amount : max
    }, undefined)
  }, [bids])

  const enforcedMinBid = useMemo(() => {
    const fallback = baseAvaxPrice ?? 0
    const value = highestBidAmount ?? fallback
    return Number.isFinite(value) && value !== undefined ? value : 0
  }, [highestBidAmount, baseAvaxPrice])

  const formatBidUsdValue = useCallback(
    (avaxAmount?: number) => {
      if (
        !baseAvaxPrice ||
        !baseUsdValue ||
        !avaxAmount ||
        !Number.isFinite(avaxAmount) ||
        baseAvaxPrice === 0
      ) {
        return undefined
      }
      const perAvaxUsd = baseUsdValue / baseAvaxPrice
      if (!Number.isFinite(perAvaxUsd)) return undefined
      const usdValue = avaxAmount * perAvaxUsd
      return formatUsdAmount(usdValue)
    },
    [baseAvaxPrice, baseUsdValue],
  )
  
  // Get auctionType from API data, fallback to method prop for backward compatibility
  const auctionType = currentNft?.auctionType !== undefined
    ? currentNft.auctionType
    : (method === 'auction' ? 2 : method === 'fixed-rate' ? 1 : undefined)

  const auctionStartTime = currentNft?.startingTime
  const auctionEndTime = currentNft?.endingTime

  // Determine button visibility based on auctionType
  // 0 = None (only Make an Offer), 1 = Fixed Rate (only Buy Now), 2 = Auction (Bid Now + Make an Offer)
  const isAuction = auctionType === 2
  const isFixedRate = auctionType === 1
  const isNone = auctionType === 0 || auctionType === undefined

  const bidDisabledReason = useMemo(() => {
    if (!isAuction || hasAuctionEnded || isAuctionLive) {
      return undefined
    }
    if (!hasAuctionStarted && auctionStartTime) {
      const startDate = new Date(auctionStartTime)
      return `Auction starts on ${startDate.toLocaleString()}`
    }
    return 'Auction not live yet'
  }, [isAuction, hasAuctionEnded, isAuctionLive, hasAuctionStarted, auctionStartTime])

  useEffect(() => {
    if (!isAuction) {
      setAuctionTimerLabel('Auction Ends In')
      setAuctionTimerValue(timeLeft)
      setHasAuctionEnded(false)
      setHasAuctionStarted(false)
      setIsAuctionLive(false)
      return
    }
    if (!auctionStartTime && !auctionEndTime) {
      setAuctionTimerLabel('Auction Status')
      setAuctionTimerValue(timeLeft)
      setHasAuctionEnded(false)
      setHasAuctionStarted(true)
      setIsAuctionLive(true)
      return
    }
    const updateTimer = () => {
      const now = Date.now()
      if (auctionStartTime && now < auctionStartTime) {
        setAuctionTimerLabel('Auction Starts In')
        setAuctionTimerValue(formatDurationFromMs(auctionStartTime - now))
        setHasAuctionEnded(false)
        setHasAuctionStarted(false)
        setIsAuctionLive(false)
        return
      }
      if (auctionEndTime && now >= auctionEndTime) {
        setAuctionTimerLabel('Auction Status')
        setAuctionTimerValue('Ended')
        setHasAuctionEnded(true)
        setHasAuctionStarted(true)
        setIsAuctionLive(false)
        return
      }
      if (auctionEndTime) {
        setAuctionTimerLabel('Auction Ends In')
        setAuctionTimerValue(formatDurationFromMs(auctionEndTime - now))
      } else {
        setAuctionTimerLabel('Auction Status')
        setAuctionTimerValue('Live')
      }
      setHasAuctionEnded(false)
      setHasAuctionStarted(true)
      setIsAuctionLive(true)
    }
    updateTimer()
    const intervalId = window.setInterval(updateTimer, 1000)
    return () => {
      window.clearInterval(intervalId)
    }
  }, [isAuction, auctionStartTime, auctionEndTime, timeLeft])

  if (!currentNft && isLoadingDetails) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (!currentNft && !isLoadingDetails) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-white">
        NFT details not available.
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen font-exo2 mt-2 sm:mt-4 md:mt-6">
      <div className="w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Top section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          {/* Media */}
          <div className="relative rounded-xl sm:rounded-2xl">
            <div className={`relative h-[280px] sm:h-[350px] lg:h-[385px] rounded-xl overflow-hidden flex items-center justify-center ${currentImage ? 'bg-[#0A0D1F]' : 'bg-gradient-to-b from-[#4F01E6] to-[#25016E]'}`}>
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt={displayName}
                  fill
                  className="object-contain rounded-xl"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute left-[15%] top-1/2 -translate-y-1/2 z-10 opacity-90">
                  <Image 
                    src={spadesImage} 
                    alt="21" 
                    width={140} 
                    height={140} 
                    className="sm:w-[180px] sm:h-[180px] lg:w-[200px] lg:h-[200px] object-contain pointer-events-none select-none drop-shadow-2xl" 
                  />
                </div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <Image 
                    src={spadesImage} 
                    alt="21" 
                    width={180} 
                    height={180} 
                    className="sm:w-[220px] sm:h-[220px] lg:w-[260px] lg:h-[260px] object-contain pointer-events-none select-none drop-shadow-2xl" 
                  />
                </div>
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
              )}
            </div>
          </div>

          {/* Details */}
          <div className="p-4 sm:p-6 font-exo2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div className="flex items-center gap-3">
                {ownerAvatar}
                <div className="flex flex-col">
                  <span className="text-white/60 text-xs sm:text-sm">Owner</span>
                  <button className="text-[#7E6BEF] text-sm font-semibold hover:underline text-left">
                    {displayOwner}
                  </button>
                </div>
                <button className="ml-2 flex items-center justify-center w-9 h-9 rounded-full border border-white/15 bg-white/5 text-white hover:border-white/40 transition">
                  <MessageSquareText className="w-4 h-4" />
                </button>
              </div>
              <button className="flex items-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-full border border-white/15 hover:border-white/40 transition">
                <Share className="w-4 h-4" />
                Share
              </button>
            </div>

            <h1 className="text-white text-xl sm:text-2xl lg:text-[32px] font-exo2 font-[600] mb-2">{displayName}</h1>

            <p className="text-[#A3AED0] max-w-full sm:max-w-[400px] text-xs sm:text-sm font-exo2 leading-relaxed mb-6 sm:mb-10">
              {displayDescription}
            </p>

            {/* Price and CTA */}
            <div className="mt-6 sm:mt-12 lg:mt-24">
              <p className="text-white font-exo2 text-sm font-semibold flex items-center gap-2">
                {isAuction ? (
                  <>
                    <span>Current Bid</span>
                    {isAuctionLive ? (
                      <span className="inline-flex items-center gap-1 text-[#33E030] text-[11px] sm:text-xs font-semibold uppercase tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#33E030] animate-pulse" />
                        Live
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/40 text-[11px] sm:text-xs font-semibold uppercase tracking-wide transition-all duration-200 hover:bg-[#F97316]/15 hover:border-[#F97316]/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
                        Scheduled
                      </span>
                    )}
                  </>
                ) : (
                  'Current Price'
                )}
              </p>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Image src={bidIcon} alt="AVAX icon" className="w-5 h-5 object-contain" />
                  <span className="text-white font-exo2 text-2xl font-bold">{displayPrice}</span>
                </div>
                <span className="text-white/40 text-2xl font-bold">•</span>
                <span className="text-[#7E6BEF] font-exo2 text-2xl font-semibold">{displayUsd}</span>
              </div>

              {/* Conditional Buttons based on auctionType */}
              {/* 0 = None (only Make an Offer), 1 = Fixed Rate (only Buy Now), 2 = Auction (Bid Now + Make an Offer) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-2">
                {isAuction ? (
                  // Auction (auctionType = 2): Bid Now + Make an Offer
                  <>
                    {hasAuctionEnded ? (
                      <button
                        onClick={handleCollect}
                        className="px-6 sm:px-10 py-2 sm:py-2.5 w-full sm:min-w-[200px] lg:min-w-[200px] rounded-full bg-gradient-to-r from-[#4F01E6] to-[#25016E] text-white font-exo2 font-semibold hover:opacity-90 transition text-sm sm:text-base"
                      >
                        Collect
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsPlaceBidOpen(true)}
                        disabled={!isAuctionLive}
                        title={bidDisabledReason}
                        className="px-6 sm:px-10 py-2 sm:py-2.5 w-full sm:min-w-[200px] lg:min-w-[200px] rounded-full bg-gradient-to-r from-[#4F01E6] to-[#25016E] text-white font-exo2 font-semibold hover:opacity-90 transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Bid Now
                      </button>
                    )}
                    <button
                      onClick={() => setIsMakeOfferOpen(true)}
                      className="px-5 py-2.5 justify-center items-center  rounded-full w-full sm:min-w-[200px] lg:min-w-[200px] border border-gray-700 bg-[#0A0D1F] text-white hover:bg-white/5 transition flex items-center gap-2 font-exo2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Make an Offer
                    </button>
                  </>
                ) : isFixedRate ? (
                  // Fixed Rate (auctionType = 1): Only Buy Now button
                  <button onClick={handleBuyNow}
                   className="px-6 sm:px-10 py-2 sm:py-2.5 w-full sm:w-[200px] lg:w-[300px] rounded-full bg-gradient-to-r from-[#4F01E6] to-[#25016E] text-white font-exo2 font-semibold hover:opacity-90 transition text-sm sm:text-base">
                    Buy Now
                  </button>
                ) : (
                  // None (auctionType = 0 or undefined): Only Make an Offer button
                  <button
                    onClick={() => setIsMakeOfferOpen(true)}
                    className="px-5 py-2.5 justify-center items-center rounded-full w-full sm:min-w-[200px] lg:min-w-[200px] border border-gray-700 bg-[#0A0D1F] text-white hover:bg-white/5 transition flex items-center gap-2 font-exo2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Make an Offer
                  </button>
                )}
              </div>

              {isAuction && (
                <div className="text-xs sm:text-sm font-exo2 text-gray-400 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 font-semibold">
                    {auctionTimerLabel} 
                    {/* {auctionTimerLabel === 'Auction Starts In' && !isAuctionLive && !hasAuctionEnded && ( */}
                      <span className="mx-1 w-1.5 h-1.5 rounded-full bg-[#4F01E6] animate-ping" />
                    {/* )} */}
                  </span>
                  <span className={`text-white font-mono text-sm sm:text-base transition-all duration-200 ${!isAuctionLive && auctionTimerLabel === 'Auction Starts In' ? 'animate-pulse' : ''}`}>
                   - {auctionTimerValue || '—'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conditional Accordions based on auctionType */}
        <div className={`grid grid-cols-1 ${isAuction ? 'md:grid-cols-2' : ''} gap-3 sm:gap-4 mb-6 sm:mb-8`}>
          <Accordion
            key="token-detail"
            id="token-detail"
            title={
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#7E6BEF]/15 text-[#7E6BEF]">
                  <Image src={bidIcon} alt="detail" className="w-3.5 h-3.5 object-contain" />
                </span>
                <span>Token Detail</span>
              </div>
            }
            isOpen={isTokenDetailOpen}
            onToggle={() => setIsTokenDetailOpen(!isTokenDetailOpen)}
          >
            <div className="space-y-6 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#A3AED0]">Creator</span>
                <span className="text-white font-semibold">{displayOwner}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#A3AED0]">Token Standard</span>
                <span className="text-white font-semibold">ERC-721</span>
              </div>
              {/* <div className="flex items-center justify-between">
                <span className="text-[#A3AED0]">Blockchain</span>
                <span className="text-white font-semibold">Avalanche</span>
              </div> */}
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[#A3AED0]">Last Updated</span>
                <span className="text-white font-semibold">{lastUpdatedText}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#A3AED0]">Category</span>
                <span className="text-white font-semibold capitalize">{displayCategory}</span>
              </div>
              {/* <div className="flex items-center justify-between">
                <span className="text-[#A3AED0]">Creator Fee</span>
                <span className="text-[#7E6BEF] font-semibold">10%</span>
              </div> */}
            </div>
          </Accordion>

          {/* Bids Accordion - Only for Auction (auctionType = 2) */}
          {isAuction && (
            <Accordion 
              key="bids" 
              id="bids" 
              title={
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center">
                    <Image src={bidIcon} alt="Bids icon" className="w-4 h-4 object-contain" />
                  </div>
                  <span className="text-base font-semibold">Bids</span>
                </div>
              }
              isOpen={isBidsOpen}
              onToggle={() => setIsBidsOpen((prev) => !prev)}
            >
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="relative inline-flex items-center rounded-full border border-white/10 px-4 py-1.5">
                    <select
                      value={bidsOrder}
                      onChange={(event) => setBidsOrder(event.target.value as BidOrder)}
                      className="bg-transparent pr-6 text-sm font-semibold text-white focus:outline-none appearance-none"
                    >
                      <option value="high">High to Low</option>
                      <option value="low">Low to High</option>
                      <option value="desc">Newest</option>
                      <option value="asc">Oldest</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 pointer-events-none" />
                  </div>
                  {bidsLoading && bids.length === 0 && (
                    <span className="text-xs text-gray-400 font-exo2">Fetching bids…</span>
                  )}
                </div>

                {bids.length === 0 && !bidsLoading ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center text-gray-400 text-sm font-exo2 border border-dashed border-white/10 rounded-xl">
                    <p>No bids yet. Be the first to place a bid!</p>
                  </div>
                ) : (
                  <div className="max-h-72 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                    {bids.map((bid) => {
                      const avaxAmount = parseNumericValue(bid.price)
                      const usdText = formatBidUsdValue(avaxAmount)
                      return (
                        <div
                          key={bid._id || bid.id}
                          className="px-5 py-4 flex items-center gap-4 border-b border-white/10 last:border-b-0"
                        >
                          <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                            <Image src={bidIcon} alt="Bid icon" className="w-4 h-4 object-contain" />
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-base font-semibold text-white">
                              <span>{formatAvaxAmount(avaxAmount)}</span>
                              {usdText && (
                                <span className="text-[#7E6BEF] text-sm">• ${usdText}</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 font-exo2">
                              by {bid.user?.name || 'NA'}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                    {bidsLoading && bids.length > 0 && (
                      <div className="text-center text-sm text-gray-400">Loading more bids…</div>
                    )}
                    {bidsHasMore && (
                      <div className="text-center">
                        <button
                          onClick={() => fetchBids(bidsPage + 1, bidsOrder)}
                          disabled={bidsLoadingMore}
                          className="px-4 py-2 text-sm font-exo2 text-white border border-white/20 rounded-full hover:bg-white/5 transition disabled:opacity-60"
                        >
                          {bidsLoadingMore ? 'Loading…' : 'Load more bids'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Accordion>
          )}
        </div>

        {/* More from this collection */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
            <h2 className="text-white font-exo2 text-base sm:text-lg">More from this collection</h2>
            <button className="px-6 sm:px-10 py-2 w-full sm:w-auto sm:max-w-[300px] text-xs sm:text-sm text-white border border-white/10 rounded-full hover:bg-[#252540] transition">
              Explore all
            </button>
          </div>
          {relatedNfts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedNfts.slice(0, 8).map((nft: CollectionNFT, index: number) => {
                const targetCollectionId = currentNft?.collectionId || collectionId
                const targetId = nft._id || nft.id || nft.nftId || `nft-${index}`
                const href = targetId
                  ? targetCollectionId
                    ? `/marketplace/nft/${targetId}?collectionId=${targetCollectionId}`
                    : `/marketplace/nft/${targetId}`
                  : '/marketplace/nft'
                return (
                  <MiniCard
                    key={`${targetId}-${index}`}
                    nft={nft}
                    onClick={() => router.push(href)}
                  />
                )
              })}
          </div>
          ) : (
            <div className="text-gray-400 text-sm font-exo2">No other NFTs found in this collection.</div>
          )}
        </div>
      </div>

      {/* Modals */}
      <PlaceBidModal
        isOpen={isPlaceBidOpen}
        onClose={() => setIsPlaceBidOpen(false)}
        onConfirm={handleBidConfirm}
        nftName={displayName}
        nftImage={currentImage || undefined}
        minBidAmount={enforcedMinBid}
      />
      <MakeOfferModal
        isOpen={isMakeOfferOpen}
        onClose={() => setIsMakeOfferOpen(false)}
        onConfirm={handleOfferConfirm}
        nftName={displayName}
      />
      <BidPlacedSuccessModal
        isOpen={isBidPlacedOpen}
        onClose={() => setIsBidPlacedOpen(false)}
        bidAmount={placedBidAmount}
        nftName={displayName}
        nftImage={currentImage || undefined}
      />
      <OfferSubmittedModal
        isOpen={isOfferSubmittedOpen}
        onClose={() => setIsOfferSubmittedOpen(false)}
        offerAmount="77.9"
        nftName={displayName}
      />
    </div>
  )
}
