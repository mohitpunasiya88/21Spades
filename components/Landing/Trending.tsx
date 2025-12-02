import NFTCard from "./NFTcard";
import { useState, useEffect, useMemo, useCallback } from "react";
import { PiArrowBendUpRightBold } from "react-icons/pi";
import { BsSuitSpade } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useAuthStore, useCategoriesStore } from '@/lib/store/authStore';
import { apiCaller } from '@/app/interceptors/apicall/apicall';
import authRoutes from '@/lib/routes';
import NFTNotFoundBanner from "../Common/NFTNotFoundBanner";
import SkeletonBox from "../Common/SkeletonBox";

// Icon mapping for categories
const categoryIconMap: Record<string, string> = {
  'CRYPTO': '💰',
  'GAMING': '🎮',
  'TICKETING': '🎫',
  'FASHION': '👗',
  'ART': '🎨',
  'REAL ESTATE': '🏢',
  'A.I.': '🤖',
  'AI': '🤖',
  'A I': '🤖'
};

// // Static categories for non-authenticated users
// const staticCategories = [
//   { name: 'ALL', icon: null },
//   { name: 'CRYPTO', icon: '💰' },
//   { name: 'GAMING', icon: '🎮' },
//   { name: 'TICKETING', icon: '🎫' },
//   { name: 'FASHION', icon: '👗' },
//   { name: 'ART', icon: '🎨' },
//   { name: 'REAL ESTATE', icon: '🏢' },
//   { name: 'A.I.', icon: '🤖' }
// ];

export default function Trending() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const { isAuthenticated } = useAuthStore();
  const { categories: apiCategories, getCategories, isLoading: categoriesLoading } = useCategoriesStore();
  const [apiNfts, setApiNfts] = useState<any[]>([]);
  const [isLoadingNfts, setIsLoadingNfts] = useState(false);

  // Fetch categories when user is authenticated
  useEffect(() => {
    // if (isAuthenticated) {
      getCategories().catch(error => {
        console.error('Error fetching categories:', error);
      });
    // }
  }, [getCategories]);

  const fetchNFTs = useCallback(async () => {
    try {
      setIsLoadingNfts(true);
      const queryParams = new URLSearchParams();
      queryParams.append('page', '1');
      queryParams.append('limit', '30'); // Fetch more to filter by category
      queryParams.append('blocked', 'false');

      // Fetch all NFTs (without collectionId to get all NFTs)
      const url = `${authRoutes.getNFTsByCollection}?${queryParams.toString()}`;

      const response = await apiCaller('GET', url, null, true);

      if (response.success && response.data) {
        const nftsData = Array.isArray(response.data)
          ? response.data
          : (response.data.items || response.data.nfts || response.data.data || []);

        if (nftsData.length === 0) {
          setApiNfts([]);
          return;
        }

        // Sort by createdAt (latest first) and take latest 6
        const sortedNfts = nftsData
          .sort((a: any, b: any) => {
            const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
            const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
            return dateB - dateA; // Latest first
          })
          .slice(0, 6);

        setApiNfts(sortedNfts);
      } else {
        console.warn("⚠️ No NFTs found or invalid response:", response);
        setApiNfts([]);
      }
    } catch (error: any) {
      console.error("❌ Error fetching NFTs:", error);
      setApiNfts([]);
    } finally {
      setIsLoadingNfts(false);
    }
  }, []);

  // Fetch NFTs from API when user is authenticated
  useEffect(() => {
      fetchNFTs();
  }, [fetchNFTs]);

  // Map API categories to include icons and format
  const categories = useMemo(() => {
    // if (!isAuthenticated || !apiCategories || apiCategories.length === 0) {
    //   return staticCategories;
    // }

    // Map API categories to include icons
    const mappedCategories = apiCategories
      .filter(cat => cat.isActive)
      .map(cat => {
        const categoryName = cat.name.toUpperCase();
        return {
          name: categoryName,
          icon: categoryIconMap[categoryName] || null
        };
      });

    // Add 'ALL' at the beginning
    return [{ name: 'ALL', icon: null }, ...mappedCategories];
  }, [apiCategories]);

  // // Static NFTs for non-authenticated users
  // const staticNfts = [
  //   { title: 'Aether Guardian', creator: '21Spades NFTs', price: '3.5 ETH', edition: '1 of 321', category: 'Crypto' },
  //   { title: 'Cyber Warrior', creator: 'GameVerse', price: '2.8 ETH', edition: '1 of 500', category: 'GAMING' },
  //   { title: 'VIP Concert Pass', creator: 'EventChain', price: '1.2 ETH', edition: '1 of 1000', category: 'Ticketing' },
  //   { title: 'Digital Couture', creator: 'MetaFashion', price: '4.1 ETH', edition: '1 of 150', category: 'FASHION' },
  //   { title: 'Abstract Dreams', creator: 'ArtDAO', price: '5.5 ETH', edition: '1 of 50', category: 'ART' },
  //   { title: 'Virtual Tower', creator: 'RealtyVerse', price: '10.0 ETH', edition: '1 of 25', category: 'Real Estate' },
  //   { title: 'Bitcoin Genesis', creator: 'CryptoLegends', price: '6.2 ETH', edition: '1 of 200', category: 'Crypto' },
  //   { title: 'AI Consciousness', creator: 'NeuralArts', price: '3.9 ETH', edition: '1 of 300', category: 'A I' },
  //   { title: 'Dragon Quest NFT', creator: 'FantasyGames', price: '2.5 ETH', edition: '1 of 750', category: 'GAMING' },
  //   { title: 'Museum Entry', creator: 'CulturePass', price: '0.8 ETH', edition: '1 of 2000', category: 'Ticketing' },
  //   { title: 'Haute Dress', creator: 'LuxuryLab', price: '7.3 ETH', edition: '1 of 100', category: 'FASHION' },
  //   { title: 'Renaissance Redux', creator: 'ClassicArts', price: '8.1 ETH', edition: '1 of 75', category: 'ART' }
  // ];

  // Map API NFTs to the format expected by NFTCard
  const mappedApiNfts = useMemo(() => {
    // if (!isAuthenticated || apiNfts.length === 0) {
    //   return [];
    // }

    return apiNfts.map((nft: any) => {
      const categoryName = nft.category?.name || nft.category || nft.collectionCategory || 'ALL';
      const creatorName = nft.createdBy?.name || nft.creator?.name || nft.owner?.name || '21Spades NFTs';
      const price = nft.price ? `${nft.price} AVAX` : nft.floorPrice ? `${nft.floorPrice} AVAX` : '0.01 AVAX';
      const title = nft.itemName || nft.name || 'Unnamed NFT';
      const edition = nft.nftId ? `#${nft.nftId}` : '1 of 1';
      const collectionId = nft.collectionId?._id || nft.collectionId || nft.collection?._id || nft.collection;

      return {
        title,
        creator: creatorName,
        price,
        edition,
        category: categoryName.toUpperCase(),
        imageUrl: nft.imageUrl || nft.image,
        nftId: nft._id || nft.id,
        collectionId: collectionId
      };
    });
  }, [apiNfts]);

  // Use API NFTs if authenticated, otherwise use static
  const allNfts = mappedApiNfts.length > 0 ? mappedApiNfts : [];

  // Filter by category
  const filteredNfts = activeCategory === 'ALL'
    ? allNfts
    : allNfts.filter(nft => {
      const nftCategory = nft.category?.toUpperCase() || '';
      return nftCategory === activeCategory || nftCategory.includes(activeCategory);
    });

  return (
    <section className="relative w-[100%] mx-auto mt-10">
      <div className="flex flex-col justify-center items-center mx-auto px-4 w-[100%] md:w-[85%]">
        <div className="flex justify-center items-center">
          <BsSuitSpade className="text-white w-6 h-6" />
        </div>
        <div className="text-center mb-6 md:mb-12 relative w-full max-w-4xl mx-auto">
          <h2 className="gold-gradient-text font-audiowide font-[400] text-[36px] md:text-[46px] text-center">
            Trending
          </h2>
          <p className="text-gray-300 mt-2 md:mt-3 text-sm md:text-lg font-exo2 max-w-full md:max-w-[700px] mx-auto leading-snug md:leading-relaxed">
            Where Culture Moves. See what's capturing attention across art, gaming, fashion, and culture — all rising on-chain
          </p>
        </div>

        <div className="mb-8 md:mb-12 w-full max-w-full mx-auto font-exo2 relative z-20">
          <div
            className="flex flex-nowrap items-center justify-start md:justify-center gap-0 overflow-x-auto overflow-y-hidden rounded-full py-2.5 px-4 w-[70%] sm:w-[80%] md:w-[90%] lg:w-[70%] max-w-full mx-auto backdrop-blur-sm scrollbar-hide relative z-20"
            style={{
              background: 'linear-gradient(to right, rgba(79, 1, 30, 0.1) 0%, rgba(20, 25, 45, 0.1) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)', zIndex: 20, touchAction: 'pan-x', WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth'
            }}
          >
            {categories.map((category, index) => (
              <div key={index} className="flex flex-nowrap items-center flex-shrink-0 relative z-30">
                <button
                  onClick={() => setActiveCategory(category.name)}
                  className={`h-9 md:h-10 px-4 md:px-6 rounded-full font-semibold transition-all flex flex-nowrap items-center gap-1.5 md:gap-2 text-xs md:text-sm whitespace-nowrap cursor-pointer pointer-events-auto relative z-30 ${activeCategory === category.name
                    ? 'text-white'
                    : 'text-white hover:text-white'
                    }`}
                  style={
                    activeCategory === category.name
                      ? {
                        background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)',
                        border: '2px solid #25016E',
                        boxShadow: '0 0 12px rgba(79, 1, 230, 0.35)', zIndex: 30
                      }
                      : { background: 'transparent', border: 'none', zIndex: 30 }
                  }
                >
                  {category.icon && <span className="text-base md:text-lg">{category.icon}</span>}
                  <span>{category.name}</span>
                </button>
                {index !== categories.length - 1 && (
                  <span className="mx-2 md:mx-3 h-4 md:h-5 w-px bg-gray-400/30" />
                )}
              </div>
            ))}
            <div className="flex-shrink-0 w-4 sm:hidden"></div>
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto mb-12 relative z-10">
          <img src="/assets/bg-ball.png" alt="Background" className="absolute top-0 left-0 opacity-70 blur-md z-0 w-170 h-170 -translate-x-1/2 translate-y-1/3" />
          {/* <div className={`${filteredNfts.length > 0 && filteredNfts.length < 3 ? 'flex justify-center' : ''}`}> */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8 w-full">
            {isLoadingNfts ? (
              [1, 2, 3].map((n) => (
                <div key={n} className="overflow-hidden rounded-[10px] bg-white shadow-lg">
                  <div className="w-full h-[160px] sm:h-[280px] md:h-[300px]">
                    <SkeletonBox width="100%" height="100%" radius="10px 10px 0 0" />
                  </div>
                  <div className="px-3 py-3 sm:px-4 sm:py-4">
                    <div className="mb-2">
                      <SkeletonBox width="60%" height={16} radius={4} />
                    </div>
                    <div className="mb-3">
                      <SkeletonBox width="80%" height={24} radius={4} />
                    </div>
                    <SkeletonBox width="40%" height={16} radius={4} />
                  </div>
                </div>
              ))
            ) : filteredNfts.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-6 w-full max-w-[1100px] mx-auto">
                {filteredNfts.slice(0, 6).map((nft, index) => (
                  <div
                    key={(nft as any).nftId || `nft-${index}`}
                    className="flex justify-center w-full sm:w-[350px] md:w-[350px] max-w-[350px]"
                    // style={{ width: "350px" }}   // fixed card width
                  >
                    <NFTCard {...nft} />
                  </div>
                ))}
              </div>

            ) : (
              <NFTNotFoundBanner
                title="NFTs"
                subtitle="LOOKS LIKE THIS NFT ISN'T HERE ANYMORE."
                className="min-h-[350px] w-full"
              />
            )}
          </div>

          {/* </div> */}
          <img src="/assets/bg-ball.png" alt="Background" className="absolute z-0 bottom-0 right-0 opacity-50 blur-md z-0 w-300 h-300 translate-x-1/2 translate-y-1/6" />
        </div>

        <div className="text-center px-4">
          <button
            onClick={() => router.push('/marketplace')}
            className="cursor-pointer inline-flex md:inline-flex flex-nowrap items-center justify-center gap-2 px-8 md:px-14 py-2 md:py-2 w-full md:w-auto rounded-full font-semibold transition-all hover:scale-105 text-white"
            style={{ background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)' }}
          >
            <span>Explore All</span>
            <PiArrowBendUpRightBold className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}