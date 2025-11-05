import { Heart } from 'lucide-react';

interface NFTCardProps {
  title: string;
  creator: string;
  price: string;
  edition: string;
  verified?: boolean;
}

export default function NFTCard({ title, creator, price, edition, verified = true }: NFTCardProps) {
  return (
    <div className="rounded-[20px] overflow-hidden bg-white/5 border border-white/80 shadow-[0_2px_0_#FFFFFF] hover:shadow-[0_2px_0_#8B5CF6] transition-all hover:scale-[1.015] cursor-pointer max-w-[300px] md:max-w-[320px] mx-auto">
      {/* Image area */}
      <div className="relative aspect-square p-2 bg-gradient-to-b from-[#3F1AAE] to-[#220B64]">
        <div className="w-full h-full rounded-[12px] overflow-hidden bg-gradient-to-b from-[#6F2BFF] to-[#240A66] flex items-center justify-center">
          <img src="/assets/card-icon.png" alt="NFT" className="w-2/3 h-2/3 object-contain drop-shadow-[0_8px_22px_rgba(0,0,0,0.35)]" />
        </div>
        {/* heart icon */}
        <button className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <Heart className="w-3.5 h-3.5 text-white" />
        </button>
      </div>

      {/* Details */}
      <div className="bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {verified && (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[9px]">✓</span>
            )}
            <span className="text-gray-500 text-[11px] md:text-xs">{creator}</span>
          </div>
          <span className="text-gray-400 text-[11px] md:text-xs">{edition}</span>
        </div>

        <h3 className="text-gray-900 text-sm md:text-base font-semibold mb-3">{title}</h3>

        {/* Divider */}
        <div className="h-px w-full bg-gray-200 mb-3" />

        {/* Price button */}
        <button className="w-full rounded-full text-white font-semibold py-2.5 flex items-center justify-center gap-2" style={{ background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)' }}>
          <span className="text-xs">💎</span>
          <span className="text-xs md:text-sm">{price}</span>
        </button>
      </div>
    </div>
  );
}
