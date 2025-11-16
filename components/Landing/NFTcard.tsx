
import { ArrowRight, Heart } from 'lucide-react';
import { useState } from 'react';
import { CiHeart } from 'react-icons/ci';

interface NFTCardProps {
  title: string;
  creator: string;
  price: string;
  edition: string;
  category: string;
  verified?: boolean;
}

function NFTCard({ title, creator, price, edition, verified = true }: NFTCardProps) {
  return (
    <div
      className="overflow-hidden rounded-[10px] bg-white shadow-lg w-full sm:w-[280px] md:w-[300px] max-w-[300px]   transition-all hover:scale-[1.03] cursor-pointer z-10"
    >
      {/* NFT Image Area */}
      <div
        className="w-full h-[160px] sm:h-[280px] md:h-[300px] rounded-t-[10px] flex items-center justify-center relative"
        style={{
          background: 'radial-gradient(100% 100% at 50% 0%, #4F01E6 0%, #020019 100%)',
        }}
      >
        <img
          src="/assets/card-icon.png"
          alt="NFT"
          className="object-contain w-[100px] sm:w-[150px] md:w-[180px]"
        />

        {/* Heart Icon */}
        <button className="absolute top-4 right-4 p-1 bg-[#ffffff2e] rounded-full backdrop-blur-sm cursor-pointer">
          <CiHeart className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="px-3 py-3 sm:px-4 sm:py-4">
        <div className="flex items-center gap-1.5 mb-2">
          <img src="/assets/verify-tick-icon.png" className="w-4 h-4" />
          <span className="text-gray-700 text-xs font-medium">21Spades NFTs</span>
        </div>

        <h3 className="text-gray-900 font-bold text-base sm:text-lg mb-2 sm:mb-3">Aether Guardian</h3>

        <hr className="border-gray-300 mb-2 sm:mb-3" />

        {/* Floor Price */}
        <div className="flex items-center justify-between">
          <span className="text-[#4A01D9] text-xs md:text-sm font-semibold">Floor Price</span>

          <div className="flex items-center gap-1">
            <span className="text-red-500 text-lg">▲</span>
            <span className="text-[#000000] font-semibold text-xs md:text-sm">0.01 AVAX</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NFTCard;