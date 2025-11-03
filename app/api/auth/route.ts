import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { type, ...data } = body

  if (type === 'login') {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return NextResponse.json({
      success: true,
      token: 'dummy-token',
      user: {
        id: '1',
        name: 'Spades',
        username: data.username,
        email: 'user@example.com',
      },
    })
  }

  if (type === 'signup') {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return NextResponse.json({
      success: true,
      token: 'dummy-token',
      user: {
        id: '1',
        ...data,
      },
    })
  }

  if (type === 'send-otp') {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return NextResponse.json({
      success: true,
      otpSent: true,
    })
  }

  if (type === 'verify-otp') {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    if (data.otp === '1234' || data.otp === '1537') {
      return NextResponse.json({
        success: true,
        token: 'dummy-token',
        user: {
          id: '1',
          name: 'Spades',
          username: 'spades',
          phone: data.phone,
        },
      })
    }
    return NextResponse.json(
      { success: false, error: 'Invalid OTP' },
      { status: 400 }
    )
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
}

