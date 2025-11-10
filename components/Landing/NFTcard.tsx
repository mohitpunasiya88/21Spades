
import { ArrowRight, Heart } from 'lucide-react';
import { useState } from 'react';

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
    <div className="flex justify-center mb-12 z-10">
      <div
        className="relative overflow-hidden transition-all hover:transform hover:scale-105 cursor-pointer w-full max-w-[300px] rounded-[25px] bg-white"
        style={{ border: '1.1px solid rgba(242, 242, 242, 0.5)' }}
      >
        {/* NFT Image Area with Radial Gradient (responsive aspect box) */}
        <div className="relative mx-2 mt-2 rounded-[25px] overflow-hidden"
          style={{
            background: 'radial-gradient(100% 100% at 50% 0%, #4F01E6 0%, #020019 100%)'
          }}
        >
          {/* Aspect ratio spacer (approx 0.9 of width) */}
          <div style={{ paddingTop: '90%' }} />
          {/* Centered content overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img src="/assets/card-icon.png" alt="Discover Collections" className="object-contain max-w-[70%] max-h-[80%]" />
          </div>
        </div>

        {/* Card Details Section (normal flow) */}
        <div className="px-2 pt-2 pb-2">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-4 h-4 flex items-center justify-center">
              <img src="/assets/verify-tick-icon.png" alt="Verified" width={16} height={16} />
            </div>
            <div className="flex justify-between w-full">
              <span className="text-[#848484] text-[10px] md:text-[12px] font-medium">{creator}</span>
              <span className="text-[#848484] text-[10px] md:text-[12px] font-medium">{edition}</span>
            </div>
          </div>

          <p className="text-[14px] md:text-xl text-center md:text-left text-[#000000] text-base font-bold mb-3">{title}</p>
          <hr className="w-full border-gray-200 my-3" />

          {/* Floor Price Section */}
          <button className="w-full rounded-full text-white font-semibold py-2.5 flex items-center justify-center gap-2" style={{ background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)' }}>
            <span className="text-xs">💎</span>
            <span className="text-xs md:text-sm">{price}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default NFTCard;