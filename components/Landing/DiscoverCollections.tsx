import { ArrowRight } from 'lucide-react';

export default function DiscoverCollections() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-950 to-gray-900 relative">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-white text-4xl">♠</div>

      <div className="container mx-auto px-4 text-center">
        <h2 className="text-5xl md:text-6xl font-bold mb-6 text-yellow-400" style={{ fontFamily: 'system-ui, sans-serif', letterSpacing: '0.05em' }}>
          DISCOVER COLLECTIONS
        </h2>
        <p className="text-gray-400 text-lg mb-12">
          Lorem ipsum dolor sit amet consectetur. Malesuada<br />
          venenatis morbi nibh libero
        </p>

        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl overflow-hidden border-4 border-white hover:border-purple-400 transition-all hover:transform hover:scale-105 cursor-pointer">
            <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 aspect-square p-12 flex items-center justify-center">
              <div className="relative">
                <svg viewBox="0 0 200 240" className="w-64 h-80">
                  <defs>
                    <linearGradient id="collectionSpadeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#FCD34D', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#F59E0B', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 100 20 Q 100 80 70 120 Q 50 140 50 160 Q 50 180 70 190 L 80 190 Q 80 200 90 210 L 110 210 Q 120 200 120 190 L 130 190 Q 150 180 150 160 Q 150 140 130 120 Q 100 80 100 20 Z"
                    fill="url(#collectionSpadeGradient)"
                    stroke="#FCD34D"
                    strokeWidth="4"
                  />
                  <text x="100" y="130" textAnchor="middle" fill="white" fontSize="60" fontWeight="bold" fontFamily="system-ui">
                    21
                  </text>
                </svg>
              </div>
            </div>

            <div className="p-6 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-600 text-sm font-medium">21Spades NFTs</span>
              </div>

              <h3 className="text-gray-900 text-2xl font-bold mb-4">Aether Guardian</h3>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <div className="text-purple-700 text-sm font-semibold mb-1">Floor Price</div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 text-xl">🔺</span>
                    <span className="text-gray-900 text-lg font-bold">0.01 AVAX</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-12">
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
    </section>
  );
}
