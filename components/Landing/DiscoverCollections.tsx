import { ArrowRight } from 'lucide-react';
import { BsSuitSpade } from 'react-icons/bs';
import { CiHeart } from 'react-icons/ci';
import { PiArrowBendUpRightBold } from 'react-icons/pi';
import { RiArrowDropDownLine } from 'react-icons/ri';

export default function DiscoverCollections() {
  return (
    <section
      className="mt-10 flex flex-col justify-center items-center overflow-hidden"
      style={{
        backgroundImage: 'url("/assets/card-bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >

      {/* Top glowing spade icon */}
      <div className="flex justify-center items-center mb-8">
          <BsSuitSpade className="text-white w-6 h-6" />
        </div>

      <div className="mx-auto px-4 relative z-20">

        {/* Title Section */}
        <div className="text-center mb-10">
          <h2 className="gold-gradient-text font-audiowide font-[400] text-[32px] sm:text-[40px] md:text-[48px] mb-4">
            Discover Collection
          </h2>

          <p className="text-[#B8BAE5] text-base sm:text-lg font-exo2 font-medium max-w-2xl mx-auto leading-relaxed">
            Curate your world, Explore curated collections and rare finds<br />
            that define your digital identity.
          </p>
        </div>

        {/* Chain Selector Dropdown */}
        <div className="flex justify-center md:justify-end mb-6 pr-2 sm:pr-4">
          {/* <button
            className="
          relative px-8 py-2 rounded-full font-exo2 text-white inline-flex items-center gap-2
          bg-[#111327] border border-white/10
          shadow-[0px_0px_8px_rgba(255,255,255,0.05)_inset,0px_0px_12px_rgba(0,0,0,0.35)]
          backdrop-blur-md transition-all duration-200
          hover:shadow-[0px_0px_12px_rgba(255,255,255,0.08)_inset,0px_0px_14px_rgba(0,0,0,0.45)]
        "
          >
            Avalanche
            <RiArrowDropDownLine className="w-5 h-5 text-white" />
          </button> */}
        </div>

        {/* NFT CARDS GRID with Background */}
        <div className="relative w-full">
          {/* Background Image */}
          <div className="absolute inset-0 flex items-center justify-start pointer-events-none opacity-20 z-0 left-[-20%]">
            <img src="/assets/card-icon.png" alt="Background" className="left-0 translate-x-[-50%] rotate-[90deg] object-contain w-[75%] h-[75%]" />
          </div>
          
          {/* Cards Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center gap-6 sm:gap-8">
          
          {/* Card Component Loop */}
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="overflow-hidden rounded-[10px] bg-white shadow-lg w-full sm:w-[280px] md:w-[300px] max-w-[300px] transition-all hover:scale-[1.03] cursor-pointer"
            >
              {/* NFT Image Area */}
              <div
                className="w-full h-[200px] sm:h-[240px] md:h-[280px] rounded-t-[10px] flex items-center justify-center relative"
                style={{
                  background: 'radial-gradient(100% 100% at 50% 0%, #4F01E6 0%, #020019 100%)',
                }}
              >
                <img
                  src="/assets/card-icon.png"
                  alt="NFT"
                  className="object-contain w-[120px] sm:w-[140px] md:w-[150px]"
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
                  <span className="text-[#4A01D9] text-xs sm:text-sm font-semibold">Floor Price</span>

                  <div className="flex items-center gap-1">
                    <span className="text-red-500 text-base sm:text-lg">▲</span>
                    <span className="text-[#000000] font-semibold text-xs sm:text-sm">0.01 AVAX</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>

          <div className="absolute inset-0 flex items-center justify-end pointer-events-none opacity-20 z-0 right-[-20%]">
            <img src="/assets/card-icon.png" alt="Background" className="right-0 translate-x-[50%] rotate-[-90deg] object-contain w-[75%] h-[75%]" />
          </div>
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-14">
          <button
            className="relative px-12 py-2 w-[220px] text-white rounded-full font-exo2 inline-flex items-center justify-center gap-3 text-lg hover:scale-105"
            style={{
              background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)',
            }}
          >
            View All
            <PiArrowBendUpRightBold className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>

  );
}
