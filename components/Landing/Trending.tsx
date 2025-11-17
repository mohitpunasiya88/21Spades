import { ArrowRight } from "lucide-react";
import NFTCard from "./NFTcard";
import { useState } from "react";
import { PiArrowBendUpRightBold } from "react-icons/pi";
import { BsSuitSpade } from "react-icons/bs";

export default function Trending() {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const categories = [
    { name: 'ALL' },
    { name: 'Crypto', icon: '💰' },
    { name: 'GAMING', icon: '🎮' },
    { name: 'Ticketing', icon: '🎫' },
    { name: 'FASHION', icon: '👗' },
    { name: 'ART', icon: '🎨' },
    { name: 'Real Estate', icon: '🏢' },
    { name: 'A I', icon: '🤖' }
  ];

  const allNfts = [
    { title: 'Aether Guardian', creator: '21Spades NFTs', price: '3.5 ETH', edition: '1 of 321', category: 'Crypto' },
    { title: 'Cyber Warrior', creator: 'GameVerse', price: '2.8 ETH', edition: '1 of 500', category: 'GAMING' },
    { title: 'VIP Concert Pass', creator: 'EventChain', price: '1.2 ETH', edition: '1 of 1000', category: 'Ticketing' },
    { title: 'Digital Couture', creator: 'MetaFashion', price: '4.1 ETH', edition: '1 of 150', category: 'FASHION' },
    { title: 'Abstract Dreams', creator: 'ArtDAO', price: '5.5 ETH', edition: '1 of 50', category: 'ART' },
    { title: 'Virtual Tower', creator: 'RealtyVerse', price: '10.0 ETH', edition: '1 of 25', category: 'Real Estate' },
    { title: 'Bitcoin Genesis', creator: 'CryptoLegends', price: '6.2 ETH', edition: '1 of 200', category: 'Crypto' },
    { title: 'AI Consciousness', creator: 'NeuralArts', price: '3.9 ETH', edition: '1 of 300', category: 'A I' },
    { title: 'Dragon Quest NFT', creator: 'FantasyGames', price: '2.5 ETH', edition: '1 of 750', category: 'GAMING' },
    { title: 'Museum Entry', creator: 'CulturePass', price: '0.8 ETH', edition: '1 of 2000', category: 'Ticketing' },
    { title: 'Haute Dress', creator: 'LuxuryLab', price: '7.3 ETH', edition: '1 of 100', category: 'FASHION' },
    { title: 'Renaissance Redux', creator: 'ClassicArts', price: '8.1 ETH', edition: '1 of 75', category: 'ART' }
  ];

  const filteredNfts = activeCategory === 'ALL'
    ? allNfts
    : allNfts.filter(nft => nft.category === activeCategory);

  return (
    <section className="relative w-[100%] mx-auto my-2 md:my-5 min-h-screen">
      <div className="flex flex-col justify-center items-center mx-auto px-4 w-[100%] md:w-[85%]">
        <div className="flex justify-center items-center">
          <BsSuitSpade className="text-white w-6 h-6" />
        </div>
        <div className="text-center mb-6 md:mb-12 relative w-full max-w-4xl mx-auto">
          <h2 className="gold-gradient-text font-audiowide font-[400] text-[36px] md:text-[46px] text-center">
            Trending
          </h2>
          <p className="text-gray-300 mt-2 md:mt-3 text-sm md:text-lg font-exo2 max-w-full md:max-w-[700px] mx-auto leading-snug md:leading-relaxed">
            Where Culture Moves. See what's capturing attention across art, gaming, fashion, and culture — all rising on-chain
          </p>
        </div>

        <div className="mb-8 md:mb-12 w-full flex justify-center font-exo2">
          <div className="flex items-center gap-0 overflow-x-auto rounded-full px-2 py-2 bg-[#0E0E1F]/90 backdrop-blur-sm border border-white/10 w-full max-w-[1092px]">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center">
                <button
                  onClick={() => setActiveCategory(category.name)}
                  className={`h-9 md:h-10 px-4 md:px-5 rounded-full font-semibold transition-all flex items-center text-xs md:text-sm whitespace-nowrap ${activeCategory === category.name
                    ? 'text-white shadow-[0_0_12px_rgba(79,1,230,0.35)]'
                    : 'text-white/85 hover:text-white'
                    }`}
                  style={activeCategory === category.name ? { background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)' } : { background: 'transparent' }}
                >
                  {category.icon && <span className="mr-1.5 md:mr-2">{category.icon}</span>}
                  {category.name}
                </button>
                {index !== categories.length - 1 && (
                  <span className="mx-2 md:mx-3 h-4 md:h-5 w-px bg-white/20 rounded-full hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-12 mx-auto w-full z-10 justify-center items-center ">
          <img src="/assets/bg-ball.png" alt="Background" className="absolute top-0 left-0 opacity-70 blur-md z-0 w-170 h-170 -translate-x-1/2 translate-y-1/3" />
          {filteredNfts.length > 0 ? (
            filteredNfts.slice(0, 6).map((nft, index) => (
              <NFTCard key={index} {...nft} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-12">
              No NFTs found in this category
            </div>
          )}
          <img src="/assets/bg-ball.png" alt="Background" className="absolute z-0 bottom-0 right-0 opacity-50 blur-md z-0 w-300 h-300 translate-x-1/2 translate-y-1/6" />
        </div>

        <div className="text-center px-4">
          <button className="inline-flex md:inline-flex items-center justify-center gap-2 px-8 md:px-14 py-2 md:py-2 w-full md:w-auto rounded-full font-semibold transition-all hover:scale-105 text-white" style={{ background: 'linear-gradient(180deg, #4F01E6 0%, #25016E 83.66%)' }}>
            <span>Explore All</span>
            <PiArrowBendUpRightBold className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}