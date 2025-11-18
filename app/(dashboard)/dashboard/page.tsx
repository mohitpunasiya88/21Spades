'use client'

import { useEffect, useState } from 'react'
import ComingSoonModal from '@/components/Common/ComingSoonModal'

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(true)
  }, [])

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-80px)] bg-[#020019]">
      <ComingSoonModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Dashboard"
      />
    </div>
  )
}

