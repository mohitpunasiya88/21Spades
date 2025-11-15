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
    <div className="w-full min-h-[40vh] h-[45vh] sm:h-[50vh] md:h-[55vh] lg:h-[60vh] xl:h-[70vh] flex items-center justify-center p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 bg-[#020019]">
      {/* Coming Soon Image Container */}
      <div className="relative w-full max-w-[95%] sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl h-full max-h-full  overflow-hidden">
        {/* Coming Soon Image */}
        <div className="relative w-full h-full">
          <Image
            src={comingSoonImage}
            alt="Coming Soon"
            fill
            className="object-contain"
            priority
            sizes="(max-width: 640px) 95vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, (max-width: 1280px) 70vw, 60vw"
          />
        </div>
      </div>
    </div>
  )
}

