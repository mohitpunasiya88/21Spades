// 'use client'

import TokenizedCollectionCard from "@/components/Landing/TokenizedCollectionCard";

// import { useEffect, useState } from 'react'
// import { Heart } from 'lucide-react'
// import type { NFT } from '@/types/nft'
// import TokenizedCollectionCard from '@/components/Landing/TokenizedCollectionCard'

// export default function MarketplacePage() {
//   const [trending, setTrending] = useState<NFT[]>([])
//   const [live, setLive] = useState<NFT[]>([])
//   const [selectedCategory, setSelectedCategory] = useState('ALL')

//   useEffect(() => {
//     fetch('/api/nft/trending')
//       .then((res) => res.json())
//       .then((data) => setTrending(data.nfts))

//     fetch('/api/nft/live')
//       .then((res) => res.json())
//       .then((data) => setLive(data.nfts))
//   }, [])

//   const categories = ['ALL', 'Crypto', 'Gaming', 'Ticketing', 'Fashion', 'NFT', 'Real Estate', 'AI']

//   return (
//     <>
//     <div className="max-w-7xl mx-auto p-6">
//       <h1 className="text-yellow-400 text-4xl font-exo2 mb-4">NFT Marketplace</h1>
//       <p className="text-gray-400 mb-8">
//         Discover a curated collection of unique digital assets and rare collectibles from top artists.
//       </p>

//       {/* Category Filters */}
//       <div className="flex gap-2 mb-8 overflow-x-auto">
//         {categories.map((cat) => (
//           <button
//             key={cat}
//             onClick={() => setSelectedCategory(cat)}
//             className={`px-4 py-2 rounded-lg font-exo2 whitespace-nowrap transition-colors ${
//               selectedCategory === cat
//                 ? 'bg-purple-600 text-white'
//                 : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
//             }`}
//           >
//             {cat}
//           </button>
//         ))}
//       </div>

//       {/* Trending Section */}
//       <div className="mb-12">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-yellow-400 text-2xl font-exo2">Trending</h2>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {trending.map((nft) => (
//             <div
//               key={nft.id}
//               className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-purple-600 transition-colors"
//             >
//               <div className="w-full h-64 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
//                 <div className="text-center">
//                   <div className="text-6xl font-exo2 text-white mb-2">21</div>
//                   <div className="text-white text-sm">SPADES</div>
//                 </div>
//               </div>
//               <div className="p-4">
//                 <p className="text-gray-400 text-sm mb-1">{nft.collection}</p>
//                 <p className="text-gray-500 text-xs mb-2">{nft.edition}</p>
//                 <p className="text-white font-semibold mb-3">{nft.name}</p>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-1">
//                     <span className="text-purple-500">Ξ</span>
//                     <span className="text-white font-exo2">{nft.price} ETH</span>
//                   </div>
//                   <button className="flex items-center gap-1 text-gray-400 hover:text-red-500">
//                     <Heart className="w-4 h-4" />
//                     <span className="text-xs font-exo2">{nft.likes}</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Live Section */}
//       <div>
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-yellow-400 text-2xl font-bold">Live</h2>
//           <div className="flex gap-2">
//             <select className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2">
//               <option>Avalanche</option>
//             </select>
//             <button className="bg-gray-800 text-white font-exo2 border border-gray-700 rounded-lg px-4 py-2">
//               View All
//             </button>
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {live.map((nft) => (
//             <div
//               key={nft.id}
//               className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-purple-600 transition-colors"
//             >
//               <div className="w-full h-48 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
//                 <div className="text-center">
//                   <div className="text-4xl font-bold text-white mb-1">21</div>
//                   <div className="text-white text-xs">SPADES</div>
//                 </div>
//               </div>
//               <div className="p-4">
//                 <p className="text-gray-400 text-sm mb-1">{nft.collection}</p>
//                 <p className="text-gray-500 text-xs mb-2">{nft.edition}</p>
//                 <p className="text-white font-semibold mb-3">{nft.name}</p>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-1">
//                     <span className="text-purple-500">Ξ</span>
//                     <span className="text-white font-semibold">{nft.price} ETH</span>
//                   </div>
//                   <button className="flex items-center gap-1 text-gray-400 hover:text-red-500">
//                     <Heart className="w-4 h-4" />
//                     <span className="text-xs">{nft.likes}</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//     </>
    
//   )
// }/

export default function MarketplacePage() {
  return (
    <div>
      <TokenizedCollectionCard />
    </div>
  )
}

