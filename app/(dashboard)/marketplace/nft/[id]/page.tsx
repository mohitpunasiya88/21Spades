'use client'

import NFTDetails from '@/components/Landing/NFTDetails'
import { useParams } from 'next/navigation'

export default function NFTDetailsPage() {
  const params = useParams()
  const id = params.id as string
  return <NFTDetails id={id} />
}


