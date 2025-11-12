'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ArrowUp, Heart, Check, LayoutGrid, LayoutList, Grid3x3 } from 'lucide-react'
import { Dropdown, Space, Avatar } from 'antd'
import { DownOutlined, CheckOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import spadesImage from '../assets/21spades.png'
import { useRouter } from 'next/navigation'

interface NFT {
  id: string
  name: string
  price: string
  floorPrice: string
  image?: string
}

interface CollectionProfileProps {
  collectionId?: string
  collectionName?: string
  nftCount?: string
  description?: string
  floorPrice?: string
  volume24h?: string
  totalVolume?: string
  items?: string
  owners?: string
  nftCount2?: string
}

// NFT Card Component for the grid
function NFTCard({ name, price, floorPrice, image }: NFT) {
  const [isFavorite, setIsFavorite] = useState(false)
  const router = useRouter()

  return (
    <div 
      className="relative w-full mx-auto cursor-pointer"
      onClick={() => router.push(`/marketplace/nft/${name}`)}
    >
      <div 
        className="relative rounded-2xl overflow-hidden transition-transform hover:scale-[1.03] p-2 bg-[#0A0D1F] shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-[#5B5FE3]/30"
        style={{
          height: '325px',
          boxShadow: '0 8px 28px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Media box */}
        <div className="relative h-[214px] p-3">
          {/* Heart Icon */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsFavorite(!isFavorite)
            }}
            className="absolute top-7.5 right-7.5 z-10 p-2 rounded-full transition-colors ring-1 ring-white/25"
            style={{
              background: 'linear-gradient(180deg, rgba(126,107,239,0.45), rgba(126,107,239,0.22))',
            }}
          >
            
            <Heart 
              className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white stroke-2'}`}
            />
          </button>

          {/* Padded media with gradient */}
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
                  width={125} 
                  height={125} 
                  priority
                  className="object-contain pointer-events-none select-none drop-shadow-[0_6px_14px_rgba(0,0,0,0.55)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="px-4 pb-4 pt-3">
          {/* NFT Name */}
          <h3 className="text-white text-lg font-bold tracking-tight mb-2 font-exo2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.35)' }}>
            {name}
          </h3>
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ArrowUp className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span className="text-white text-sm font-semibold font-exo2">A. {price}</span>
            </div>
            <button className="px-3 py-1.5 text-xs font-medium text-gray-300 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors flex items-center gap-1.5">
              <span className="font-exo2">Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CollectionProfile({
  collectionId = '21-nft-spades',
  collectionName = '21 Nft Spades',
  nftCount = '2.2M',
  nftCount2 = ' NFTs',
  description = '21 spades domains are secure domain names for the decentralized world. Easy to access...',
  floorPrice = '0.01 AVAX',
  volume24h = '0.8',
  totalVolume = '125K',
  items = '700K',
  owners = '725',
}: CollectionProfileProps) {
  const [activeTab, setActiveTab] = useState('Items')
  const [selectedSort, setSelectedSort] = useState('Price High to Low')
  const [layoutView, setLayoutView] = useState<'grid' | 'list' | 'large-grid'>('large-grid')

  // Sample NFT data
  const nfts: NFT[] = [
    { id: '1', name: 'sleeper_tyu.avax', price: '8.56', floorPrice: '0.01 AVAX' },
    { id: '2', name: 'warrior_abc.avax', price: '12.34', floorPrice: '0.01 AVAX' },
    { id: '3', name: 'guardian_xyz.avax', price: '5.67', floorPrice: '0.01 AVAX' },
    { id: '4', name: 'spade_123.avax', price: '9.89', floorPrice: '0.01 AVAX' },
    { id: '5', name: 'king_456.avax', price: '15.20', floorPrice: '0.01 AVAX' },
    { id: '6', name: 'queen_789.avax', price: '7.45', floorPrice: '0.01 AVAX' },
    { id: '7', name: 'ace_012.avax', price: '11.11', floorPrice: '0.01 AVAX' },
    { id: '8', name: 'joker_345.avax', price: '6.78', floorPrice: '0.01 AVAX' },
    { id: '9', name: 'master_678.avax', price: '13.90', floorPrice: '0.01 AVAX' },
  ]

  const sortItems: MenuProps['items'] = [
    { label: 'Price High to Low', key: 'price-high' },
    { label: 'Price Low to High', key: 'price-low' },
    { label: 'Recently Listed', key: 'recent' },
    { label: 'Oldest First', key: 'oldest' },
  ]

  const handleSortClick: MenuProps['onClick'] = (e) => {
    const selectedItem = sortItems.find(item => item?.key === e.key)
    if (selectedItem && 'label' in selectedItem) {
      setSelectedSort(selectedItem.label as string)
    }
  }

  return (
    <div className="w-full min-h-screen ">
      {/* Header Section with Radial Gradient */}
      <div 
        className="relative w-full h-auto min-h-[350px] sm:min-h-[400px] overflow-hidden"
       
      >
        <div className="relative z-10 px-4 sm:px-6 md:px-8 pt-8 sm:pt-10 md:pt-12 pb-6 md:pb-8">
          {/* Card/Box Container with Border */}
          <div 
            className="relative rounded-2xl overflow-hidden p-6 sm:p-8 border border-white/10"
            style={{
              background: 'radial-gradient(ellipse at top center, #4A02D8 0%, #0F0F23 70%)',
            }}
          >
            {/* Collection Title with Spade Icon and Verified Badge */}
            <div className="flex items-start gap-4 mb-3">
              {/* Spade Icon */}
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image 
                  src={spadesImage} 
                  alt="21 Spades" 
                  width={64} 
                  height={64} 
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-exo2 font-bold">{collectionName}</h1>
                  <Avatar
                    size={32}
                    icon={<CheckOutlined />}
                    // className="!bg-gradient-to-br !from-[#3B82F6] !to-[#2563EB] !flex !items-center !justify-center"
                    style={{
                    //   background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                    //   boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    }}
                  />
                </div>
                {/* NFT Count - Right below title and avatar */}
                <p className="text-white text-lg font-exo2">{nftCount} <span className="text-gray-400 text-base text-blue-500 font-exo2">{nftCount2}</span></p>
              </div>
            </div>

            {/* Description */}
            <p className="text-white text-base mb-6 font-exo2 max-w-[300px]">
              {description}
              <span className="text-[#C084FC] ml-2 hover:underline cursor-pointer font-exo2">More</span>
            </p>

            {/* Stats Pill */}
            <div className="mt-6">
              <div
                className="relative inline-flex items-center gap-6 py-4"
              >
                {/* Floor Price */}
                <div className="flex flex-col items-center min-w-[100px]">
                  <div className="flex items-center gap-1.5 text-white text-sm font-bold font-exo2">
                    <ArrowUp className="text-red-500 w-3.5 h-3.5 fill-red-500" />
                    <span>{floorPrice}</span>
                  </div>
                  <span className="text-gray-400 text-xs mt-0.5 font-exo2">Floor 0%</span>
                </div>

                {/* 24h Volume */}
                <div className="flex flex-col items-center min-w-[80px]">
                  <div className="flex items-center gap-1.5 text-white text-sm font-bold font-exo2">
                    <ArrowUp className="text-red-500 w-3.5 h-3.5 fill-red-500" />
                    <span>{volume24h}</span>
                  </div>
                  <span className="text-gray-400 text-xs mt-0.5 font-exo2">24h Vol 0%</span>
                </div>

                {/* Total Volume */}
                <div className="flex flex-col items-center min-w-[90px]">
                  <div className="flex items-center gap-1.5 text-white text-sm font-bold font-exo2">
                    <ArrowUp className="text-red-500 w-3.5 h-3.5 fill-red-500" />
                    <span>{totalVolume}</span>
                  </div>
                  <span className="text-gray-400 text-xs mt-0.5 font-exo2">Total Vol</span>
                </div>

                <div className="w-px h-12 bg-white/20" />

                {/* Items */}
                <div className="flex flex-col items-center min-w-[70px]">
                  <span className="text-white text-sm font-bold font-exo2">{items}</span>
                  <span className="text-gray-400 text-xs mt-0.5 font-exo2">Items</span>
                </div>

                {/* Owners */}
                <div className="flex flex-col items-center min-w-[70px]">
                  <span className="text-white text-sm font-bold font-exo2">{owners}</span>
                  <span className="text-gray-400 text-xs mt-0.5 font-exo2">Owners</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation and Filter Bar */}
      <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          {/* Tabs */}
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 w-full sm:w-auto overflow-x-auto">
            {['Items', 'Live', 'Activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm sm:text-base font-medium transition-colors font-exo2 whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-white border-b-2 border-[#7E6BEF] pb-2'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Sort and Layout Controls */}
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
            {/* Sort Dropdown */}
            <Dropdown menu={{ items: sortItems, onClick: handleSortClick }} trigger={['click']} placement="bottomRight">
              <a onClick={(e) => e.preventDefault()}>
                <Space 
                  className='bg-[#1A1A2E] text-white px-4 py-2 rounded-full cursor-pointer hover:bg-[#252540] transition-colors border border-white/10 font-exo2'
                >
                  {selectedSort}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>

            {/* Layout Toggles */}
            <div className="flex items-center gap-2 border border-white/10 rounded-full pr-3 pl-3 p-1 bg-[#1A1A2E]">
              <button
                onClick={() => setLayoutView('list')}
                className={`p-2 rounded transition-colors ${
                  layoutView === 'list' ? 'bg-[#4A02D8] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayoutView('grid')}
                className={`p-2 rounded transition-colors ${
                  layoutView === 'grid' ? 'bg-[#4A02D8] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayoutView('large-grid')}
                className={`p-2 rounded transition-colors ${
                  layoutView === 'large-grid' ? 'bg-[#4A02D8] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* NFT Cards Grid */}
      <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6">
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {nfts.map((nft) => (
            <div key={nft.id} className="border border-gray-700 rounded-2xl">
            <NFTCard 
              id={nft.id}
              name={nft.name}
              price={nft.price}
              floorPrice={nft.floorPrice}
              image={nft.image}
            />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

