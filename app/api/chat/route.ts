import { NextResponse } from 'next/server'

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const chats = [
    { id: '1', name: 'Magnus Nelson', time: '16:45', avatar: '/api/placeholder/40/40' },
    { id: '2', name: 'Travis Barker', time: '14:30', avatar: '/api/placeholder/40/40', isOnline: true },
    { id: '3', name: 'Kate Rose', time: '12:15', avatar: '/api/placeholder/40/40' },
  ]

  return NextResponse.json({ chats })
}

