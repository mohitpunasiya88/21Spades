'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { X } from 'lucide-react'
import comingSoonImage from '@/components/assets/Coming soon.png'

interface ComingSoonModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
}

export default function ComingSoonModal({ isOpen, onClose, title }: ComingSoonModalProps) {
  const router = useRouter()

  // Add CSS for twinkling animation
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const style = document.createElement('style')
      style.setAttribute('data-twinkle', 'true')
      style.textContent = `
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `
      if (!document.head.querySelector('style[data-twinkle]')) {
        document.head.appendChild(style)
      }
    }
  }, [])


  if (!isOpen) return null

  return (
    <div className="w-full h-[50vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh] flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 bg-[#020019]">
      {/* Coming Soon Image Container */}
      <div className="relative w-full max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl h-full rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50">
        {/* Coming Soon Image */}
        <div className="relative w-full h-full">
          <Image
            src={comingSoonImage}
            alt="Coming Soon"
            fill
            className="object-contain sm:object-contain md:object-cover"
            priority
          />
        </div>
      </div>
    </div>
  )
}

