'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ArrowUp, Heart, Check, AlertTriangle } from 'lucide-react'
import { Carousel, Dropdown, Space, Spin } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useRouter } from 'next/navigation'
import { apiCaller } from '@/app/interceptors/apicall/apicall'
import authRoutes from '@/lib/routes'
import { useAuthStore } from '@/lib/store/authStore'
import spadesImage from '../assets/21spades.png'

interface marketplace {
  title?: string
  creatorAddress?: string
  price?: number
  currency?: string
  items?: number
  auctionTime?: string
  imageSrc?: string
}

// Single Card Component
function CardContent({
  title = 'Tribe Warrior',
  creatorAddress = '0x3cE...8A288',
  price = 0.785,
  currency = 'AVAX',
  items = 856,
  auctionTime = '00 : 17 : 02 : 67',
  imageSrc = '/assets/image6.jpeg',
}: marketplace) {
  return (
    <div className="relative w-full h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden mt-4 sm:mt-6 md:mt-10 p-2 sm:p-3 md:p-4">
      {/* Background Image */}
      <Image 
        src={imageSrc} 
        alt={title} 
        fill
        className="object-cover "
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 h-1/2 w-full bg-gradient-to-br from-black/60 via-black/40 to-transparent" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col mt-8 sm:mt-10 md:mt-14">
        {/* Title and Creator Section - Bottom Left */}
        <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-4 sm:left-6 md:left-10 z-10">
          <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-exo2 mb-1">
            {title}
          </h1>
          <p className="text-white font-exo2 text-xs sm:text-sm md:text-base">
            by {creatorAddress}
          </p>
        </div>
        
        {/* Data Panel - Glass pill centered with angled shape */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 w-[90%] sm:w-auto">
          <div
            className="relative flex items-center gap-2 sm:gap-3 md:gap-5 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 backdrop-blur-sm rounded-lg sm:rounded-xl ring-1 ring-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          >
            {/* Price */}
            <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px] md:min-w-[100px]">
              <div className="flex items-center gap-1 sm:gap-1.5 text-white text-xs sm:text-sm font-bold">
                <ArrowUp className="text-red-500 w-3 h-3 sm:w-3.5 sm:h-3.5 fill-red-500" />
                <span className="font-exo2">{price} {currency}</span>
              </div>
              <span className="text-yellow-500 text-[10px] sm:text-xs mt-0.5">Price</span>
            </div>

            {/* Divider */}
            <div className="w-px h-8 sm:h-10 md:h-12 bg-white/20" />

            {/* Items */}
            <div className="flex flex-col items-center min-w-[50px] sm:min-w-[60px] md:min-w-[70px]">
              <span className="text-white text-xs sm:text-sm font-bold">{items}</span>
              <span className="text-yellow-500 text-[10px] sm:text-xs mt-0.5">Items</span>
            </div>

            {/* Divider */}
            <div className="w-px h-8 sm:h-10 md:h-12 bg-white/20" />

            {/* Auction Timer */}
            <div className="flex flex-col items-center min-w-[100px] sm:min-w-[130px] md:min-w-[160px]">
              <span className="text-white text-xs sm:text-sm font-bold font-mono whitespace-nowrap">{auctionTime}</span>
              <span className="text-yellow-500 text-[10px] sm:text-xs mt-0.5">Auction starts in</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// NFT Card Component - Based on image design
interface NFTCardProps {
  title: string
  creator: string
  price: string
  floorPrice?: string
  verified?: boolean
  collectionId?: string
  imageUrl?: string
}

function NFTCard({ title, creator, price, floorPrice = '0.01 AVAX', verified = true, collectionId, imageUrl }: NFTCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageError, setImageError] = useState(false)
  const router = useRouter()

  const handleCardClick = () => {
    // Navigate to collection page with actual collection ID
    if (collectionId) {
      router.push(`/marketplace/collection/${collectionId}`)
    } else {
      // Fallback to slug-based ID if collectionId not provided
      const slugId = title.toLowerCase().replace(/\s+/g, '-')
      router.push(`/marketplace/collection/${slugId}`)
    }
  }

  return (
    <div className="relative w-[280px] sm:w-[300px] md:w-[320px]">
      <div 
        onClick={handleCardClick}
        className="relative rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-transform hover:scale-[1.03] m-1 sm:m-2 p-2 sm:p-3 bg-[#0A0D1F] shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-[#5B5FE3]/30"
        style={{
          minHeight: '340px',
          boxShadow: '0 8px 28px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Media box */}
        <div className="relative h-[180px] sm:h-[200px] md:h-[214px] p-2 sm:p-3">
          {/* Heart Icon - Top Right with light purple background */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsFavorite(!isFavorite)
            }}
            className="absolute top-5 sm:top-6 md:top-7.5 right-5 sm:right-6 md:right-7.5 z-10 p-1.5 sm:p-2 rounded-full transition-colors ring-1 ring-white/25"
            style={{
              background: 'linear-gradient(180deg, rgba(126,107,239,0.45), rgba(126,107,239,0.22))',
            }}
          >
            <Heart 
              className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white stroke-2'}`}
            />
          </button>

          {/* Padded media with gradient and vignette */}
          <div className="absolute inset-0 p-2.5 sm:p-3 md:p-3.5">
            <div
              className="relative p-2 sm:p-2.5 md:p-3 h-full w-full rounded-[10px] sm:rounded-[12px] md:rounded-[14px] overflow-hidden ring-1 ring-white/10 bg-[#050616]"
              style={{ background: 'radial-gradient(120% 120% at 50% 0%,rgb(78, 13, 255) 0%, #180B34 68%, #070817 100%)' }}
            >
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: 'radial-gradient(120% 100% at 50% 0%, rgba(0,0,0,0) 52%, rgba(5,6,20,0.65) 100%)' }}
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-[#7E6BEF]/25 rounded-[10px] sm:rounded-[12px] md:rounded-[14px]" />
              <div className="absolute inset-0 flex items-center justify-center">
                {imageUrl && !imageError ? (
                  <Image 
                    src={imageUrl} 
                    alt={title} 
                    fill
                    className="object-cover rounded-[10px] sm:rounded-[12px] md:rounded-[14px] pointer-events-none select-none"
                    onError={() => {
                      // Fallback to default image if API image fails to load
                      setImageError(true)
                    }}
                  />
                ) : (
                  <Image 
                    src={spadesImage} 
                    alt="21 Spade" 
                    width={120}
                    height={120}
                    className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[145px] md:h-[145px] object-contain pointer-events-none select-none drop-shadow-[0_6px_14px_rgba(0,0,0,0.55)]"
                    priority
                  />
                )}
              </div>
            </div>
          </div>
         
        </div>

        {/* Bottom Section - Information */}
        <div 
          className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2 sm:pt-3"
          style={{
            // background: 'linear-gradient(to bottom, rgba(25, 11, 63, 0.3), rgba(0,0,0,0.6))',
          }}
        >
          {/* Creator */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <span className="inline-flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-[#162345] ring-1 ring-[#3B82F6]/45">
              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#69A8FF]" />
            </span>
            <span className="text-[#D6DEFF] text-xs sm:text-sm font-medium font-exo2">{creator}</span>
          </div>

          {/* Title */}
          <h3 className="text-white text-lg sm:text-xl md:text-[21px] font-bold tracking-tight mb-2 sm:mb-3 font-exo2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.35)' }}>
            {title}
          </h3>
          <div className="h-px w-full bg-white/10 mb-2 sm:mb-3" />

          {/* Floor Price Section */}
          <div className="flex items-center justify-between">
            <span className="text-[#7E6BEF] text-xs sm:text-sm font-medium font-exo2">Floor Price</span>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <AlertTriangle className="w-3 h-3 sm:w-[14px] sm:h-[14px] text-[#FF5E57] flex-shrink-0" />
              <span className="text-white text-xs sm:text-sm font-semibold tracking-wide font-exo2">{floorPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Component with Carousel
const TokenizedCollectionCard: React.FC = () => {
  const { user } = useAuthStore()
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [selectedNetwork, setSelectedNetwork] = useState('Avalanche')
  const [visibleCards, setVisibleCards] = useState(3)
  const [collections, setCollections] = useState<any[]>([])
  const [isLoadingCollections, setIsLoadingCollections] = useState(false)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  
  const onChange = (currentSlide: number) => {
  }

  // Fetch collections from API
  const fetchCollections = async () => {
    try {
      setIsLoadingCollections(true)
      
      // Build query params - fetch all collections (not filtered by wallet)
      const queryParams = new URLSearchParams()
      queryParams.append('page', '1')
      queryParams.append('limit', '100')
      queryParams.append('blocked', 'false')
      
      const url = `${authRoutes.getCollections}?${queryParams.toString()}`
      
      const response = await apiCaller('GET', url, null, true)
      
      if (response.success && response.data) {
        // Handle both array and object with collections property
        const collectionsData = Array.isArray(response.data) 
          ? response.data 
          : (response.data.collections || response.data.data || [])
        setCollections(collectionsData)
      } else {
        console.warn("⚠️ No collections found or invalid response")
        setCollections([])
      }
    } catch (error: any) {
      console.error("❌ Error fetching collections:", error)
      setCollections([])
    } finally {
      setIsLoadingCollections(false)
    }
  }

  // Fetch collections on component mount
  useEffect(() => {
    fetchCollections()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Dropdown menu items
  const items: MenuProps['items'] = [
    {
      label: 'Avalanche',
      key: 'avalanche',
    },
    {
      label: 'Ethereum',
      key: 'ethereum',
    },
    {
      label: 'Polygon',
      key: 'polygon',
    },
    {
      type: 'divider',
    },
    {
      label: 'BSC',
      key: 'bsc',
    },
    {
      label: 'Solana',
      key: 'solana',
    },
  ]

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const selectedItem = items.find(item => item?.key === e.key)
    if (selectedItem && 'label' in selectedItem) {
      setSelectedNetwork(selectedItem.label as string)
    }
  }

  // Map collections to NFT card format
  const mappedCollections = collections.map((collection: any) => {
    const collectionId = collection._id || collection.id || collection.collectionId
    const collectionName = collection.collectionName || collection.name || 'Unnamed Collection'
    const creatorName = collection.creator?.name || collection.creator?.username || 'Unknown Creator'
    const floorPrice = collection.floorPrice ? `${collection.floorPrice} AVAX` : '0.01 AVAX'
    const imageUrl = collection.imageUrl || collection.coverPhoto || null
    
    return {
      title: collectionName,
      creator: creatorName,
      price: '0.01 AVAX', // Default price
      floorPrice: floorPrice,
      category: collection.category || 'Crypto',
      collectionId: collectionId,
      imageUrl: imageUrl,
      verified: collection.isVerified || false,
    }
  })

  const filteredNfts = activeCategory === 'ALL' 
    ? mappedCollections 
    : mappedCollections.filter(nft => nft.category === activeCategory);

  // Handle scroll to load more cards
  React.useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return

      const container = scrollContainerRef.current
      const scrollLeft = container.scrollLeft
      const scrollWidth = container.scrollWidth
      const clientWidth = container.clientWidth

      // Load more when user scrolls to 80% of the container
      if (scrollLeft + clientWidth >= scrollWidth * 0.8) {
        if (visibleCards < filteredNfts.length) {
          setVisibleCards(prev => Math.min(prev + 3, filteredNfts.length))
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [visibleCards, filteredNfts.length])

  return (
    <div className="w-full relative pb-12 px-6">
      <Carousel afterChange={onChange} dots={true} dotPosition="bottom" className="tribe-warrior-carousel" autoplay>
        <div>
          <CardContent 
            title="Tribe Warrior"
            creatorAddress="0x3cE...8A288"
            price={0.785}
            currency="AVAX"
            items={856}
            auctionTime="00 : 17 : 02 : 67"
            imageSrc="/assets/image6.jpeg"
            
          />
        </div>
        <div>
          <CardContent 
            title="Tribe Warrior"
            creatorAddress="0x3cE...8A288"
            price={0.785}
            currency="AVAX"
            items={856}
            auctionTime="00 : 17 : 02 : 67"
            imageSrc="/assets/image6.jpeg"
          />
        </div>
        <div>
          <CardContent 
            title="Tribe Warrior"
            creatorAddress="0x3cE...8A288"
            price={0.785}
            currency="AVAX"
            items={856}
            auctionTime="00 : 17 : 02 : 67"
            imageSrc="/assets/image6.jpeg"
          />
        </div>
      </Carousel>
      <style dangerouslySetInnerHTML={{
        __html: `
          .tribe-warrior-carousel .ant-carousel {
            position: relative;
          }
          .tribe-warrior-carousel .ant-carousel .slick-dots {
            bottom: -40px !important;
            position: absolute !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            margin: 0 !important;
            padding: 0 !important;
            list-style: none !important;
            width: auto !important;
          }
          .tribe-warrior-carousel .ant-carousel .slick-dots li {
            width: 40px !important;
            height: 4px !important;
            margin: 0 4px !important;
            padding: 0 !important;
          }
          .tribe-warrior-carousel .ant-carousel .slick-dots li button {
            width: 100% !important;
            height: 100% !important;
            border-radius: 2px !important;
            background: rgba(255, 255, 255, 0.3) !important;
            opacity: 1 !important;
            border: none !important;
            padding: 0 !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
          }
          .tribe-warrior-carousel .ant-carousel .slick-dots li.slick-active button {
            background: #7E6BEF !important;
          }
          .tribe-warrior-carousel .ant-carousel .slick-dots li button:hover {
            background: rgba(255, 255, 255, 0.5) !important;
          }
        `
      }} />
 
      <div className='w-full h-full mt-6 sm:mt-8 md:mt-10'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0'>
          <h1 className='text-white text-lg sm:text-xl md:text-2xl font-exo2'>Discover all the Tokenized collections</h1>
          <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={['click']} placement="bottomRight" className='border border-gray-800 rounded-full'>
            <a onClick={(e) => e.preventDefault()}>
              <Space 
                className='text-white font-exo2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full cursor-pointer transition-colors text-sm sm:text-base'
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {selectedNetwork}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>

        <div className="mt-6 sm:mt-8 md:mt-10 mb-8 sm:mb-10 md:mb-12">
          {isLoadingCollections ? (
            <div className="flex justify-center items-center py-12">
              <Spin size="large" />
            </div>
          ) : filteredNfts.length > 0 ? (
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 sm:gap-6 md:gap-10 lg:gap-12 overflow-x-auto pb-4 scrollbar-hide" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {filteredNfts.slice(0, visibleCards).map((nft, index) => (
                <div key={nft.collectionId || index} className="flex-shrink-0">
                  <NFTCard 
                    title={nft.title}
                    creator={nft.creator}
                    price={nft.price}
                    floorPrice={nft.floorPrice}
                    verified={nft.verified}
                    collectionId={nft.collectionId}
                    imageUrl={nft.imageUrl}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-12">
              No collections found
            </div>
          )}
        </div>
        

      </div>

    </div>
  )
}

export default TokenizedCollectionCard

