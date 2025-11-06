import { ArrowRight } from 'lucide-react';

export default function DiscoverCollections() {
  return (
    <section 
      className="py-20 relative overflow-hidden min-h-screen"
      style={{
        // background: '#000000',
        backgroundImage: 'url("/assets/card-bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        // backgroundAttachment: 'fixed'
      }}
    >
      {/* Purple glowing spade icon at top */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="relative">
          <div className="relative flex items-center justify-center w-16 h-16">
            <span className="text-white text-5xl font-bold">♠</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-20">
        {/* Title Section */}
        <div className="text-center mb-12 mt-10">
          <h2 className="gold-gradient-text font-audiowide font-bold text-4xl md:text-5xl mb-6 text-center">
            DISCOVER COLLECTIONS
          </h2>
          <p className="text-[#B8BAE5] text-lg font-exo2 font-medium max-w-2xl mx-auto text-center leading-relaxed">
            Curate your world, Explore curated collections and rare finds<br />
            that define your digital identity.
          </p>
        </div>

        {/* NFT Card */}
        <div className="flex justify-center mb-12">
          <img src="/assets/card-bg.png" alt="Background" className="absolute z-0" />
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
                <span className="text-gray-700 text-xs font-medium">21Spades NFTs</span>
              </div>

              <h3 className="text-gray-900 text-base font-bold mb-3">Aether Guardian</h3>
              <hr className="w-full border-gray-200 my-3" />

              {/* Floor Price Section */}
              <div className="flex items-center justify-between">
                <div className="px-2.5 py-1" >
                  <span className="text-purple-700 text-xs font-semibold">Floor Price</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-red-500 text-base">▲</span>
                  <span className="text-gray-900 text-base font-bold">0.01 AVAX</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button 
            className="px-6 py-3 text-white rounded-full font-semibold inline-flex items-center gap-2 transition-all" 
            style={{ background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)' }}
          >
            Avalanche
            <span className="text-white">▼</span>
          </button>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all border border-black/10">
            <span>View All</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
