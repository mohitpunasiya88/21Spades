'use client'

import CollectionProfile from '@/components/Landing/CollectionProfile'
import { useParams } from 'next/navigation'

export default function CollectionPage() {
  const params = useParams()
  const collectionId = params.id as string

  // You can fetch collection data based on collectionId here
  // For now, using default props
  return <CollectionProfile collectionId={collectionId} />
}

