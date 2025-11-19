'use client'

import { create } from 'zustand'

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
  createdBy?: {
    name: string
    profilePicture: string
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
  createdBy: nft?.createdBy,
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

