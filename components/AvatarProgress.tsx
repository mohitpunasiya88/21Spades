'use client'

import React from 'react'

interface AvatarProgressProps {
  src?: string
  alt?: string
  size?: number
  progress?: number // 0-100
  strokeWidth?: number
  className?: string
  children?: React.ReactNode
  fallbackText?: string
  fallbackIcon?: string
  backgroundColor?: string // For special backgrounds like yellow
}

export default function AvatarProgress({
  src,
  alt = 'Avatar',
  size = 40,
  progress = 75,
  strokeWidth = 3,
  className = '',
  children,
  fallbackText,
  fallbackIcon,
  backgroundColor
}: AvatarProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className={`relative flex-shrink-0 ${className}`} style={{ width: size, height: size }}>
      {/* Background color layer (for special cases like yellow) */}
      {backgroundColor && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            backgroundColor,
            width: size,
            height: size,
            zIndex: 0
          }}
        />
      )}
      {/* SVG Progress Circle */}
      <svg
        className="absolute inset-0 transform -rotate-90"
        width={size}
        height={size}
        style={{ zIndex: 1 }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
        </defs>
      </svg>

      {/* Avatar Container */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden flex items-center justify-center"
        style={{
          width: size - strokeWidth * 2,
          height: size - strokeWidth * 2,
          top: strokeWidth,
          left: strokeWidth,
          zIndex: 2
        }}
      >
        {children ? (
          children
        ) : src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover rounded-full"
          />
        ) : fallbackIcon ? (
          <img
            src={fallbackIcon}
            alt={alt}
            className="w-full h-full object-contain rounded-full"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">
              {fallbackText || 'U'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

