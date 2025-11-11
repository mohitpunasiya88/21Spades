'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ArrowUp, Heart, Check, AlertTriangle } from 'lucide-react'
import { Carousel, Dropdown, Space } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useRouter } from 'next/navigation'
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
    <div className="relative w-full h-64 rounded-lg overflow-hidden mt-10 p-4">
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
      <div className="relative h-full flex flex-col mt-14">
        {/* Title and Creator Section - Bottom Left */}
        <div className="absolute bottom-16 left-10 z-10">
          <h1 className="text-white text-4xl font-exo2 mb-1">
            {title}
          </h1>
          <p className="text-white font-exo2 text-base">
            by {creatorAddress}
          </p>
        </div>
        
        {/* Data Panel - Glass pill centered with angled shape */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20">
          <div
            className="relative flex items-center gap-5 px-6 py-4 backdrop-blur-xl ring-1 ring-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
            style={{
              background: 'linear-gradient(180deg, rgba(20,20,30,0.75) 0%, rgba(20,20,30,0.60) 100%)',
              clipPath: 'polygon(16px 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 16px 100%, 0 50%)',
              WebkitClipPath: 'polygon(16px 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 16px 100%, 0 50%)',
            }}
          >
            {/* Price */}
            <div className="flex flex-col items-center min-w-[100px]">
              <div className="flex items-center gap-1.5 text-white text-sm font-bold">
                <ArrowUp className="text-red-500 w-3.5 h-3.5 fill-red-500" />
                <span className="font-exo2">{price} {currency}</span>
              </div>
              <span className="text-[#C084FC] text-xs mt-0.5">Price</span>
            </div>

            {/* Divider */}
            <div className="w-px h-12 bg-white/20" />

            {/* Items */}
            <div className="flex flex-col items-center min-w-[70px]">
              <span className="text-white text-sm font-bold">{items}</span>
              <span className="text-[#C084FC] text-xs mt-0.5">Items</span>
            </div>

            {/* Divider */}
            <div className="w-px h-12 bg-white/20" />

            {/* Auction Timer */}
            <div className="flex flex-col items-center min-w-[160px]">
              <span className="text-white text-sm font-bold font-mono whitespace-nowrap">{auctionTime}</span>
              <span className="text-[#C084FC] text-xs mt-0.5">Auction starts in</span>
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
}

function NFTCard({ title, creator, price, floorPrice = '0.01 AVAX', verified = true }: NFTCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const router = useRouter()

  const handleCardClick = () => {
    // Navigate to collection page with collection ID based on title
    const collectionId = title.toLowerCase().replace(/\s+/g, '-')
    router.push(`/marketplace/collection/${collectionId}`)
  }

  return (
    <div className="relative w-full max-w-[320px] mx-auto">
      <div 
        onClick={handleCardClick}
        className="relative rounded-2xl overflow-hidden cursor-pointer transition-transform hover:scale-[1.03] m-2 p-3 bg-[#0A0D1F] shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-[#5B5FE3]/30"
        style={{
          minHeight: '370px',
          boxShadow: '0 8px 28px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Media box */}
        <div className="relative h-[214px] p-3">
          {/* Heart Icon - Top Right with light purple background */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsFavorite(!isFavorite)
            }}
            className="absolute top-3.5 right-3.5 z-10 p-2 rounded-full transition-colors ring-1 ring-white/25"
            style={{
              background: 'linear-gradient(180deg, rgba(126,107,239,0.45), rgba(126,107,239,0.22))',
            }}
          >
            <Heart 
              className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white stroke-2'}`}
            />
          </button>

          {/* Padded media with gradient and vignette */}
          <div className="absolute inset-0 p-3.5">
            <div
              className="relative p-3 h-full w-full rounded-[14px] overflow-hidden ring-1 ring-white/10 bg-[#050616]"
              style={{ background: 'radial-gradient(120% 120% at 50% 0%,rgb(78, 13, 255) 0%, #180B34 68%, #070817 100%)' }}
            >
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: 'radial-gradient(120% 100% at 50% 0%, rgba(0,0,0,0) 52%, rgba(5,6,20,0.65) 100%)' }}
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-[#7E6BEF]/25 rounded-[14px]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Image 
                  src={spadesImage} 
                  alt="21 Spade" 
                  width={145} 
                  height={145} 
                  priority
                  className="object-contain pointer-events-none select-none drop-shadow-[0_6px_14px_rgba(0,0,0,0.55)]"
                />
              </div>
            </div>
          </div>
         
        </div>

        {/* Bottom Section - Information */}
        <div 
          className="px-4 pb-4 pt-3"
          style={{
            // background: 'linear-gradient(to bottom, rgba(25, 11, 63, 0.3), rgba(0,0,0,0.6))',
          }}
        >
          {/* Creator */}
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#162345] ring-1 ring-[#3B82F6]/45">
              <Check className="w-3.5 h-3.5 text-[#69A8FF]" />
            </span>
            <span className="text-[#D6DEFF] text-sm font-medium font-exo2">{creator}</span>
          </div>

          {/* Title */}
          <h3 className="text-white text-[21px] font-bold tracking-tight mb-3 font-exo2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.35)' }}>
            {title}
          </h3>
          <div className="h-px w-full bg-white/10 mb-3" />

          {/* Floor Price Section */}
          <div className="flex items-center justify-between">
            <span className="text-[#7E6BEF] text-sm font-medium font-exo2">Floor Price</span>
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-[14px] h-[14px] text-[#FF5E57] flex-shrink-0" />
              <span className="text-white text-sm font-semibold tracking-wide font-exo2">{floorPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Component with Carousel
const TokenizedCollectionCard: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [selectedNetwork, setSelectedNetwork] = useState('Avalanche')
  
  const onChange = (currentSlide: number) => {
    console.log(currentSlide)
  }

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
    console.log('Selected network:', e.key)
  }

  const allNfts = [
    { title: 'Aether Guardian', creator: '21Spades NFTs', price: '0.01 AVAX', floorPrice: '0.01 AVAX', category: 'Crypto' },
    { title: 'Aether Guardian', creator: '21Spades NFTs', price: '0.01 AVAX', floorPrice: '0.01 AVAX', category: 'Crypto' },
    { title: 'Aether Guardian', creator: '21Spades NFTs', price: '0.01 AVAX', floorPrice: '0.01 AVAX', category: 'Crypto' },
  ];


  const filteredNfts = activeCategory === 'ALL' 
    ? allNfts 
    : allNfts.filter(nft => nft.category === activeCategory);

  return (
    <div className="w-full relative pb-12">
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
 
      <div className='w-full h-full p-4 mt-10'>
        <div className='flex items-center justify-between pr-10 pl-10'>
          <h1 className='text-white text-2xl font-exo2'>Discover all the Tokenized collections</h1>
          <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={['click']} placement="bottomRight" className='border border-gray-800 rounded-full'>
            <a onClick={(e) => e.preventDefault()}>
              <Space 
                className=' text-white font-exo2 px-4 py-2 rounded-full cursor-pointer transition-colors'
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

        <div className="grid grid-cols-1 md:grid-cols-2 mt-10 lg:grid-cols-3 gap-8 mb-12 mx-auto max-w-7xl">
          {filteredNfts.length > 0 ? (
            filteredNfts.slice(0, 6).map((nft, index) => (
              <NFTCard 
                
                key={index} 
                title={nft.title}
                creator={nft.creator}
                price={nft.price}
                floorPrice={nft.floorPrice}
                verified={true}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-12">
              No NFTs found in this category
            </div>
          )}
        </div>
        

      </div>

    </div>
  )
}

export default TokenizedCollectionCard

