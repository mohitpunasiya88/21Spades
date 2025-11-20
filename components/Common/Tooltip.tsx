'use client'

import { useState } from 'react'

interface TooltipProps {
  message: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  disabled?: boolean
}

export default function Tooltip({ 
  message, 
  children, 
  position = 'top',
  disabled = false 
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  if (disabled || !message) {
    return <>{children}</>
  }

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-1 border-t border-l',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-b border-r',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-1 border-l border-b',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-1 border-r border-t',
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 ${positionClasses[position]} px-3 py-2 text-xs font-exo2 text-white bg-[#1a1a2e] border border-[#FFFFFF33] rounded-lg shadow-lg whitespace-nowrap pointer-events-none transition-opacity duration-150`}
        >
          {message}
          {/* Arrow */}
          <div
            className={`absolute w-2 h-2 bg-[#1a1a2e] border-[#FFFFFF33] rotate-45 ${arrowClasses[position]}`}
          />
        </div>
      )}
    </div>
  )
}

