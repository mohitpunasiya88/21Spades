'use client'

import NFTDetails from '@/components/Landing/NFTDetails'
import { useParams, useSearchParams } from 'next/navigation'

export default function NFTDetailsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params.id as string
  const collectionId = searchParams.get('collectionId') || undefined
  return <NFTDetails id={id} collectionId={collectionId} />
}


