// 'use client';

// import { ArrowRight } from 'lucide-react';
// import { BsSuitSpade } from 'react-icons/bs';
// import { CiHeart } from 'react-icons/ci';
// import { PiArrowBendUpRightBold } from 'react-icons/pi';
// import { RiArrowDropDownLine } from 'react-icons/ri';
// import { useRouter } from 'next/navigation';
// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { useAuthStore } from '@/lib/store/authStore';
// import { apiCaller } from '@/app/interceptors/apicall/apicall';
// import authRoutes from '@/lib/routes';
// import bidIcon from '@/components/assets/image.png';

// // Static collections for non-authenticated users
// const staticCollections = [
//   { name: 'Aether Guardian', creator: '21Spades NFTs', floorPrice: '0.01 AVAX', image: '/assets/card-icon.png' },
//   { name: 'Aether Guardian', creator: '21Spades NFTs', floorPrice: '0.01 AVAX', image: '/assets/card-icon.png' },
//   { name: 'Aether Guardian', creator: '21Spades NFTs', floorPrice: '0.01 AVAX', image: '/assets/card-icon.png' },
// ];

// export default function DiscoverCollections() {
//   const router = useRouter();
//   const { isAuthenticated } = useAuthStore();
//   const [collections, setCollections] = useState<any[]>([]);
//   const [isLoadingCollections, setIsLoadingCollections] = useState(false);

//   // Fetch collections from API when user is authenticated
//   useEffect(() => {
//     if (isAuthenticated) {
//       fetchCollections();
//     }
//   }, [isAuthenticated]);

//   const fetchCollections = async () => {
//     try {
//       setIsLoadingCollections(true);
      
//       // Build query params - fetch all collections
//       const queryParams = new URLSearchParams();
//       queryParams.append('page', '1');
//       queryParams.append('limit', '3'); // Only fetch 3 collections
//       queryParams.append('blocked', 'false');
      
//       const url = `${authRoutes.getCollections}?${queryParams.toString()}`;
      
//       const response = await apiCaller('GET', url, null, true);
      
//       if (response.success && response.data) {
//         // Handle both array and object with collections property
//         const collectionsData = Array.isArray(response.data) 
//           ? response.data 
//           : (response.data.collections || response.data.data || [])
        
//         // Take only first 3 collections
//         setCollections(collectionsData.slice(0, 3));
//       } else {
//         console.warn("⚠️ No collections found or invalid response")
//         setCollections([]);
//       }
//     } catch (error: any) {
//       console.error("❌ Error fetching collections:", error);
//       setCollections([]);
//     } finally {
//       setIsLoadingCollections(false);
//     }
//   };

//   // Use API collections if authenticated, otherwise use static
//   const displayCollections = isAuthenticated && collections.length > 0 
//     ? collections 
//     : staticCollections;
//   return (
//     <section
//       className="mt-10 flex flex-col justify-center items-center overflow-hidden"
//       style={{
//         backgroundImage: 'url("/assets/card-bg.png")',
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundRepeat: 'no-repeat',
//       }}
//     >

//       {/* Top glowing spade icon */}
//       <div className="flex justify-center items-center mb-8">
//           <BsSuitSpade className="text-white w-6 h-6" />
//         </div>

//       <div className="mx-auto px-4 relative z-20">

//         {/* Title Section */}
//         <div className="text-center mb-10">
//           <h2 className="gold-gradient-text font-audiowide font-[400] text-[32px] sm:text-[40px] md:text-[48px] mb-4">
//             Discover Collection
//           </h2>

//           <p className="text-[#B8BAE5] text-base sm:text-lg font-exo2 font-medium max-w-2xl mx-auto leading-relaxed">
//             Curate your world, Explore curated collections and rare finds<br />
//             that define your digital identity.
//           </p>
//         </div>

//         {/* Chain Selector Dropdown */}
//         <div className="flex justify-center md:justify-end mb-6 pr-2 sm:pr-4">
//           {/* <button
//             className="
//           relative px-8 py-2 rounded-full font-exo2 text-white inline-flex items-center gap-2
//           bg-[#111327] border border-white/10
//           shadow-[0px_0px_8px_rgba(255,255,255,0.05)_inset,0px_0px_12px_rgba(0,0,0,0.35)]
//           backdrop-blur-md transition-all duration-200
//           hover:shadow-[0px_0px_12px_rgba(255,255,255,0.08)_inset,0px_0px_14px_rgba(0,0,0,0.45)]
//         "
//           >
//             Avalanche
//             <RiArrowDropDownLine className="w-5 h-5 text-white" />
//           </button> */}
//         </div>

//         {/* NFT CARDS GRID with Background */}
//         <div className="relative w-full">
//           {/* Background Image */}
//           <div className="absolute inset-0 flex items-center justify-start pointer-events-none opacity-20 z-0 left-[-20%]">
//             <img src="/assets/card-icon.png" alt="Background" className="left-0 translate-x-[-50%] rotate-[90deg] object-contain w-[75%] h-[75%]" />
//           </div>
          
//           {/* Cards Grid */}
//           <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center gap-6 sm:gap-8">
          
//           {/* Card Component Loop */}
//           {isLoadingCollections ? (
//             // Loading state
//             [1, 2, 3].map((n) => (
//               <div
//                 key={n}
//                 className="overflow-hidden rounded-[10px] bg-white shadow-lg w-full sm:w-[280px] md:w-[300px] max-w-[300px] animate-pulse"
//               >
//                 <div className="w-full h-[200px] sm:h-[240px] md:h-[280px] rounded-t-[10px] bg-gray-300"></div>
//                 <div className="px-3 py-3 sm:px-4 sm:py-4">
//                   <div className="h-4 bg-gray-300 rounded mb-2"></div>
//                   <div className="h-6 bg-gray-300 rounded mb-3"></div>
//                   <div className="h-4 bg-gray-300 rounded"></div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             displayCollections.map((collection, index) => {
//               const collectionName = collection.name || collection.displayName || collection.collectionName || 'Unnamed Collection';
//               const creatorName = collection.createdBy?.name || collection.creator?.name || collection.owner?.name || collection.creator || '21Spades NFTs';
              
//               // Format floor price - handle both string and number
//               let floorPrice = '0.01 AVAX';
//               if (collection.floorPrice) {
//                 if (typeof collection.floorPrice === 'number') {
//                   floorPrice = `${collection.floorPrice} AVAX`;
//                 } else if (typeof collection.floorPrice === 'string') {
//                   floorPrice = collection.floorPrice.includes('AVAX') ? collection.floorPrice : `${collection.floorPrice} AVAX`;
//                 }
//               }
              
//               const imageUrl = collection.imageUrl || collection.image || collection.collectionImage || '/assets/card-icon.png';
//               const collectionId = collection._id || collection.id;

//               return (
//                 <div
//                   key={collectionId || index}
//                   onClick={() => collectionId && router.push(`/marketplace/collection/${collectionId}`)}
//                   className="overflow-hidden rounded-[10px] bg-white shadow-lg w-full sm:w-[280px] md:w-[300px] max-w-[300px] transition-all hover:scale-[1.03] cursor-pointer"
//                 >
//                   {/* NFT Image Area */}
//                   <div
//                     className="w-full h-[200px] sm:h-[240px] md:h-[280px] rounded-t-[10px] flex items-center justify-center relative"
//                     style={{
//                       background: 'radial-gradient(100% 100% at 50% 0%, #4F01E6 0%, #020019 100%)',
//                     }}
//                   >
//                     <img
//                       src={imageUrl}
//                       alt={collectionName}
//                       className="object-contain w-[120px] sm:w-[140px] md:w-[150px]"
//                       onError={(e) => {
//                         (e.target as HTMLImageElement).src = '/assets/card-icon.png';
//                       }}
//                     />

//                     {/* Heart Icon */}
//                     <button className="absolute top-4 right-4 p-1 bg-[#ffffff2e] rounded-full backdrop-blur-sm cursor-pointer">
//                       <CiHeart className="w-5 h-5 text-white" />
//                     </button>
//                   </div>

//                   {/* Content */}
//                   <div className="px-3 py-3 sm:px-4 sm:py-4">
//                     <div className="flex items-center gap-1.5 mb-2">
//                       <img src="/assets/verify-tick-icon.png" className="w-4 h-4" />
//                       <span className="text-gray-700 text-xs font-medium">{creatorName}</span>
//                     </div>

//                     <h3 className="text-gray-900 font-bold text-base sm:text-lg mb-2 sm:mb-3">{collectionName}</h3>

//                     <hr className="border-gray-300 mb-2 sm:mb-3" />

//                     {/* Floor Price */}
//                     <div className="flex items-center justify-between">
//                       <span className="text-[#4A01D9] text-xs sm:text-sm font-semibold">Floor Price</span>

//                       <div className="flex items-center gap-1">
//                         <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg">
//                           <Image src={bidIcon} alt="detail" width={14} height={14} className="w-3.5 h-3.5 object-contain" />
//                         </span>
//                         <span className="text-[#000000] font-semibold text-xs sm:text-sm">{floorPrice}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//           </div>

//           <div className="absolute inset-0 flex items-center justify-end pointer-events-none opacity-20 z-0 right-[-20%]">
//             <img src="/assets/card-icon.png" alt="Background" className="right-0 translate-x-[50%] rotate-[-90deg] object-contain w-[75%] h-[75%]" />
//           </div>
//         </div>

//         {/* View All Button */}
//         <div className="flex justify-center mt-14">
//           <button
//             onClick={() => router.push('/marketplace')}
//             className="relative px-12 py-2 w-[220px] text-white rounded-full font-exo2 inline-flex items-center justify-center gap-3 text-lg hover:scale-105 transition-transform"
//             style={{
//               background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)',
//             }}
//           >
//             View All
//             <PiArrowBendUpRightBold className="w-5 h-5" />
//           </button>
//         </div>

//       </div>
//     </section>

//   );
// }



'use client'

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { BsSuitSpade } from 'react-icons/bs';
import { CiHeart } from 'react-icons/ci';
import { PiArrowBendUpRightBold } from 'react-icons/pi';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';
import { apiCaller } from '@/app/interceptors/apicall/apicall';
import authRoutes from '@/lib/routes';
import collectionImage from '../assets/21Spades-collection-image.png'
import Image from 'next/image';
import bidIcon from '@/components/assets/image.png';

export default function DiscoverCollections() {
  const router = useRouter();
  const [collections, setCollections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPublicCollections();
  }, []);

  const fetchPublicCollections = async () => {
    try {
      setIsLoading(true);
      const response_system = await apiCaller('GET', authRoutes.getSystemCollection);
      const response = await apiCaller('GET', authRoutes.getCollectionsPublic, null, false);

      
      if (response.success && response.data) {
        // Get last 10 active collections and take first 3
        const collectionsData = Array.isArray(response.data) 
          ? response.data 
          : (response.data.collections || response.data.data || []);
        
        // Filter active collections and take first 3
        const activeCollections = collectionsData
          .filter((col: any) => col.isActive !== false)
          .slice(0, 2);
        
        setCollections([response_system.data.collection,...activeCollections, ]);
      } else {
        setCollections([]);
      }
    } catch (error: any) {
      console.error('Error fetching public collections:', error);
      setCollections([]);
    } finally {
      setIsLoading(false);
    }
  };
  console.log(collections,'collections');
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
          {isLoading ? (
            // Loading state
            [1, 2, 3].map((n) => (
              <div
                key={n}
                className="overflow-hidden rounded-[10px] bg-white shadow-lg w-full sm:w-[280px] md:w-[300px] max-w-[300px] animate-pulse"
              >
                <div className="w-full h-[200px] sm:h-[240px] md:h-[280px] rounded-t-[10px] bg-gray-300"></div>
                <div className="px-3 py-3 sm:px-4 sm:py-4">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))
          ) : collections.length > 0 ? (
            collections.map((collection, index) => {
              const collectionName = collection.collectionName || collection.name || 'Unnamed Collection';
              const imageUrl = collection.imageUrl || collection.coverPhoto || null;
              const floorPrice = collection.floorPrice || 0;
              const floorPriceFormatted = typeof floorPrice === 'number' 
                ? `${floorPrice.toFixed(2)} AVAX` 
                : floorPrice;

              return (
                <div
                  key={collection._id || collection.id || index}
                  onClick={() => {
                    const collectionId = collection._id || collection.id;
                    if (collectionId) {
                      router.push(`/marketplace/collection/${collectionId}`);
                    }
                  }}
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
                      src={imageUrl}
                      alt={collectionName}
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

                    <h3 className="text-gray-900 font-bold text-base sm:text-lg mb-2 sm:mb-3">{collectionName}</h3>

                    <hr className="border-gray-300 mb-2 sm:mb-3" />

                    {/* Floor Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-[#4A01D9] text-xs sm:text-sm font-semibold">Floor Price</span>

                      <div className="flex items-center gap-1">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg">
                          <Image src={bidIcon} alt="detail" width={14} height={14} className="w-3.5 h-3.5 object-contain" />
                        </span>
                        <span className="text-[#000000] font-semibold text-xs sm:text-sm">{floorPriceFormatted}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            // Empty state - show 3 placeholder cards
            [1, 2, 3].map((n) => (
              <div
                key={n}
                className="overflow-hidden rounded-[10px] bg-white shadow-lg w-full sm:w-[280px] md:w-[300px] max-w-[300px] transition-all hover:scale-[1.03] cursor-pointer"
              >
                <div
                  className="w-full h-[200px] sm:h-[240px] md:h-[280px] rounded-t-[10px] flex items-center justify-center relative"
                  style={{
                    background: 'radial-gradient(100% 100% at 50% 0%, #4F01E6 0%, #020019 100%)',
                  }}
                >
                  <img
                    src={typeof collectionImage === 'string' ? collectionImage : collectionImage.src}
                    alt="NFT"
                    className="object-contain w-[120px] sm:w-[140px] md:w-[150px]"
                  />
                  <button className="absolute top-4 right-4 p-1 bg-[#ffffff2e] rounded-full backdrop-blur-sm cursor-pointer">
                    <CiHeart className="w-5 h-5 text-white" />
                  </button>
                </div>
                <div className="px-3 py-3 sm:px-4 sm:py-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <img src="/assets/verify-tick-icon.png" className="w-4 h-4" />
                    <span className="text-gray-700 text-xs font-medium">21Spades NFTs</span>
                  </div>
                  <h3 className="text-gray-900 font-bold text-base sm:text-lg mb-2 sm:mb-3">Aether Guardian</h3>
                  <hr className="border-gray-300 mb-2 sm:mb-3" />
                  <div className="flex items-center justify-between">
                    <span className="text-[#4A01D9] text-xs sm:text-sm font-semibold">Floor Price</span>
                    <div className="flex items-center gap-1">
                      <span className="text-red-500 text-base sm:text-lg">▲</span>
                      <span className="text-[#000000] font-semibold text-xs sm:text-sm">0.01 AVAX</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          </div>

          <div className="absolute inset-0 flex items-center justify-end pointer-events-none opacity-20 z-0 right-[-20%]">
            <img src="/assets/card-icon.png" alt="Background" className="right-0 translate-x-[50%] rotate-[-90deg] object-contain w-[75%] h-[75%]" />
          </div>
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-14">
          <button
            onClick={() => router.push('/marketplace')}
            className="relative px-12 py-2 w-[220px] text-white rounded-full font-exo2 inline-flex items-center justify-center gap-3 text-lg hover:scale-105 transition-transform"
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
