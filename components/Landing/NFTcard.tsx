
import { ArrowRight, Heart } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { CiHeart } from 'react-icons/ci';
import { useRouter } from 'next/navigation';
import bidIcon from '@/components/assets/image.png';

interface NFTCardProps {
  title: string;
  creator: string;
  price: string;
  edition: string;
  category: string;
  verified?: boolean;
  imageUrl?: string;
  nftId?: string;
  collectionId?: string;
}

function NFTCard({ title, creator, price, edition, verified = true, imageUrl, nftId, collectionId }: NFTCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    if (nftId) {
      if (collectionId) {
        router.push(`/marketplace/nft/${nftId}?collectionId=${collectionId}`);
      } else {
        router.push(`/marketplace/nft/${nftId}`);
      }
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="overflow-hidden rounded-[10px] bg-white shadow-lg w-full transition-all hover:scale-[1.03] cursor-pointer z-10"
    >
      {/* NFT Image Area */}
      <div
        className="w-full h-[160px] sm:h-[280px] md:h-[300px] rounded-t-[10px] flex items-center justify-center relative"
        style={{
          background: 'radial-gradient(100% 100% at 50% 0%, #4F01E6 0%, #020019 100%)',
        }}
      >
        <img
          src={imageUrl || "/assets/card-icon.png"}
          alt={title || "NFT"}
          className="object-contain w-[100px] sm:w-[150px] md:w-[180px]"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/card-icon.png';
          }}
        />

        {/* Heart Icon */}
        <button 
          onClick={(e) => e.stopPropagation()}
          className="absolute top-4 right-4 p-1 bg-[#ffffff2e] rounded-full backdrop-blur-sm cursor-pointer"
        >
          <CiHeart className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="px-3 py-3 sm:px-4 sm:py-4">
        <div className="flex items-center gap-1.5 mb-2">
          {verified && <img src="/assets/verify-tick-icon.png" className="w-4 h-4" />}
          <span className="text-gray-700 text-xs font-medium">{creator}</span>
        </div>

        <h3 className="text-gray-900 font-bold text-base sm:text-lg mb-2 sm:mb-3">{title}</h3>

        <hr className="border-gray-300 mb-2 sm:mb-3" />

        {/* Floor Price */}
        <div className="flex items-center justify-between">
          <span className="text-[#4A01D9] text-xs md:text-sm font-semibold">Floor Price</span>

          <div className="flex items-center gap-1">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg">
              <Image src={bidIcon} alt="detail" width={14} height={14} className="w-3.5 h-3.5 object-contain" />
            </span>
            <span className="text-[#000000] font-semibold text-xs sm:text-sm">{price}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NFTCard;