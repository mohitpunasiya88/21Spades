# 21 SPADES - Social Exchange Platform

A modern Web3 social exchange platform built with Next.js, TypeScript, Tailwind CSS, and Zustand.

## Features

- 🔐 **Authentication System**
  - Sign up with email/phone
  - Login with email or phone number
  - OTP verification
  - Private routes protection

- 📱 **Dashboard**
  - Feed with posts and engagement
  - NFT Marketplace
  - Real-time chat/messaging
  - Market data (Fear & Greed Index, Market Cap)
  - Trending NFTs and collections

- 🎨 **Design**
  - Dark theme with purple/gold accents
  - Fully responsive (mobile, tablet, desktop)
  - Modern UI matching the design specifications

- 🔌 **API Integration**
  - Dummy API routes for development
  - Ready for backend integration
  - RESTful API structure

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Icons**: Lucide React, React Icons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Navigate to project directory
cd 21spades

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
21spades/
├── app/
│   ├── (auth)/          # Authentication pages
│   │   ├── signup/
│   │   ├── login/
│   │   ├── verify-otp/
│   │   └── loading/
│   ├── (dashboard)/     # Protected dashboard pages
│   │   ├── feed/
│   │   ├── marketplace/
│   │   ├── messages/
│   │   └── layout.tsx    # Dashboard layout wrapper
│   └── api/             # API routes
│       ├── auth/
│       ├── feed/
│       ├── nft/
│       ├── chat/
│       └── market/
├── components/
│   ├── Auth/            # Authentication components
│   ├── Layout/          # Navbar, Sidebar, RightSidebar
│   ├── Dashboard/      # Dashboard-specific components
│   └── PrivateRoute.tsx # Route protection
├── lib/
│   ├── store/           # Zustand stores
│   └── utils/           # Utility functions
└── types/               # TypeScript type definitions
```

## Authentication

### Test Credentials

For testing the OTP verification:
- Use any phone number format
- Enter OTP: `1234` or `1537` (dummy values)

### Authentication Flow

1. **Sign Up**: `/signup` - Create new account
2. **Login**: `/login` - Login with email or phone
3. **OTP Verification**: `/verify-otp` - Verify phone number with OTP
4. **Dashboard**: `/feed` - Protected route (requires authentication)

## Features Overview

### Feed Page
- Post creation interface
- Featured D-Drop promotions
- Feed posts with likes, comments, shares
- Category filtering
- Trending NFTs section

### Marketplace
- Browse NFTs by category
- Trending NFTs grid
- Live NFT auctions
- Filter by category (Crypto, Gaming, Fashion, etc.)

### Messages
- Chat list sidebar
- Real-time messaging interface
- Message history
- Image sharing support

### Navigation
- Left sidebar with menu items
- Top navbar with search and user profile
- Right sidebar with market data and trends

## API Routes

All API routes are located in `app/api/`:

- `POST /api/auth` - Authentication (login, signup, OTP)
- `GET /api/feed` - Fetch feed posts
- `GET /api/nft/trending` - Trending NFTs
- `GET /api/nft/live` - Live NFT auctions
- `GET /api/chat` - Chat list
- `GET /api/market` - Market data

## State Management

The project uses Zustand for state management:

- `authStore`: Authentication state, user data
- `uiStore`: UI state (sidebar, active chat, etc.)

## Styling

- Tailwind CSS v4 with custom theme
- Dark color scheme
- Purple (#8B5CF6) and Gold (#FFD700) accent colors
- Custom scrollbar styling
- Responsive breakpoints

## Environment Variables

No environment variables required for development. The project uses dummy APIs.

## Development Notes

- All API calls use dummy data for development
- Replace with real backend API endpoints when ready
- Private routes automatically redirect to login if not authenticated
- Zustand persist middleware stores auth state in localStorage

## License

© 2023 21Spades. All Rights Reserved.
