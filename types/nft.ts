export interface NFT {
  id: string
  name: string
  collection: string
  image: string
  price: number
  currency: string
  likes: number
  owner?: string
  edition?: string
}

