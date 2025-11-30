'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { ArrowUp, Heart, Check, LayoutGrid, LayoutList, ArrowLeft } from 'lucide-react'
import { Dropdown, Space, Avatar, Spin, Tooltip } from 'antd'
import { DownOutlined, CheckOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { apiCaller } from '@/app/interceptors/apicall/apicall'
import authRoutes from '@/lib/routes'
import spadesImage from '../assets/21spades.png'
import { useRouter } from 'next/navigation'
import SkeletonBox from '@/components/Common/SkeletonBox'

interface NFT {
  id: string
  name: string
  price: string
  floorPrice: string
  image?: string
  imageUrl?: string
  itemName?: string
  _id?: string
  nftId?: string
  auctionType?: number
  startingTime?: number | string
  endingTime?: number | string
  createdAt?: string | number | Date
  listedAt?: string | number | Date
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

// Helper function to get auction type display text
function getAuctionTypeText(auctionType?: number): string {
  if (auctionType === 1) return 'Fixed Rate'
  if (auctionType === 2) return 'Auction'
  return 'N/A'
}

// NFT Card Component for the grid
function NFTCard({
  name,
  price,
  floorPrice,
  image,
  imageUrl,
  id,
  _id,
  itemName,
  nftId: propNftId,
  collectionId,
  auctionType,
  startingTime,
  endingTime,
}: NFT & { collectionId?: string }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isAuctionLive, setIsAuctionLive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<string>('')
  const router = useRouter()
  
  const nftId = _id || propNftId || id || name
  const displayName = name || itemName || 'Unnamed NFT'
  const nftImage = imageUrl || image
  const auctionTypeText = getAuctionTypeText(auctionType)
  const isAuction = auctionType === 2
  
  // Determine if auction is live or scheduled and calculate time remaining
  useEffect(() => {
    if (!isAuction) {
      setIsAuctionLive(false)
      setTimeRemaining('')
      return
    }
    
    const checkAuctionStatus = () => {
      const now = Date.now()
      
      // Parse start time - handle multiple formats
      let startTime: number | null = null
      if (startingTime !== undefined && startingTime !== null && startingTime !== '') {
        if (typeof startingTime === 'string') {
          // Check if it's a numeric string (Unix timestamp)
          const numericValue = Number(startingTime)
          if (!isNaN(numericValue) && isFinite(numericValue)) {
            // It's a numeric string, treat as timestamp
            if (numericValue.toString().length <= 10) {
              startTime = numericValue * 1000 // Convert seconds to milliseconds
            } else {
              startTime = numericValue // Already in milliseconds
            }
          } else {
            // Try parsing as date string
            const parsed = new Date(startingTime).getTime()
            startTime = isNaN(parsed) ? null : parsed
          }
        } else if (typeof startingTime === 'number') {
          // Check if it's Unix timestamp in seconds (10 digits or less) or milliseconds (13 digits)
          if (startingTime.toString().length <= 10) {
            // It's in seconds, convert to milliseconds
            startTime = startingTime * 1000
          } else {
            // It's already in milliseconds
            startTime = startingTime
          }
        }
      }
      
      // Parse end time - handle multiple formats
      let endTime: number | null = null
      if (endingTime !== undefined && endingTime !== null && endingTime !== '') {
        if (typeof endingTime === 'string') {
          // Check if it's a numeric string (Unix timestamp)
          const numericValue = Number(endingTime)
          if (!isNaN(numericValue) && isFinite(numericValue)) {
            // It's a numeric string, treat as timestamp
            if (numericValue.toString().length <= 10) {
              endTime = numericValue * 1000 // Convert seconds to milliseconds
            } else {
              endTime = numericValue // Already in milliseconds
            }
          } else {
            // Try parsing as date string
            const parsed = new Date(endingTime).getTime()
            endTime = isNaN(parsed) ? null : parsed
          }
        } else if (typeof endingTime === 'number') {
          // Check if it's Unix timestamp in seconds (10 digits or less) or milliseconds (13 digits)
          if (endingTime.toString().length <= 10) {
            // It's in seconds, convert to milliseconds
            endTime = endingTime * 1000
          } else {
            // It's already in milliseconds
            endTime = endingTime
          }
        }
      }
      
      // Debug logging - Always log for debugging
      console.log('🔍 Auction Time Debug:', {
        displayName,
        'startingTime (raw)': startingTime,
        'endingTime (raw)': endingTime,
        'startingTime type': typeof startingTime,
        'endingTime type': typeof endingTime,
        'startTime (parsed)': startTime,
        'endTime (parsed)': endTime,
        'now': now,
        'startTimeFormatted': startTime ? new Date(startTime).toLocaleString() : 'null',
        'endTimeFormatted': endTime ? new Date(endTime).toLocaleString() : 'null',
        'nowFormatted': new Date(now).toLocaleString(),
        'isAuction': isAuction,
        'isAuctionLive': isAuctionLive,
        'timeRemaining': timeRemaining,
        'startTime > now': startTime ? startTime > now : 'N/A',
        'endTime > now': endTime ? endTime > now : 'N/A',
        'now < startTime': startTime ? now < startTime : 'N/A',
        'now >= endTime': endTime ? now >= endTime : 'N/A'
      })
      
      // If no start/end times, consider it live but no time to show
      if (!startTime && !endTime) {
        setIsAuctionLive(true)
        setTimeRemaining('')
        return
      }
      
      // Check if auction has ended
      if (endTime && now >= endTime) {
        setIsAuctionLive(false)
        setTimeRemaining('Ended')
        return
      }
      
      // Check if auction hasn't started yet (scheduled)
      if (startTime && now < startTime) {
        setIsAuctionLive(false)
        const timeUntilStart = startTime - now
        const days = Math.floor(timeUntilStart / (1000 * 60 * 60 * 24))
        const hours = Math.floor((timeUntilStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((timeUntilStart % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((timeUntilStart % (1000 * 60)) / 1000)
        
        if (days > 0) {
          setTimeRemaining(`${days}d ${hours}h`)
        } else if (hours > 0) {
          setTimeRemaining(`${hours}h ${minutes}m`)
        } else if (minutes > 0) {
          setTimeRemaining(`${minutes}m ${seconds}s`)
        } else if (seconds > 0) {
          setTimeRemaining(`${seconds}s`)
        } else {
          setTimeRemaining('Starting soon')
        }
        return
      }
      
      // Auction is live (now is between start and end, or after start if no end)
      setIsAuctionLive(true)
      
      // Calculate time remaining until end
      if (endTime && endTime > now) {
        const timeUntilEnd = endTime - now
        const days = Math.floor(timeUntilEnd / (1000 * 60 * 60 * 24))
        const hours = Math.floor((timeUntilEnd % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((timeUntilEnd % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((timeUntilEnd % (1000 * 60)) / 1000)
        
        if (days > 0) {
          setTimeRemaining(`${days}d ${hours}h`)
        } else if (hours > 0) {
          setTimeRemaining(`${hours}h ${minutes}m`)
        } else if (minutes > 0) {
          setTimeRemaining(`${minutes}m ${seconds}s`)
        } else if (seconds > 0) {
          setTimeRemaining(`${seconds}s`)
        } else {
          setTimeRemaining('Ending soon')
        }
      } else if (!endTime) {
        // No end time but auction is live
        setTimeRemaining('')
      } else {
        setTimeRemaining('Ending soon')
      }
    }
    
    checkAuctionStatus()
    const intervalId = setInterval(checkAuctionStatus, 1000)
    return () => clearInterval(intervalId)
  }, [isAuction, startingTime, endingTime])
  
  // Debug log
  useEffect(() => {
    if (isAuction) {
      console.log('NFTCard Debug:', { 
        displayName,
        auctionType, 
        auctionTypeText, 
        isAuctionLive,
        startingTime,
        endingTime,
        timeRemaining
      })
    }
  }, [isAuction, isAuctionLive, timeRemaining, startingTime, endingTime, displayName, auctionType, auctionTypeText])

  return (
    <div 
      className="relative w-full mx-auto cursor-pointer"
      onClick={() => router.push(`/marketplace/nft/${nftId}?collectionId=${collectionId}`)}
    >
      <div 
        className="relative rounded-2xl overflow-y-auto transition-transform hover:scale-[1.03] p-2 bg-[#0A0D1F] shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-[#5B5FE3]/30 nft-cards-scrollbar"
        style={{
          height: '380px',
          boxShadow: '0 8px 28px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Media box */}
        <div className="relative h-[250px] p-3">
          {/* Heart Icon */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsFavorite(!isFavorite)
            }}
            className="absolute glass top-7.5 right-7.5 z-10 p-2 rounded-full transition-colors"
            // style={{
            //   background: 'linear-gradient(180deg, rgba(126,107,239,0.45), rgba(126,107,239,0.22))',
            // }}
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
                {nftImage && !imageError ? (
                  <Image 
                    src={nftImage} 
                    alt={displayName} 
                    fill
                    className="object-cover rounded-[14px] pointer-events-none select-none"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <Image 
                    src={spadesImage} 
                    alt="21 Spade" 
                    width={125} 
                    height={125} 
                    priority
                    className="object-contain pointer-events-none select-none drop-shadow-[0_6px_14px_rgba(0,0,0,0.55)]"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="px-4 pb-4 pt-3">
          {/* NFT Name */}
          <Tooltip title={displayName} placement="top">
            <h3 className="text-white text-lg font-bold tracking-tight mb-2 font-exo2 cursor-pointer" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.35)' }}>
              {displayName.length > 20 ? `${displayName.substring(0, Math.floor(displayName.length / 2))}...` : displayName}
            </h3>
          </Tooltip>
          
          {/* Auction Type Badge, Live/Scheduled Badge and Time Display - All in same row */}
          {isAuction ? (
            <div className="mb-2.5 flex items-center justify-between gap-2 flex-wrap">
              {/* Left side: Auction Type Badge */}
              <span className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold font-exo2 ${
                Number(auctionType) === 1 
                  ? 'bg-[#7E6BEF] text-white' 
                  : Number(auctionType) === 2
                  ? 'bg-[#3B82F6] text-white'
                  : 'bg-gray-600 text-white'
              }`}>
                {auctionTypeText}
              </span>
              
              {/* Middle: Live/Scheduled Badge */}
              <div className="flex items-center gap-2">
                {isAuctionLive ? (
                  <span className="inline-flex items-center gap-1 text-[#33E030] text-[11px] font-semibold uppercase tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#33E030] animate-pulse" />
                    Live
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/40 text-[11px] font-semibold uppercase tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
                    Scheduled
                  </span>
                )}
                
                {/* Right side: Time Display */}
                {timeRemaining && timeRemaining !== '' && (
                  <>
                    {isAuctionLive ? (
                      // Live Auction - Show end time
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[#FFB600] bg-[#FFB600]/10 border border-[#FFB600]/30 text-xs font-semibold font-exo2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFB600] animate-pulse" />
                        Ends in {timeRemaining}
                      </span>
                    ) : timeRemaining === 'Ended' ? (
                      // Ended Auction
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-gray-400 bg-gray-400/10 border border-gray-400/30 text-xs font-semibold font-exo2">
                        Auction Ended
                      </span>
                    ) : (
                      // Scheduled Auction - Show start time
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/30 text-xs font-semibold font-exo2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
                        Starts in {timeRemaining}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            // Non-auction: Only show auction type badge
            <div className="mb-2.5 flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold font-exo2 ${
                Number(auctionType) === 1 
                  ? 'bg-[#7E6BEF] text-white' 
                  : Number(auctionType) === 2
                  ? 'bg-[#3B82F6] text-white'
                  : 'bg-gray-600 text-white'
              }`}>
                {auctionTypeText}
              </span>
            </div>
          )}
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ArrowUp className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span className="text-white text-sm font-semibold font-exo2">A. {price}</span>
            </div>
            <button className="px-3 py-1.5 text-xs font-medium text-gray-300 border border-gray-600 rounded-full hover:border-gray-500 transition-colors flex items-center gap-1.5">
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
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('Items')
  const [selectedSort, setSelectedSort] = useState('Price High to Low')
  const [layoutView, setLayoutView] = useState<'grid' | 'list'>('grid')
  
  // State for collection data
  const [collectionData, setCollectionData] = useState<any>(null)
  const [nfts, setNfts] = useState<NFT[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false)

  // Fetch collection by ID
  const fetchCollection = async () => {
    if (!collectionId) return
    
    try {
      setIsLoading(true)
      const url = `${authRoutes.getCollectionById}/${collectionId}`
      
      const response = await apiCaller('GET', url, null, true)
      
      if (response.success && response.data) {
        const collection = response.data.collection || response.data
        setCollectionData(collection)
      } else {
        console.warn("⚠️ Collection not found")
      }
    } catch (error: any) {
      console.error("❌ Error fetching collection:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch NFTs for this collection
  const fetchNFTs = async () => {
    if (!collectionId) return
    
    try {
      setIsLoadingNFTs(true)
      const queryParams = new URLSearchParams()
      queryParams.append('collectionId', collectionId)
      queryParams.append('page', '1')
      queryParams.append('limit', '100')
      queryParams.append('blocked', 'false')
      
      const url = `${authRoutes.getNFTsByCollection}?${queryParams.toString()}`
      
      const response = await apiCaller('GET', url, null, true)
      
      if (response.success && response.data) {
        const nftsData = Array.isArray(response.data) 
          ? response.data 
          : (response.data.items || response.data.nfts || response.data.data || [])
        
        // Map API response to NFT interface
        const mappedNFTs: NFT[] = nftsData.map((nft: any) => {
          const mapped = {
            id: nft._id || nft.id || '',
            _id: nft._id || nft.id,
            name: nft.itemName || nft.name || 'Unnamed NFT',
            itemName: nft.itemName || nft.name,
            price: nft.price ? `${nft.price}` : '0',
            floorPrice: nft.floorPrice ? `${nft.floorPrice} AVAX` : '0.01 AVAX',
            imageUrl: nft.imageUrl || nft.image || null,
            image: nft.imageUrl || nft.image || null,
            auctionType: nft.auctionType !== undefined && nft.auctionType !== null ? Number(nft.auctionType) : undefined,
            // Keep timestamps in original format - NFTCard will handle conversion
            startingTime: nft.startingTime !== undefined && nft.startingTime !== null ? nft.startingTime : undefined,
            endingTime: nft.endingTime !== undefined && nft.endingTime !== null ? nft.endingTime : undefined,
            createdAt: nft.createdAt || nft.created_at || nft.created || undefined,
            listedAt: nft.listedAt || nft.listed_at || nft.listed || undefined,
          }
          // Debug log
          console.log('📦 Mapping NFT:', { 
            name: mapped.name,
            auctionType: mapped.auctionType,
            startingTime: mapped.startingTime,
            endingTime: mapped.endingTime,
            'startingTime type': typeof mapped.startingTime,
            'endingTime type': typeof mapped.endingTime,
            'original nft': nft
          })
          return mapped
        })
        
        setNfts(mappedNFTs)
      } else {
        console.warn("⚠️ No NFTs found")
        setNfts([])
      }
    } catch (error: any) {
      console.error("❌ Error fetching NFTs:", error)
      setNfts([])
    } finally {
      setIsLoadingNFTs(false)
    }
  }

  // Fetch data on component mount and when collectionId changes
  useEffect(() => {
    if (collectionId) {
      fetchCollection()
      fetchNFTs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionId])

  // Update timer every second for Live tab
  const [timeUpdate, setTimeUpdate] = useState(0)
  useEffect(() => {
    if (activeTab === 'Live' && nfts.length > 0) {
      const interval = setInterval(() => {
        setTimeUpdate(prev => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [activeTab, nfts.length])

  // Use API data if available, otherwise use props/defaults
  const displayCollectionName = collectionData?.collectionName || collectionData?.name || collectionName
  const displayDescription = collectionData?.collectionDescription || collectionData?.description || description
  const displayFloorPrice = collectionData?.averagePrice ? `${collectionData.averagePrice} AVAX` : floorPrice
  const displayItems = collectionData?.totalCollectionNfts || collectionData?.totalNfts || items
  const displayOwners = collectionData?.totalOwners || owners
  const displayNftCount = collectionData?.totalCollectionNfts || collectionData?.totalNfts || nftCount
  const collectionImage = collectionData?.imageUrl || collectionData?.coverPhoto || null

  // Parse epoch timestamp helper
  const parseEpochTimestamp = (value: unknown): number | undefined => {
    if (value === undefined || value === null) return undefined
    if (typeof value === 'string') {
      const dateParsed = new Date(value).getTime()
      if (!isNaN(dateParsed)) {
        return dateParsed
      }
      const numParsed = Number(value)
      if (Number.isFinite(numParsed)) {
        return numParsed > 1e12 ? numParsed : numParsed * 1000
      }
      return undefined
    }
    const numericValue = typeof value === 'number' ? value : Number(value)
    if (!Number.isFinite(numericValue)) return undefined
    const cleaned = Number(numericValue)
    return cleaned > 1e12 ? cleaned : cleaned * 1000
  }

  // Filter and sort NFTs based on active tab and selected sort
  const filteredNFTs = useMemo(() => {
    let filtered: NFT[] = []
    
    // Filter NFTs based on active tab
    if (activeTab === 'Live') {
      const now = Date.now()
      filtered = nfts.filter((nft) => {
        // Only show auction type NFTs (auctionType === 2)
        if (nft.auctionType !== 2) return false
        
        const startingTime = parseEpochTimestamp(nft.startingTime)
        const endingTime = parseEpochTimestamp(nft.endingTime)
        
        // If time data exists, check if live
        if (startingTime && endingTime) {
          return now >= startingTime && now <= endingTime
        }
        
        // If no time data but it's auction type, show it
        return true
      })
    } else {
      // For "Items" tab, show all NFTs
      filtered = [...nfts]
    }
    
    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (selectedSort) {
        case 'Price High to Low': {
          const priceA = parseFloat(a.price) || 0
          const priceB = parseFloat(b.price) || 0
          return priceB - priceA
        }
        case 'Price Low to High': {
          const priceA = parseFloat(a.price) || 0
          const priceB = parseFloat(b.price) || 0
          return priceA - priceB
        }
        case 'Recently Listed': {
          // Use listedAt, createdAt, or _id for sorting
          const dateA = a.listedAt || a.createdAt
          const dateB = b.listedAt || b.createdAt
          
          if (dateA && dateB) {
            const timeA = typeof dateA === 'string' ? new Date(dateA).getTime() : (typeof dateA === 'number' ? dateA : 0)
            const timeB = typeof dateB === 'string' ? new Date(dateB).getTime() : (typeof dateB === 'number' ? dateB : 0)
            return timeB - timeA // Newest first
          }
          
          // Fallback to _id comparison if no date available
          const idA = a._id || a.id || ''
          const idB = b._id || b.id || ''
          return idB.localeCompare(idA)
        }
        case 'Oldest First': {
          // Use listedAt, createdAt, or _id for sorting
          const dateA = a.listedAt || a.createdAt
          const dateB = b.listedAt || b.createdAt
          
          if (dateA && dateB) {
            const timeA = typeof dateA === 'string' ? new Date(dateA).getTime() : (typeof dateA === 'number' ? dateA : 0)
            const timeB = typeof dateB === 'string' ? new Date(dateB).getTime() : (typeof dateB === 'number' ? dateB : 0)
            return timeA - timeB // Oldest first
          }
          
          // Fallback to _id comparison if no date available
          const idA = a._id || a.id || ''
          const idB = b._id || b.id || ''
          return idA.localeCompare(idB)
        }
        default:
          return 0
      }
    })
    
    return sorted
  }, [nfts, activeTab, timeUpdate, selectedSort])

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
    <div className="w-full min-h-screen font-exo2 ">
      {/* Back Button */}
      <div className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 mt-5">
        <button
          onClick={() => router.push('/marketplace')}
          className="flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-b from-[#4F01E6] to-[#25016E] text-white font-exo2 font-semibold hover:opacity-90 transition-opacity shadow-lg"
          style={{ cursor: 'pointer' }}
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Back</span>
        </button>
      </div>

      {/* Header Section with Radial Gradient */}
      <div 
        className="relative w-full h-auto min-h-[350px] sm:min-h-[400px] overflow-hidden"
       
      >
        <div className="relative z-10 px-4 sm:px-6 md:px-8 pt-8 sm:pt-10 md:pt-12 pb-6 md:pb-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Spin size="large" />
            </div>
          ) : (
            <div 
              className="relative rounded-2xl overflow-hidden p-6 sm:p-8 "
              style={{
                background: 'radial-gradient(ellipse at top center, #4A02D8 0%, #0F0F23 70%)',
              }}
            >
            {/* Collection Title with Spade Icon and Verified Badge */}
            <div className="flex items-start gap-4 mb-3 font-exo2">
              {/* Collection Image or Spade Icon */}
              <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                {collectionImage ? (
                  <Image 
                    src={collectionImage} 
                    alt={displayCollectionName} 
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <Image 
                    src={spadesImage} 
                    alt="21 Spades" 
                    width={64} 
                    height={64} 
                    className="object-contain"
                    priority
                  />
                )}
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-exo2 font-semibold">{displayCollectionName}</h1>
                  {(collectionData?.isVerified || collectionData?.verified) && (
                    <Avatar
                      size={32}
                      icon={<CheckOutlined />}
                      style={{
                        background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                      }}
                    />
                  )}
                </div>
                {/* NFT Count - Right below title and avatar */}
                <p className="text-white text-lg font-exo2">{displayNftCount} <span className="text-gray-400 text-base text-blue-500 font-exo2">{nftCount2}</span></p>
              </div>
            </div>

            {/* Description */}
            <p className="text-white text-base mb-6 font-exo2 max-w-[400px]">
              {displayDescription}
              <span className="text-[#C084FC] ml-2 hover:underline cursor-pointer font-bold font-exo2">More</span>
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
                    <span>{displayFloorPrice}</span>
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
                  <span className="text-white text-sm font-bold font-exo2">{displayItems}</span>
                  <span className="text-gray-400 text-xs mt-0.5 font-exo2">Items</span>
                </div>

                {/* Owners */}
                <div className="flex flex-col items-center min-w-[70px]">
                  <span className="text-white text-sm font-bold font-exo2">{displayOwners}</span>
                  <span className="text-gray-400 text-xs mt-0.5 font-exo2">Owners</span>
                </div>
              </div>
            </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation and Filter Bar */}
      <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 ">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          {/* Tabs */}
          <div className="flex justify-center items-center gap-8 sm:gap-8 md:gap-10 w-full sm:w-auto overflow-x-auto">
            {['Items', 'Live'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm sm:text-base transition-colors font-exo2 whitespace-nowrap font-bold cursor-pointer ${
                  activeTab === tab
                    ? 'text-[#7E6BEF] font-bold border-b border-[#7E6BEF] pb-2'
                    : 'text-[#9CA3AF] hover:text-[#D1D5DB] font-medium'
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
            <div className="flex items-center gap-0 border border-white/10 rounded-full bg-[#1A1A2E]">
              <button
                onClick={() => setLayoutView('list')}
                className={`p-2 rounded-l-full transition-colors ${
                  layoutView === 'list' ? 'bg-[#7E6BEF] text-white' : 'bg-transparent text-gray-400 hover:text-white'
                }`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayoutView('grid')}
                className={`p-2 rounded-r-full transition-colors ${
                  layoutView === 'grid' ? 'bg-[#7E6BEF] text-white' : 'bg-transparent text-gray-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* NFT Cards Grid */}
      <div 
        className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 max-h-[calc(100vh-300px)] overflow-y-auto nft-cards-scrollbar"
      >
        {isLoadingNFTs ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="relative w-full mx-auto">
                <div 
                  className="relative rounded-2xl overflow-hidden p-2 bg-[#0A0D1F] shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-[#5B5FE3]/30"
                  style={{
                    height: '380px',
                    boxShadow: '0 8px 28px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
                  }}
                >
                  {/* Media box skeleton */}
                  <div className="relative h-[250px] p-3">
                    <div className="absolute inset-0 p-3.5">
                      <div className="relative p-3 h-full w-full rounded-[14px] overflow-hidden ring-1 ring-white/10 bg-[#050616]">
                        <SkeletonBox width="100%" height="100%" radius={14} />
                      </div>
                    </div>
                    {/* Heart icon skeleton */}
                    <div className="absolute top-7.5 right-7.5 z-10">
                      <SkeletonBox width={36} height={36} radius="50%" />
                    </div>
                  </div>

                  {/* Bottom Section skeleton */}
                  <div className="px-4 pb-4 pt-3">
                    {/* NFT Name skeleton */}
                    <div className="mb-2">
                      <SkeletonBox width="70%" height={24} radius={4} />
                    </div>
                    
                    {/* Badge skeleton */}
                    <div className="mb-2.5 flex items-center gap-2">
                      <SkeletonBox width={80} height={24} radius={6} />
                      <SkeletonBox width={60} height={20} radius={12} />
                    </div>
                    
                    {/* Price and Details skeleton */}
                    <div className="flex items-center justify-between">
                      <SkeletonBox width={80} height={20} radius={4} />
                      <SkeletonBox width={70} height={28} radius={20} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredNFTs.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredNFTs.map((nft) => (
              <div key={nft._id || nft.id} className="rounded-2xl">
                <NFTCard 
                  id={nft.id}
                  _id={nft._id}
                  nftId={nft.nftId}
                  name={nft.name}
                  itemName={nft.itemName}
                  price={nft.price}
                  floorPrice={nft.floorPrice}
                  image={nft.image}
                  imageUrl={nft.imageUrl}
                  collectionId={collectionId}
                  auctionType={nft.auctionType}
                  startingTime={nft.startingTime}
                  endingTime={nft.endingTime}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">
            {activeTab === 'Live' ? 'No live auctions found' : 'No NFTs found in this collection'}
          </div>
        )}
      </div>
    </div>
  )
}

