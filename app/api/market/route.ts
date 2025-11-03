import { NextResponse } from 'next/server'

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json({
    fearGreed: {
      value: 60,
      label: 'Greed',
      price: '120,530.31 USD',
    },
    marketCap: {
      value: '$5.02 T',
      change: '+0.50%',
      trend: 'up',
    },
  })
}

