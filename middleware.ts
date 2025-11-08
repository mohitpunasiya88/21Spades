// Middleware for next-intl - currently using client-side locale management
// This can be enabled if you want URL-based locale routing (e.g., /en/feed, /es/feed)
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // For now, just pass through - locale is managed client-side
  return NextResponse.next();
}

export const config = {
  // Match all routes except API routes and static files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};

