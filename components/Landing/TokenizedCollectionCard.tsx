'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { Heart, AlertTriangle, ArrowUp } from 'lucide-react'
import { Carousel, Dropdown, Space, Spin } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useRouter } from 'next/navigation'
import { apiCaller } from '@/app/interceptors/apicall/apicall'
import authRoutes from '@/lib/routes'
import { useAuthStore } from '@/lib/store/authStore'
import spadesImage from '../assets/21spades.png'
import bidIcon from '../assets/image.png'
import { HiCheckBadge } from 'react-icons/hi2'

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
        loading="lazy"
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
  floorPrice?: string
  verified?: boolean
  collectionId?: string
  imageUrl?: string
}

function NFTCard({ title, creator, floorPrice = '0.01 AVAX', verified = true, collectionId, imageUrl }: NFTCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageError, setImageError] = useState(false)
  const router = useRouter()

  const [floorValue, floorUnit] = useMemo(() => {
    const [value, unit] = floorPrice.split(' ')
    return [value, unit || 'AVAX']
  }, [floorPrice])

  const hasValidImage = !!imageUrl && !imageError

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
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col rounded-[32px] bg-gradient-to-b from-[#24084F] via-[#0B0320] to-[#050215] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.45)] overflow-hidden cursor-pointer transition-transform hover:scale-[1.015]"
    >
      <div
        className={`relative h-[220px] w-full overflow-hidden p-6 ${
          hasValidImage ? '' : 'bg-gradient-to-br from-[#5F1BFF] via-[#4210C3] to-[#0E041F]'
        }`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsFavorite(!isFavorite)
          }}
          className="absolute top-6 right-6 z-10 p-2 rounded-full border border-white/35 bg-white/10 text-white transition-colors hover:bg-white/25"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
        <div className="absolute inset-0">
          {hasValidImage ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <Image
              src={spadesImage}
              alt="21 Spade"
              width={160}
              height={160}
              className="object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 px-6 py-5">
        <div className="flex items-center gap-2 text-[#A5B3D6] text-xs sm:text-sm font-semibold font-exo2 uppercase tracking-wide">
          <span className="inline-flex items-center justify-center rounded-full bg-white/5 text-[#5CC8FF] p-1.5">
            <HiCheckBadge className="w-4 h-4" />
          </span>
          {creator || '21Spades NFTs'}
        </div>
        <h3 className="text-white text-[1.25rem] sm:text-[1.35rem] font-bold font-exo2">{title}</h3>
        <div className="h-px w-full bg-white/10" />
        <div className="flex items-center justify-between">
          <span className="text-[#7E6BEF] text-sm font-semibold font-exo2">Floor Price</span>
          <div className="flex items-center gap-2 text-white font-semibold font-exo2 text-base">
            <Image src={bidIcon} alt="AVAX" width={18} height={18} className="w-4 h-4 object-contain" />
            <span className="flex items-center gap-1">
              {floorValue}
              <span className="text-[#A3AED0] text-xs">{floorUnit}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Component with Carousel
const TokenizedCollectionCard: React.FC = () => {
  const { user } = useAuthStore()
  const [selectedNetwork, setSelectedNetwork] = useState('Avalanche')
  const [collections, setCollections] = useState<any[]>([])
  const [isLoadingCollections, setIsLoadingCollections] = useState(false)
  
  const onChange = (currentSlide: number) => {
  }

  // Fetch collections from API
  const fetchCollections = async () => {
    try {
      setIsLoadingCollections(true)
      
      // Build query params - fetch all collections (not filtered by wallet)
      const queryParams = new URLSearchParams()
      queryParams.append('page', '1')
      queryParams.append('limit', '24')
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
    const creatorName = collection?.createdBy?.name || 'Unknown Creator'
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

  const displayedCollections = useMemo(() => mappedCollections, [mappedCollections])

  return (
    <div className="w-full relative pb-12 px-6">
      <Carousel
        afterChange={onChange}
        dots={true}
        dotPosition="bottom"
        className="tribe-warrior-carousel"
        autoplay
      >
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
      <style
        dangerouslySetInnerHTML={{
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
              background: rgba(126, 107, 239, 0.25) !important;
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
              background: rgba(126, 107, 239, 0.5) !important;
            }
          `,
        }}
      />
 
      <div className='w-full h-full mt-6 sm:mt-8 md:mt-10'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0'>
          <h1 className='text-white text-lg sm:text-xl md:text-2xl font-audiowide'>Discover all the Tokenized collections</h1>
          <div className='text-white font-exo2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base inline-flex items-center border border-gray-800'>
            Avalanche
          </div>
        </div>

        <div className="mt-6 sm:mt-8 md:mt-10 mb-8 sm:mb-10 md:mb-12">
          {isLoadingCollections ? (
            <div className="flex justify-center items-center py-12">
              <Spin size="large" />
            </div>
          ) : displayedCollections.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {displayedCollections.map((nft, index) => (
                <NFTCard 
                  key={nft.collectionId || index}
                  title={nft.title}
                  creator={nft.creator}
                  floorPrice={nft.floorPrice}
                  verified={nft.verified}
                  collectionId={nft.collectionId}
                  imageUrl={nft.imageUrl}
                />
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

