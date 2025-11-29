'use client'

import { create } from 'zustand'

const parseEpochTimestamp = (value: unknown): number | undefined => {
  if (value === undefined || value === null) return undefined
  const numericValue =
    typeof value === 'string'
      ? Number(value)
      : typeof value === 'number'
        ? value
        : Number(value)
  if (!Number.isFinite(numericValue)) return undefined
  const cleaned = Number(numericValue)
  return cleaned > 1e12 ? cleaned : cleaned * 1000
}

export interface CollectionNFT {
  id: string
  _id?: string
  name: string
  itemName?: string
  price: string
  floorPrice: string
  image?: string | null
  imageUrl?: string | null
  collectionId?: string
  erc20Token?: string
  collectionAddress?: string
  nonce?: string
  sign?: string
  ownerName?: string
  owner?: string
  description?: string
  auctionType?: number // 0 = None, 1 = Fixed Rate, 2 = Auction
  nftId?: string
  nftLongId?: string
  startingTime?: number
  endingTime?: number
  createdBy?: {
    name: string
    profilePicture: string
  }
  creator?: {
    name?: string
    profilePicture?: string | null
  }
  updatedAt?: string
  lastUpdated?: string
  category?: string
  collectionCategory?: string
  collection?: {
    category?: string
  }
  currentOwner?: {
    _id?: string
    id?: string
    name?: string
    profilePicture?: string | null
  }
}

interface SetCollectionPayload {
  collectionId: string
  collectionData?: any
  nfts?: CollectionNFT[]
}

interface CollectionStore {
  collectionId?: string
  collectionData?: any
  nfts: CollectionNFT[]
  setCollectionData: (payload: SetCollectionPayload) => void
  clearCollectionData: () => void
}

const generateFallbackId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `nft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

const resolveCollectionId = (nft: any): string | undefined => {
  const raw = nft?.collectionId ?? nft?.collection ?? nft?.collectionData
  if (!raw) return undefined
  if (typeof raw === 'string') return raw
  if (typeof raw === 'number') return String(raw)
  if (typeof raw === 'object') {
    return raw._id || raw.id || raw.slug || raw.collectionId || raw.contractAddress
  }
  return undefined
}

export const mapApiNftToCollectionNft = (nft: any): CollectionNFT => ({
  id: nft?._id || nft?.id || nft?.itemName || nft?.name || generateFallbackId(),
  _id: nft?._id || nft?.id,
  name: nft?.itemName || nft?.name || 'Unnamed NFT',
  itemName: nft?.itemName || nft?.name,
  price: nft?.price ? `${nft.price}` : '0',
  floorPrice: nft?.floorPrice ? `${nft.floorPrice} AVAX` : '0.01 AVAX',
  imageUrl: nft?.imageUrl || nft?.image || null,
  image: nft?.imageUrl || nft?.image || null,
  collectionId: resolveCollectionId(nft),
  ownerName: nft?.owner?.name || nft?.ownerName || nft?.owner || 'Unknown',
  owner: nft?.owner?.name || nft?.owner || nft?.ownerName,
  description: nft?.description || nft?.itemDescription || '',
  auctionType: nft?.auctionType !== undefined ? Number(nft.auctionType) : undefined,
  nftId: nft?.nftId ? String(nft.nftId) : nft?.tokenId ? String(nft.tokenId) : undefined,
  nftLongId: nft?.nftLongId ? String(nft.nftLongId) : undefined,
  startingTime: parseEpochTimestamp(nft?.startingTime ?? nft?.startTime),
  endingTime: parseEpochTimestamp(nft?.endingTime ?? nft?.endTime),
  createdBy: nft?.createdBy,
  creator: nft?.creator || nft?.createdBy || undefined,
  updatedAt: nft?.updatedAt ?? nft?.lastUpdated ?? nft?.modifiedAt,
  lastUpdated: nft?.lastUpdated ?? nft?.updatedAt ?? nft?.modifiedAt,
  category: nft?.category?.name || nft?.category || nft?.collectionCategory,
  collectionCategory: nft?.collectionCategory || nft?.category,
  collection: nft?.collection || undefined,
  currentOwner: nft?.currentOwner || undefined,
})

export const useCollectionStore = create<CollectionStore>((set) => ({
  collectionId: undefined,
  collectionData: undefined,
  nfts: [],
  setCollectionData: ({ collectionId, collectionData, nfts }) =>
    set((state) => ({
      collectionId,
      collectionData: collectionData ?? state.collectionData,
      nfts: nfts ?? state.nfts,
    })),
  clearCollectionData: () =>
    set({
      collectionId: undefined,
      collectionData: undefined,
      nfts: [],
    }),
}))

