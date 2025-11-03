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
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl overflow-hidden border-4 border-white hover:border-purple-400 transition-all hover:transform hover:scale-105 cursor-pointer group">
      <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 aspect-square p-8 flex items-center justify-center">
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors">
          <Heart className="w-5 h-5 text-white" />
        </button>

        <div className="relative">
          <div className="absolute inset-0 border-2 border-blue-400 rounded-lg" style={{ width: '180px', height: '220px' }} />
          <svg viewBox="0 0 200 240" className="w-48 h-60">
            <defs>
              <linearGradient id="spadeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#FCD34D', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#F59E0B', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path
              d="M 100 20 Q 100 80 70 120 Q 50 140 50 160 Q 50 180 70 190 L 80 190 Q 80 200 90 210 L 110 210 Q 120 200 120 190 L 130 190 Q 150 180 150 160 Q 150 140 130 120 Q 100 80 100 20 Z"
              fill="url(#spadeGradient)"
              stroke="#FCD34D"
              strokeWidth="3"
            />
          </svg>
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-blue-400 text-sm font-mono bg-blue-500/20 px-3 py-1 rounded">
            147 × 179
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {verified && (
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <span className="text-gray-400 text-sm">{creator}</span>
          </div>
          <span className="text-gray-500 text-sm">{edition}</span>
        </div>

        <h3 className="text-white text-xl font-bold mb-4">{title}</h3>

        <button className="w-full bg-purple-700 hover:bg-purple-600 text-white font-semibold py-3 rounded-full transition-all flex items-center justify-center gap-2">
          <span className="text-lg">💎</span>
          <span>{price}</span>
        </button>
      </div>
    </div>
  );
}
