"use client";

import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function LiveAuctions() {
  const auctions = [
    { title: 'Aether Guardian', creator: '21Spades NFTs', price: '3.5 ETH', edition: '1 of 321', timeLeft: '3h 50m 2s left' },
    { title: 'Aether Guardian', creator: '21Spades NFTs', price: '3.5 ETH', edition: '1 of 321', timeLeft: '3h 50m 2s left' },
    { title: 'Aether Guardian', creator: '21Spades NFTs', price: '3.5 ETH', edition: '1 of 321', timeLeft: '3h 50m 2s left' },
    { title: 'Aether Guardian', creator: '21Spades NFTs', price: '3.5 ETH', edition: '1 of 321', timeLeft: '3h 50m 2s left' }
  ];

  // Auto-scroll state for horizontal carousel
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Duplicate auctions for seamless infinite scroll effect
  const duplicatedAuctions = [...auctions, ...auctions, ...auctions];

  useEffect(() => {
    let animationFrameId: number;
    const speed = 0.8; // pixels per frame

    const tick = () => {
      const el = scrollerRef.current;
      if (el && !isPaused && el.scrollWidth > el.clientWidth) {
        const currentScroll = el.scrollLeft;
        const maxScroll = el.scrollWidth - el.clientWidth;

        // Check if we've reached the end or start
        if (currentScroll >= maxScroll - 1) {
          setDirection(-1);
        } else if (currentScroll <= 1) {
          setDirection(1);
        }

        // Only scroll if we have scrollable content
        if (maxScroll > 0) {
          el.scrollLeft += speed * direction;
        }
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(tick);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPaused, direction]);

  return (
    <section className="py-5 mb-5 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header area with centered content and responsive action buttons */}
        <div className="relative mb-12">
          {/* Centered content section */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-4 w-full max-w-[670px]" style={{ minHeight: '175px', gap: '16px' }}>
              {/* Icon with glow effect */}
              <div className="flex items-center justify-center" style={{ width: '115px', height: '101px', gap: '12px' }}>
                <div className="relative">
                  <div className="relative flex items-center justify-center w-[115px] h-[101px]">
                    <span className="text-white text-6xl font-bold">♠</span>
                  </div>
                </div>
              </div>

              {/* Live text with gradient */}
              <h2 className="gold-gradient-text font-audiowide font-bold text-5xl md:text-6xl text-center">
                Live
              </h2>

              {/* Description text */}
              <p className="font-exo2 font-semibold text-lg text-[#B8BAE5] text-center">
                Where Culture Moves.See what's capturing attention across art, gaming, fashion, and culture  all rising on-chain
              </p>
            </div>
          </div>

          {/* Action buttons: centered on mobile, absolute on md+ */}
          <div className="flex items-center justify-center gap-4 mt-6 md:mt-0 md:absolute md:bottom-0 md:right-0">
            <div className="relative">
              {/* <div className="pointer-events-none absolute -inset-3 rounded-full bg-gradient-to-r from-purple-700 via-indigo-500 to-purple-600 blur-2xl opacity-70" /> */}
              <button className="relative px-6 py-3 text-white rounded-full font-exo2 inline-flex items-center gap-2" style={{ background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)' }}>
                Avalanche
                <span className="text-white">▼</span>
              </button>
            </div>
            <button className="inline-flex items-center font-exo2 gap-2 px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all border border-black/10">
              <span>View All</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-950 to-transparent z-10 pointer-events-none" />

          {/* Cards scroller with auto back-and-forth motion on X axis */}
          <div
            ref={scrollerRef}
            className="flex gap-10 overflow-x-auto scrollbar-hide pb-4 mx-auto"
            style={{ scrollbarWidth: 'none', scrollBehavior: 'auto' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {duplicatedAuctions.map((auction, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 overflow-hidden transition-all hover:transform hover:scale-105 cursor-pointer relative mx-auto w-[220px] h-[330px] sm:w-[240px] sm:h-[360px] md:w-[260px] md:h-[380px] rounded-[25px] bg-white"
                style={{
                  border: '1.1px solid rgba(242, 242, 242, 0.5)'
                }}
              >
                {/* NFT Image Area with Radial Gradient */}
                <div 
                  className="relative flex items-center justify-center w-[200px] h-[180px] sm:w-[220px] sm:h-[200px] md:w-[240px] md:h-[216px] rounded-[25px]"
                  style={{
                    background: 'radial-gradient(100% 100% at 50% 0%, #4F01E6 0%, #020019 100%)',
                    position: 'absolute',
                    top: '7px',
                    left: '8px'
                  }}
                >
                  <img 
                    src="/assets/nft-card-icon.png" 
                    alt="Live Auctions" 
                    width={150} 
                    height={180}
                    className="object-contain"
                  />
                  
                  {/* Live Bid Badge */}
                  <div className="absolute top-3 left-3 px-2 py-1 bg-purple-900/80 backdrop-blur-sm rounded-full text-white text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    Live Bid
                  </div>
                  
                  {/* Timer Badge */}
                  <div className="absolute top-3 right-3 text-white text-xs bg-purple-900/80 backdrop-blur-sm px-2 py-1 rounded-full">
                    {auction.timeLeft}
                  </div>
                </div>

                {/* Card Details Section - positioned below the image */}
                <div className="absolute left-0 right-0 px-3 pt-2 pb-3 top-[190px] sm:top-[205px] md:top-[223px]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <img src="/assets/verify-tick-icon.png" alt="Verified" width={16} height={16} />
                      </div>
                      <span className="text-gray-700 text-xs">{auction.creator}</span>
                    </div>
                    <span className="text-gray-500 text-xs">{auction.edition}</span>
                  </div>

                  <h3 className="text-gray-900 text-base font-bold mb-3">{auction.title}</h3>

                  <hr className="w-full border-gray-200 my-3" />

                  <button className="w-full text-white font-semibold py-2.5 rounded-full transition-all flex items-center justify-center gap-2 text-sm" style={{ background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)' }}>
                    <span className="text-base">💎</span>
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
