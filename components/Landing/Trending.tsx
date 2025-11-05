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
    <section className=" relative my-10 " >

      <div className="relative top-0 left-1/2 text-white text-4xl mb-6">♠</div>
      <div className="container">
        <div className="text-center mb-12 relative w-1/3 mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-yellow-400 gold-gradient-text font-audiowide">
            Trending
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-exo2">
          Where Culture Moves.See what’s capturing attention across art, gaming, fashion, and culture  all rising on-chain

          </p>
        </div>

        {/* Tabs container */}
        <div className="mb-12 w-full flex justify-center">
          <div className="flex items-center gap-0 overflow-x-auto rounded-full px-2 py-2 bg-[#0E0E1F]/90 backdrop-blur-sm border border-white/10 font-exo2" style={{ maxWidth: 1092 }}>
            {categories.map((category, index) => (
              <div key={index} className="flex items-center">
                <button
                  className={`h-10 px-5 rounded-full font-exo2 font-semibold transition-all flex items-center text-sm whitespace-nowrap ${
                    category.active
                      ? 'text-white shadow-[0_0_12px_rgba(79,1,230,0.35)]' 
                      : 'text-white/85 hover:text-white'
                  }`}
                  style={category.active ? { background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)' } : { background: 'transparent' }}
                >
                  {category.icon && <span className="mr-2">{category.icon}</span>}
                  {category.name}
                </button>
                {/* Separator line except after last */}
                {index !== categories.length - 1 && (
                  <span className="mx-3 h-5 w-px bg-white/20 rounded-full hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 mx-auto max-w-7xl">
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
