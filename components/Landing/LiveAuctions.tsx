import { ArrowRight } from 'lucide-react';

export default function LiveAuctions() {
  const auctions = [
    { title: 'Aether Guardian', creator: '21Spades NFTs', price: '3.5 ETH', edition: '1 of 321', timeLeft: '3h 50m 2s left' },
    { title: 'Aether Guardian', creator: '21Spades NFTs', price: '3.5 ETH', edition: '1 of 321', timeLeft: '3h 50m 2s left' },
    { title: 'Aether Guardian', creator: '21Spades NFTs', price: '3.5 ETH', edition: '1 of 321', timeLeft: '3h 50m 2s left' },
    { title: 'Aether Guardian', creator: '21Spades NFTs', price: '3.5 ETH', edition: '1 of 321', timeLeft: '3h 50m 2s left' }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-950 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-white text-4xl z-10">♠</div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-yellow-400" style={{ fontFamily: 'system-ui, sans-serif', letterSpacing: '0.05em' }}>
              Live
            </h2>
            <p className="text-gray-400 text-lg">
              Discover a curated collection of unique digital assets<br />
              and rare collectibles from top artists.
            </p>
          </div>

          <div className="flex gap-4">
            <button className="px-6 py-3 bg-purple-700 text-white rounded-full font-medium hover:bg-purple-600 transition-all">
              Avalanche
              <span className="ml-2">▼</span>
            </button>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-all">
              <span>View All</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-950 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-950 to-transparent z-10" />

          <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4" style={{ scrollbarWidth: 'none' }}>
            {auctions.map((auction, index) => (
              <div key={index} className="flex-shrink-0 w-80 bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl overflow-hidden border-4 border-white hover:border-purple-400 transition-all hover:transform hover:scale-105 cursor-pointer">
                <div className="relative">
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Live Bid
                  </div>
                  <div className="absolute top-4 right-4 text-white text-sm bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                    {auction.timeLeft}
                  </div>

                  <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 aspect-square p-8 flex items-center justify-center">
                    <svg viewBox="0 0 200 240" className="w-48 h-60">
                      <defs>
                        <linearGradient id={`spadeGradient${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#FCD34D', stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: '#F59E0B', stopOpacity: 1 }} />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 100 20 Q 100 80 70 120 Q 50 140 50 160 Q 50 180 70 190 L 80 190 Q 80 200 90 210 L 110 210 Q 120 200 120 190 L 130 190 Q 150 180 150 160 Q 150 140 130 120 Q 100 80 100 20 Z"
                        fill={`url(#spadeGradient${index})`}
                        stroke="#FCD34D"
                        strokeWidth="3"
                      />
                    </svg>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-400 text-sm">{auction.creator}</span>
                    </div>
                    <span className="text-gray-500 text-sm">{auction.edition}</span>
                  </div>

                  <h3 className="text-white text-xl font-bold mb-4">{auction.title}</h3>

                  <button className="w-full bg-purple-700 hover:bg-purple-600 text-white font-semibold py-3 rounded-full transition-all flex items-center justify-center gap-2">
                    <span className="text-lg">💎</span>
                    <span>{auction.price}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
