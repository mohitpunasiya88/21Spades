import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') || 'all'

  await new Promise((resolve) => setTimeout(resolve, 500))

  const posts = [
    {
      id: '1',
      username: '21Spades',
      verified: true,
      timeAgo: '8h',
      walletAddress: '0xcy7rt98y',
      content:
        'Lorem ipsum dolor sit amet consectetur. Massa est velit pellentesque sit commodo id. Elementum consectetur et sed ac fames adipiscing arcu lectus.',
      image: '/api/placeholder/600/400',
      likes: 24500,
      comments: 50,
      shares: 2,
      saves: 20,
    },
    {
      id: '2',
      username: 'Web3Creator',
      verified: true,
      timeAgo: '12h',
      walletAddress: '0xabc123',
      content: 'Just minted my first NFT collection! Check it out.',
      image: '/api/placeholder/600/400',
      likes: 3200,
      comments: 120,
      shares: 45,
      saves: 89,
    },
  ]

  return NextResponse.json({ posts })
}

