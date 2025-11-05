
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
        className="relative overflow-hidden transition-all hover:transform hover:scale-105 cursor-pointer"
        style={{
          width: '260px',
          height: '380px',
          borderRadius: '25px',
          border: '1.1px solid rgba(242, 242, 242, 0.5)',
          background: '#FFFFFF'
        }}
      >
        {/* NFT Image Area with Radial Gradient */}
        <div
          className="relative flex items-center justify-center"
          style={{
            width: '240px',
            height: '216px',
            borderRadius: '25px',
            background: 'radial-gradient(100% 100% at 50% 0%, #4F01E6 0%, #020019 100%)',
            position: 'absolute',
            top: '7px',
            left: '8px'
          }}
        >
          {/* Golden Spade with "21" */}
          <img src="/assets/card-icon.png" alt="Discover Collections" width={150} height={180} className="object-contain" />
        </div>

        {/* Card Details Section */}
        <div className="absolute left-0 right-0 px-4 pt-3 pb-4" style={{ top: '223px' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-4 h-4 flex items-center justify-center">
              <img src="/assets/verify-tick-icon.png" alt="Verified" width={16} height={16} />
            </div>
            <div className="flex justify-between w-full">
              <span className="text-gray-700 text-xs font-medium">{creator}</span>
              <span className="text-gray-700 text-xs font-medium">{edition}</span>
            </div>
          </div>

          <h3 className="text-gray-900 text-base font-bold mb-3">{title}</h3>
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