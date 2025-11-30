'use client'

import React from 'react'

interface NFTNotFoundBannerProps {
  title?: string
  subtitle?: string
  className?: string
}

export default function NFTNotFoundBanner({ 
  title = "",
  subtitle = ". LOOKS LIKE THIS ASSET ISN'T HERE ANYMORE.",
  className = ""
}: NFTNotFoundBannerProps) {
  return (
    <div className={`relative w-full col-span-full rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Cosmic Background with Gradient - Vertical gradient (lighter in center, darker at edges) */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #1a0b2e 0%, #1e3a5f 50%, #1a0b2e 100%)',
        }}
      >
        {/* Stars */}
        <div className="absolute inset-0">
          {Array.from({ length: 100 }).map((_, i) => {
            const size = Math.random() * 2 + 1
            const delay = Math.random() * 3 + 2
            return (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.8 + 0.2,
                  animation: `twinkle ${delay}s infinite`,
                }}
              />
            )
          })}
        </div>

        {/* Celestial Bodies / Planets - Matching Figma Design */}
        {/* Large Planet - Blue/Purple/Pink - Top Right (Prominent) */}
        <div
          className="absolute rounded-full"
          style={{
            width: '220px',
            height: '220px',
            right: '3%',
            top: '-15%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, rgba(139, 92, 246, 0.4) 40%, rgba(236, 72, 153, 0.3) 70%, transparent 100%)',
            filter: 'blur(25px)',
          }}
        />

        {/* Small Planet - Yellowish-Orange with Purple Tint - Mid Left */}
        <div
          className="absolute rounded-full"
          style={{
            width: '120px',
            height: '120px',
            left: '8%',
            top: '45%',
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, rgba(251, 146, 60, 0.3) 40%, rgba(139, 92, 246, 0.25) 70%, transparent 100%)',
            filter: 'blur(18px)',
          }}
        />

        {/* Small Planet - Blue/Purple - Bottom Right */}
        <div
          className="absolute rounded-full"
          style={{
            width: '100px',
            height: '100px',
            right: '12%',
            bottom: '-5%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, rgba(139, 92, 246, 0.3) 60%, transparent 100%)',
            filter: 'blur(15px)',
          }}
        />

        {/* Very Faint Blue Glow - Mid Bottom Left */}
        <div
          className="absolute rounded-full"
          style={{
            width: '150px',
            height: '150px',
            left: '5%',
            bottom: '10%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 50%, transparent 100%)',
            filter: 'blur(20px)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[350px] px-4 py-8">
        {/* Main Title - Split into 3 lines */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight font-audiowide">
            <span className="block">OOPS! {title}</span>
            <span className="block">NOT FOUND :(</span>
            {/* <span className="block"></span> */}
          </h1>
        </div>

        {/* Subtitle - Light purple/lavender color */}
        <p className="text-lg sm:text-lg md:text-lg font-bold font-exo2 uppercase" style={{ color: '#884DFF' }}>
          {subtitle}
        </p>
      </div>
    </div>
  )
}

