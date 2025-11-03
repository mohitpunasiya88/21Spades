import { ArrowRight } from 'lucide-react';
import NFTCard from './NFTcard';

export default function Trending() {
  const categories = [
    { name: 'ALL', active: true },
    { name: 'Crypto', icon: '💰' },
    { name: 'GAMING', icon: '🎮' },
    { name: 'Ticketing', icon: '🎫' },
    { name: 'FASHION', icon: '👗' },
    { name: 'ART', icon: '🎨' },
    { name: 'Real Estate', icon: '🏢' },
    { name: 'A I', icon: '🤖' }
  ];

  const nfts = [
    { title: 'Aether Guardian', creator: '21Spades NFTs', price: '3.5 ETH', edition: '1 of 321' },
    { title: 'Aether Guardian', creator: '21Spades NFTs', price: '3.5 ETH', edition: '1 of 321' },
    { title: 'Aether Guardian', creator: '21Spades NFTs', price: '3.5 ETH', edition: '1 of 321' },
    { title: 'Aether Guardian', creator: '21Spades NFTs', price: '3.5 ETH', edition: '1 of 321' },
    { title: 'Aether Guardian', creator: '21Spades NFTs', price: '3.5 ETH', edition: '1 of 321' },
    { title: 'Aether Guardian', creator: '21Spades NFTs', price: '3.5 ETH', edition: '1 of 321' }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-950 to-gray-900 relative">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-white text-4xl">♠</div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-yellow-400" style={{ fontFamily: 'system-ui, sans-serif', letterSpacing: '0.05em' }}>
            Trending
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover a curated collection of unique digital assets<br />
            and rare collectibles from top artists.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                category.active
                  ? 'bg-purple-700 text-white'
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-800'
              }`}
            >
              {category.icon && <span className="mr-2">{category.icon}</span>}
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {nfts.map((nft, index) => (
            <NFTCard key={index} {...nft} />
          ))}
        </div>

        <div className="text-center">
          <button className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-all hover:scale-105">
            <span>Explore All</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
