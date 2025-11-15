'use client'

import { useState } from 'react'
import PlaceBidModal from '@/components/Common/PlaceBidModal'

export default function PlaceBidPage() {
  const [isModalOpen, setIsModalOpen] = useState(true)

  return (
    <div className="min-h-screen bg-[#0F0F23] flex items-center justify-center">
      <PlaceBidModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        minBid={47.9}
        balance={124}
        balanceUsd={150.6}
      />
      
      {/* Show button to reopen modal if closed */}
      {!isModalOpen && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-[#4F01E6] to-[#25016E] text-white font-exo2 font-semibold hover:opacity-90 transition"
        >
          Open Place Bid Modal
        </button>
      )}
    </div>
  )
}

