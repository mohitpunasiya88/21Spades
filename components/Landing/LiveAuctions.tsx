"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { PiArrowBendUpRightBold } from 'react-icons/pi';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { BsSuitSpade } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { apiCaller } from '@/app/interceptors/apicall/apicall';
import authRoutes from '@/lib/routes';
import Image from 'next/image';
import bidIcon from '@/components/assets/image.png';

export default function LiveAuctions() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [apiAuctions, setApiAuctions] = useState<any[]>([]);
  const [isLoadingAuctions, setIsLoadingAuctions] = useState(false);

  // Static auctions for non-authenticated users
  const staticAuctions = [
    { title: 'Aether Guardian', creator: '21Spades NFTs', price: '0.01 AVAX', floorPrice: '0.01', edition: '1 of 321', timeLeft: '3h 50m 2s left', imageUrl: '/assets/nft-card-icon.png' },
    { title: 'Aether Guardian', creator: '21Spades NFTs', price: '0.01 AVAX', floorPrice: '0.01', edition: '1 of 321', timeLeft: '3h 50m 2s left', imageUrl: '/assets/nft-card-icon.png' },
    { title: 'Aether Guardian', creator: '21Spades NFTs', price: '0.01 AVAX', floorPrice: '0.01', edition: '1 of 321', timeLeft: '3h 50m 2s left', imageUrl: '/assets/nft-card-icon.png' },
    { title: 'Aether Guardian', creator: '21Spades NFTs', price: '0.01 AVAX', floorPrice: '0.01', edition: '1 of 321', timeLeft: '3h 50m 2s left', imageUrl: '/assets/nft-card-icon.png' }
  ];

  // Calculate time left for auction
  const calculateTimeLeft = useCallback((endingTime?: number): string => {
    if (!endingTime) {
      console.log('⏰ [LiveAuctions] calculateTimeLeft: No endingTime provided');
      return 'N/A';
    }
    
    const now = Date.now();
    const end = endingTime;
    const diff = end - now;
    
    console.log(`⏰ [LiveAuctions] calculateTimeLeft: now=${new Date(now).toISOString()}, end=${new Date(end).toISOString()}, diff=${diff}ms`);
    
    if (diff <= 0) {
      console.log('⏰ [LiveAuctions] calculateTimeLeft: Auction ended');
      return 'Ended';
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    const result = `${hours}h ${minutes}m ${seconds}s left`;
    console.log(`⏰ [LiveAuctions] calculateTimeLeft: Result=${result}`);
    return result;
  }, []);

  // Fetch live auctions from API
  const fetchLiveAuctions = useCallback(async () => {
    try {
      setIsLoadingAuctions(true);
      console.log('🔍 [LiveAuctions] Fetching live auctions...');
      const queryParams = new URLSearchParams();
      queryParams.append('page', '1');
      queryParams.append('limit', '100');
      queryParams.append('blocked', 'false');
      
      const url = `${authRoutes.getNFTsByCollection}?${queryParams.toString()}`;
      console.log('📡 [LiveAuctions] API URL:', url);
      
      const response = await apiCaller('GET', url, null, true);
      console.log('📦 [LiveAuctions] API Response:', response);
      
      if (response.success && response.data) {
        const nftsData = Array.isArray(response.data) 
          ? response.data 
          : (response.data.items || response.data.nfts || response.data.data || []);
        
        console.log('📊 [LiveAuctions] Total NFTs fetched:', nftsData.length);
        console.log('📊 [LiveAuctions] NFTs Data:', nftsData);
        
        // Filter for auction type NFTs (auctionType = 2)
        // Show all auction type NFTs, prioritize live ones
        const now = Date.now();
        console.log('⏰ [LiveAuctions] Current time:', new Date(now).toISOString());
        
        let liveAuctions = nftsData.filter((nft: any) => {
          const auctionType = nft.auctionType !== undefined ? Number(nft.auctionType) : null;
          console.log(`🔍 [LiveAuctions] NFT ${nft.itemName || nft.name}: auctionType=${auctionType}`);
          
          // Show all auction type NFTs (auctionType = 2)
          if (auctionType === 2) {
            const startingTime = nft.startingTime 
              ? (typeof nft.startingTime === 'string' ? new Date(nft.startingTime).getTime() : Number(nft.startingTime) * 1000)
              : null;
            const endingTime = nft.endingTime 
              ? (typeof nft.endingTime === 'string' ? new Date(nft.endingTime).getTime() : Number(nft.endingTime) * 1000)
              : null;
            
            console.log(`⏰ [LiveAuctions] NFT ${nft.itemName || nft.name}: startingTime=${startingTime ? new Date(startingTime).toISOString() : 'null'}, endingTime=${endingTime ? new Date(endingTime).toISOString() : 'null'}`);
            
            // If time data exists, check if live, otherwise show it anyway
            if (startingTime && endingTime) {
              const isLive = now >= startingTime && now <= endingTime;
              console.log(`✅ [LiveAuctions] NFT ${nft.itemName || nft.name}: isLive=${isLive}`);
              return true; // Show all auction type NFTs
            }
            console.log(`✅ [LiveAuctions] NFT ${nft.itemName || nft.name}: No time data, showing anyway`);
            return true; // Show even without time data
          }
          console.log(`❌ [LiveAuctions] NFT ${nft.itemName || nft.name}: Not auction type (${auctionType})`);
          return false;
        });
        
        // Sort by latest first and take first 4
        liveAuctions = liveAuctions
          .sort((a: any, b: any) => {
            const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
            const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
            return dateB - dateA;
          })
          .slice(0, 4);
        
        // If no auction type NFTs found, use latest NFTs as fallback
        if (liveAuctions.length === 0) {
          console.log('⚠️ [LiveAuctions] No auction type NFTs found, using latest NFTs as fallback');
          liveAuctions = nftsData
            .sort((a: any, b: any) => {
              const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
              const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
              return dateB - dateA;
            })
            .slice(0, 4);
        }
        
        console.log('✅ [LiveAuctions] Final auctions to display:', liveAuctions.length);
        console.log('✅ [LiveAuctions] Final auctions data:', liveAuctions);
        console.log('✅ [LiveAuctions] Setting apiAuctions state with', liveAuctions.length, 'auctions');
        setApiAuctions(liveAuctions);
        console.log('✅ [LiveAuctions] State updated');
      } else {
        console.warn('⚠️ [LiveAuctions] No NFTs found or invalid response:', response);
        setApiAuctions([]);
      }
    } catch (error: any) {
      console.error("❌ [LiveAuctions] Error fetching live auctions:", error);
      setApiAuctions([]);
    } finally {
      setIsLoadingAuctions(false);
    }
  }, []);

  // Fetch auctions when authenticated
  useEffect(() => {
    console.log('🔐 [LiveAuctions] Authentication status:', isAuthenticated);
    if (isAuthenticated) {
      console.log('🚀 [LiveAuctions] User authenticated, fetching live auctions...');
      fetchLiveAuctions();
    } else {
      console.log('⏸️ [LiveAuctions] User not authenticated, using static data');
    }
  }, [isAuthenticated, fetchLiveAuctions]);

  // Log when apiAuctions changes
  useEffect(() => {
    console.log('🔄 [LiveAuctions] apiAuctions state changed, length:', apiAuctions.length);
    console.log('🔄 [LiveAuctions] apiAuctions data:', apiAuctions);
  }, [apiAuctions]);

  // Update time left every second for live auctions
  const [timeUpdate, setTimeUpdate] = useState(0);
  useEffect(() => {
    if (isAuthenticated && apiAuctions.length > 0) {
      const interval = setInterval(() => {
        setTimeUpdate(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, apiAuctions.length]);

  // Map API auctions to the format expected
  const mappedAuctions = useMemo(() => {
    console.log('🔄 [LiveAuctions] Mapping auctions - isAuthenticated:', isAuthenticated, 'apiAuctions.length:', apiAuctions.length);
    
    if (!isAuthenticated) {
      console.log('⚠️ [LiveAuctions] User not authenticated, using static auctions');
      return staticAuctions;
    }
    
    if (apiAuctions.length === 0) {
      console.log('⚠️ [LiveAuctions] No API auctions found, using static auctions');
      return staticAuctions;
    }

    console.log('✅ [LiveAuctions] Mapping', apiAuctions.length, 'API auctions');
    const mapped = apiAuctions.map((nft: any) => {
      // Log raw NFT data to see available fields
      console.log('📦 [LiveAuctions] Raw NFT data:', {
        itemName: nft.itemName,
        name: nft.name,
        endingTime: nft.endingTime,
        endTime: nft.endTime,
        end: nft.end,
        startingTime: nft.startingTime,
        startTime: nft.startTime,
        start: nft.start,
        allKeys: Object.keys(nft)
      });
      
      const creatorName = nft.createdBy?.name || nft.creator?.name || nft.owner?.name || '21Spades NFTs';
      
      // Extract floor price - prioritize floorPrice, then price
      let floorPriceValue = '0.01';
      if (nft.floorPrice !== undefined && nft.floorPrice !== null) {
        floorPriceValue = typeof nft.floorPrice === 'number' ? nft.floorPrice.toFixed(2) : String(nft.floorPrice);
      } else if (nft.price !== undefined && nft.price !== null) {
        floorPriceValue = typeof nft.price === 'number' ? nft.price.toFixed(2) : String(nft.price);
      }
      const price = `${floorPriceValue} AVAX`;
      
      const title = nft.itemName || nft.name || 'Unnamed NFT';
      const edition = nft.nftId ? `#${nft.nftId}` : '1 of 1';
      
      // Calculate time left properly - use same logic as collectionStore
      const parseEpochTimestamp = (value: unknown): number | undefined => {
        if (value === undefined || value === null) return undefined
        // Try parsing as ISO string first
        if (typeof value === 'string') {
          // Check if it's an ISO date string
          const dateParsed = new Date(value).getTime();
          if (!isNaN(dateParsed)) {
            return dateParsed;
          }
          // Try parsing as number string
          const numParsed = Number(value);
          if (Number.isFinite(numParsed)) {
            return numParsed > 1e12 ? numParsed : numParsed * 1000;
          }
          return undefined;
        }
        const numericValue = typeof value === 'number' ? value : Number(value);
        if (!Number.isFinite(numericValue)) return undefined
        const cleaned = Number(numericValue);
        return cleaned > 1e12 ? cleaned : cleaned * 1000;
      };
      
      const endTimeValue = nft.endingTime || nft.endTime || nft.end || nft.auctionEndTime || nft.auctionEnd;
      let endingTime = parseEpochTimestamp(endTimeValue);
      
      console.log(`🔍 [LiveAuctions] NFT ${title}: endTimeValue=`, endTimeValue, 'type:', typeof endTimeValue, 'parsed endingTime:', endingTime ? new Date(endingTime).toISOString() : 'null');
      
      // If endingTime not found, try to calculate from startingTime + default duration (24 hours)
      if (!endingTime) {
        const startTimeValue = nft.startingTime || nft.startTime || nft.start || nft.auctionStartTime;
        const startingTime = parseEpochTimestamp(startTimeValue);
        
        if (startingTime) {
          // Add 24 hours as default auction duration
          endingTime = startingTime + (24 * 60 * 60 * 1000);
          console.log(`⏰ [LiveAuctions] NFT ${title}: Calculated endingTime from startingTime + 24h:`, new Date(endingTime).toISOString());
        }
      }
      
      const timeLeft = calculateTimeLeft(endingTime);
      const imageUrl = nft.imageUrl || nft.image || '/assets/nft-card-icon.png';

      console.log(`📊 [LiveAuctions] Mapped NFT: ${title}, price: ${price}, timeLeft: ${timeLeft}, endingTime: ${endingTime ? new Date(endingTime).toISOString() : 'null'}`);

      return {
        title,
        creator: creatorName,
        price,
        floorPrice: floorPriceValue,
        edition,
        timeLeft,
        imageUrl
      };
    });
    
    console.log('✅ [LiveAuctions] Mapped auctions:', mapped);
    console.log('✅ [LiveAuctions] Returning mapped auctions, count:', mapped.length);
    return mapped;
  }, [apiAuctions, isAuthenticated, calculateTimeLeft, timeUpdate]);

  // Auto-scroll state for horizontal carousel
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Duplicate auctions for seamless infinite scroll effect
  const duplicatedAuctions = useMemo(() => {
    const duplicated = [...mappedAuctions, ...mappedAuctions, ...mappedAuctions, ...mappedAuctions, ...mappedAuctions];
    console.log('📋 [LiveAuctions] Final duplicated auctions count:', duplicated.length, 'from', mappedAuctions.length, 'unique auctions');
    console.log('📋 [LiveAuctions] First auction:', duplicated[0]);
    return duplicated;
  }, [mappedAuctions]);

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
    <section className="mt-5 overflow-hidden">
      <div className="flex flex-col justify-center items-center w-[100%]">
        <div className="flex flex-col md:relative justify-center items-center mb-8 md:mb-12 mt-10 w-full px-4">
          <div className="flex flex-col items-center gap-4 w-full max-w-[670px]">

            <div className="flex justify-center items-center">
              <BsSuitSpade className="text-white w-6 h-6" />
            </div>

            {/* Live text with gradient */}
            <h2 className="gold-gradient-text font-audiowide font-[400] text-[36px] md:text-[48px] text-center">
              Live
            </h2>

            {/* Description text */}
            <p className="font-exo2 font-semibold text-base md:text-lg text-[#A3AED0] text-center px-4">
              Where Culture Moves.See what's capturing attention across art, gaming, fashion, and culture  all rising on-chain
            </p>
          </div>

          <div className="w-full flex justify-center md:absolute md:justify-end md:right-10 md:bottom-2 mt-6 md:mt-0">
            {/* <button
              className="
      relative px-8 py-2
      rounded-full font-exo2 text-white
      inline-flex items-center gap-2

      bg-[#111327] 
      border border-white/10

      shadow-[0px_0px_8px_rgba(255,255,255,0.05)_inset,0px_0px_12px_rgba(0,0,0,0.35)]

      backdrop-blur-md
      transition-all duration-200

      hover:shadow-[0px_0px_12px_rgba(255,255,255,0.08)_inset,0px_0px_14px_rgba(0,0,0,0.45)]
    "
            >
              Avalanche
              <RiArrowDropDownLine className="w-5 h-5 text-white" />
            </button> */}
          </div>
        </div>

        <div className="relative w-full overflow-hidden">
          {/* Cards scroller with auto back-and-forth motion on X axis */}
          <div
            ref={scrollerRef}
            className="flex gap-10 overflow-x-scroll scrollbar-hide py-4"
            style={{ scrollbarWidth: 'none', scrollBehavior: 'auto' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {duplicatedAuctions.map((auction, index) => {
              if (index === 0) {
                console.log('🎴 [LiveAuctions] Rendering first auction card:', auction);
              }
              return (
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
                    src={auction.imageUrl || "/assets/nft-card-icon.png"}
                    alt={auction.title || "Live Auctions"}
                    width={150}
                    height={180}
                    className="object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/nft-card-icon.png';
                    }}
                  />

                  {/* Live Bid Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-white text-xs font-medium flex items-center gap-1.5 border border-white/30 bg-purple-900/80 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    Live Bid
                  </div>

                  {/* Timer Badge */}
                  <div className="absolute top-3 right-3 text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/30 bg-purple-900/80 backdrop-blur-sm">
                    {auction.timeLeft || 'N/A'}
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

                  {/* Floor Price Section - matching Figma design */}
                  <div className="flex items-center justify-between">
                    <span className="text-[#4A01D9] text-xs md:text-sm font-semibold">Floor Price</span>
                    <div className="flex items-center gap-1">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg">
                          <Image src={bidIcon} alt="detail" width={14} height={14} className="w-3.5 h-3.5 object-contain" />
                        </span>
                        <span className="text-[#000000] font-semibold text-xs sm:text-sm">{auction?.price}</span>
                      </div>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
          <div className="flex justify-center items-center mt-6 ">
            <button 
              onClick={() => router.push('/marketplace')}
              className="relative px-12 py-2  w-[200px] text-white rounded-full font-exo2 inline-flex items-center hover:scale-105 gap-4 transition-transform" 
              style={{ background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)' }}
            >
              View All
              <PiArrowBendUpRightBold className="w-5 h-5" />
            </button>
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
