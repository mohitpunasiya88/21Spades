'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { X } from 'lucide-react'
import comingSoonImage from '@/components/assets/ComingSoonBanner.svg'

interface ComingSoonModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
}

export default function ComingSoonModal({ isOpen, onClose, title }: ComingSoonModalProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
    }
  }, [isOpen])

  // Add CSS for animations
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const style = document.createElement('style')
      style.setAttribute('data-coming-soon', 'true')
      style.textContent = `
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `
      if (!document.head.querySelector('style[data-coming-soon]')) {
        document.head.appendChild(style)
      }
    }
  }, [])

  if (!isOpen) return null

  return (
    <div 
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#020019] z-10"
      style={{
        animation: 'fadeIn 0.5s ease-in-out'
      }}
    >
      {/* Page Title Indicator - Top */}
      {title && (
        <div 
          className="absolute top-6 sm:top-8 md:top-12 left-0 right-0 z-10 px-4 sm:px-6 md:px-8"
          style={{
            animation: 'slideDown 0.6s ease-out'
          }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-[1px] bg-gradient-to-r from-transparent via-[#4F01E6]/60 to-[#4F01E6] flex-1"></div>
              <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-exo2 px-4 sm:px-6 md:px-8 tracking-wide whitespace-nowrap">
                {title}
              </h1>
              <div className="h-[1px] bg-gradient-to-l from-transparent via-[#4F01E6]/60 to-[#4F01E6] flex-1"></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Coming Soon Banner - Full Height */}
      <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="relative w-full h-full max-w-full max-h-full">
          <Image
            src={comingSoonImage}
            alt="Coming Soon"
            fill
            className="object-contain"
            priority
            quality={90}
            sizes="100vw"
          />
        </div>
      </div>
    </div>
  )
}

