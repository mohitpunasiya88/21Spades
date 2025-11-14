'use client'

import { useEffect, useState } from 'react'
import ComingSoonModal from '@/components/Common/ComingSoonModal'

export default function TrendingPage() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#020019]">
      <ComingSoonModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Trending"
      />
    </div>
  )
}

