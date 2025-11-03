import { NextResponse } from 'next/server'

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const nfts = Array.from({ length: 4 }, (_, i) => ({
    id: `live-${i + 1}`,
    name: 'Aether Guardian',
    collection: '21 Spades NFTs',
    edition: `1 of 323`,
    price: 0.55,
    currency: 'ETH',
    image: '/api/placeholder/300/300',
    likes: Math.floor(Math.random() * 1000),
  }))

  return NextResponse.json({ nfts })
}

