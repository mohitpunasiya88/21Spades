'use client'

import { useState } from 'react'
import Header from "@/components/Landing/Header"
import Footer from "@/components/Landing/Footer"
import aboutImage from "@/components/assets/aboutImage.png"
import spadesImage from "@/components/assets/21spades.png"
import { ChevronDown } from 'lucide-react'

export default function AboutUsPage() {
  return (
    <div style={{ background: '#0F0F23', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      {/* Header - Full width */}
      <div className="w-full">
        <Header />
      </div>
      
      {/* Content Container */}
      <div className="w-full px-8 w-[100%]">
        <div className=" mx-auto w-[100%]">
          {/* About Heading */}
          <h1 className="text-white text-4xl md:text-6xl font-audiowide mb-4 md:mb-8 text-start">
            About
          </h1>

          {/* Main Spade Icon Graphic */}
          <div className="flex justify-center mb-12 md:mb-16 relative w-full">
            <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden">
              {/* Background image */}
              <div className="absolute inset-0">
                <img 
                  src={aboutImage.src} 
                  alt="Background pattern" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              
              {/* Spade Icon with 21 */}
              <div className="relative z-10 flex items-center justify-center h-full">
                <div className="relative flex items-center justify-center">
                  {/* Light circular background behind spade */}
                  <div className="absolute w-60 h-60 md:w-80 md:h-80 rounded-full bg-[radial-gradient(circle_at_center,_#F6E9FF_0%,_#C08CFF_40%,_rgba(0,0,0,0)_80%)] opacity-95" />
                  {/* Main spade image */}
                  <img
                    src={spadesImage.src}
                    alt="21 Spades"
                    className="relative w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl transform hover:scale-105 transition-transform"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-4 md:space-y-8 text-white">
            {/* First Paragraph */}
            <p className="text-base md:text-lg leading-relaxed text-gray-300" style={{ fontFamily: 'var(--font-exo2)' }}>
              21Spades is a social-first platform for tokenized assets, bridging social engagement with blockchain technology. 
              It's a comprehensive ecosystem for creators, collectors, traders, and brands.
            </p>

            {/* Second Paragraph */}
            <p className="text-base md:text-lg leading-relaxed text-gray-300" style={{ fontFamily: 'var(--font-exo2)' }}>
              Our intelligent social layer enables users to build profiles, join feeds, participate in drops, engage in communities, 
              and showcase digital identity within a Web3 environment. We cover tokenized art, gaming, fashion, ticketing, domains, 
              and real-world assets.
            </p>

            {/* Third Paragraph */}
            <p className="text-base md:text-lg leading-relaxed text-gray-300" style={{ fontFamily: 'var(--font-exo2)' }}>
              Our robust multi-chain architecture supports Flow, Avalanche, and EVM-compatible networks, emphasizing secure, 
              cost-efficient minting and frictionless onboarding via an embedded wallet.
            </p>

            {/* Fourth Paragraph */}
            <p className="text-base md:text-lg leading-relaxed text-gray-300" style={{ fontFamily: 'var(--font-exo2)' }}>
              Creators can launch collections, build communities, monetize audiences, and engage directly with supporters. 
              Users can explore, trade, and participate in the Web3 economy with confidence. Newcomers benefit from guided onboarding.
            </p>

            {/* Bold Statement */}
            <p className="text-lg md:text-xl font-bold leading-relaxed text-white mt-8 md:mt-12" style={{ fontFamily: 'var(--font-exo2)' }}>
              21Spades stands at the intersection of tokenization, social engagement, and financial innovation, making Web3 more 
              accessible, more interactive, and fundamentally more human.
            </p>
          </div>

          {/* Entrusting the Digital Creators Globally Section */}
          <div className="mt-16 md:mt-24">
            <h2 className="text-white text-3xl md:text-5xl font-bold mb-8 md:mb-12 text-start" style={{ fontFamily: 'var(--font-exo2)' }}>
              Entrusting the Digital Creators Globally
            </h2>

            <div className="space-y-8 md:space-y-12 text-white">
              {/* First Paragraph */}
              <p className="text-base md:text-lg leading-relaxed text-gray-300 text-start" style={{ fontFamily: 'var(--font-exo2)' }}>
                21Spades exists to give creators true ownership, freedom, and global reach in the new digital economy. We bridge creators 
                with collectors, brands, and communities through an ecosystem built for the next generation of tokenization.
              </p>

              {/* Second Paragraph */}
              <p className="text-base md:text-lg leading-relaxed text-gray-300 text-start" style={{ fontFamily: 'var(--font-exo2)' }}>
                Whether it's art, gaming, fashion, real estate, or luxury assets, we provide the tools, technology, and visibility creators 
                need to grow, monetize, and thrive — without borders, intermediaries, or limitations.
              </p>

              {/* Third Paragraph - Mission */}
              <p className="text-base md:text-lg leading-relaxed text-gray-300 text-start" style={{ fontFamily: 'var(--font-exo2)' }}>
                Our mission is simple: enable every creator, everywhere, to turn imagination into value.
              </p>
            </div>
          </div>

          {/* Introducing 21Spades Section */}
          <div className="mt-16 md:mt-24">
            <h2 className="text-white text-3xl md:text-5xl font-bold mb-8 md:mb-12 text-start" style={{ fontFamily: 'var(--font-exo2)' }}>
              Introducing 21Spades
            </h2>

            {/* Video Player Placeholder */}
           <div className="w-full mx-auto">
  <div className="
      relative w-full 
      h-[220px] sm:h-[280px] md:h-[350px] lg:h-[400px]
      bg-[#B4B4C4] overflow-hidden 
      flex items-center justify-center aspect-video
    "
  >
    {/* Play Button */}
    <div className="absolute inset-0 flex items-center justify-center cursor-pointer group">
      <div className="
          w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 
          bg-black/80 rounded-full flex items-center justify-center 
          group-hover:bg-black/90 transition-colors
        "
      >
        <svg 
          className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white ml-1" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
    </div>

    {/* Placeholder Text */}
    <p className="text-gray-400 text-xs sm:text-sm md:text-base">
      Video Player
    </p>
  </div>
</div>

          </div>

          {/* Our Values Section */}
          <div className="mt-8 md:mt-16">
            <h2 className="text-white text-3xl md:text-5xl font-bold mb-8 md:mb-12 text-start" style={{ fontFamily: 'var(--font-exo2)' }}>
              Our Values
            </h2>

            <div className="space-y-8 md:space-y-10 text-white">
              {/* Innovation First */}
              <div>
                <h3 className="text-purple-400 text-xl md:text-2xl font-bold mb-3 text-start" style={{ fontFamily: 'var(--font-exo2)' }}>
                  Innovation First
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-gray-300 text-start" style={{ fontFamily: 'var(--font-exo2)' }}>
                  We push the boundaries of Web3 by making tokenization accessible, intuitive, and meaningful.
                </p>
              </div>

              {/* Creator-Centric */}
              <div>
                <h3 className="text-purple-400 text-xl md:text-2xl font-bold mb-3 text-start" style={{ fontFamily: 'var(--font-exo2)' }}>
                  Creator-Centric
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-gray-300 text-start" style={{ fontFamily: 'var(--font-exo2)' }}>
                  Creators are the heart of the 21Spades ecosystem. Every feature we build is designed to elevate their work and amplify their success.
                </p>
              </div>

              {/* Transparency */}
              <div>
                <h3 className="text-purple-400 text-xl md:text-2xl font-bold mb-3 text-start" style={{ fontFamily: 'var(--font-exo2)' }}>
                  Transparency
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-gray-300 text-start" style={{ fontFamily: 'var(--font-exo2)' }}>
                  From smart contracts to platform processes, clarity and openness guide every decision.
                </p>
              </div>

              {/* Community */}
              <div>
                <h3 className="text-purple-400 text-xl md:text-2xl font-bold mb-3 text-start" style={{ fontFamily: 'var(--font-exo2)' }}>
                  Community
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-gray-300 text-start" style={{ fontFamily: 'var(--font-exo2)' }}>
                  We believe Web3 is built through collaboration. We foster a space where users, creators, and partners grow together.
                </p>
              </div>

              {/* Integrity */}
              <div>
                <h3 className="text-purple-400 text-xl md:text-2xl font-bold mb-3 text-start" style={{ fontFamily: 'var(--font-exo2)' }}>
                  Integrity
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-gray-300 text-start" style={{ fontFamily: 'var(--font-exo2)' }}>
                  We uphold ethical standards across technology, partnerships, and operations — ensuring fairness in every interaction.
                </p>
              </div>

              {/* Accessibility */}
              <div>
                <h3 className="text-purple-400 text-xl md:text-2xl font-bold mb-3 text-start" style={{ fontFamily: 'var(--font-exo2)' }}>
                  Accessibility
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-gray-300 text-start" style={{ fontFamily: 'var(--font-exo2)' }}>
                  Tokenization should be for everyone. We simplify onboarding, education, and user experience to welcome the world into Web3.
                </p>
              </div>
            </div>
          </div>

          {/* Security & Trust Section */}
          <div className="mt-8 md:mt-16">
            <h2 className="text-white text-3xl md:text-5xl font-bold mb-8 md:mb-12 text-start" style={{ fontFamily: 'var(--font-exo2)' }}>
              Security & Trust
            </h2>

            <div className="space-y-8 md:space-y-12 text-white">
              {/* First Paragraph */}
              <p className="text-base md:text-lg leading-relaxed text-gray-300 text-start" style={{ fontFamily: 'var(--font-exo2)' }}>
                Trust is the foundation of tokenization — and we take that responsibility seriously. 21Spades is built on secure blockchain 
                infrastructure, rigorous smart-contract audits, and industry-leading authentication systems.
              </p>

              {/* Second Paragraph */}
              <p className="text-base md:text-lg leading-relaxed text-gray-300 text-start" style={{ fontFamily: 'var(--font-exo2)' }}>
                We protect user assets with decentralized security principles, encrypted wallet integrations, and strict compliance with global standards.
              </p>

              {/* Third Paragraph */}
              <p className="text-base md:text-lg leading-relaxed text-gray-300 text-start" style={{ fontFamily: 'var(--font-exo2)' }}>
                From tokenized assets to real-world asset (RWA) listings, every interaction is safeguarded through transparent processes, verified 
                contracts, and continuous platform monitoring.
              </p>

              {/* Concluding Statement */}
              <div className="mt-8 md:mt-12">
                <h3 className="text-purple-400 text-xl md:text-2xl font-bold mb-3 text-start" style={{ fontFamily: 'var(--font-exo2)' }}>
                  Our promise is simple:
                </h3>
                <p className="text-base md:text-lg leading-relaxed text-white text-start" style={{ fontFamily: 'var(--font-exo2)' }}>
                  Your assets. Your data. Your ownership — secured with the highest level of protection.
                </p>
              </div>
            </div>
          </div>

          {/* Subscribe to Newsletter Section */}
          <div
            className="mt-6 md:mt-16 p-2"
            style={{
              backgroundImage: 'radial-gradient(circle at 90% 50%, #4C1D95 0%, #05051a 20%, #05051a 100%)'
            }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-12">
              <div className="flex-1 m-4 md:m-8">
                <h2 className="text-white text-3xl md:text-5xl font-audiowide mb-4 md:mb-6 text-start">
                  Subscribe to our newsletter
                </h2>
                <p className="text-base md:text-lg leading-relaxed text-gray-200 text-start mb-6 md:mb-8 max-w-xl" style={{ fontFamily: 'var(--font-exo2)' }}>
                  Join our newsletter to get web3 news, updates, interviews, and deep dives all in one place.
                </p>
                <div className="flex flex-col gap-4 max-w-md">
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-3 bg-[#1a1a2e] border border-gray-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                    style={{ fontFamily: 'var(--font-exo2)' }}
                  />
                  <button
                    className="w-full px-6 py-3 md:py-3.5 rounded-full text-white font-bold bg-gradient-to-r from-[#4F01E6] to-[#25016E] shadow-[0_12px_30px_rgba(37,1,110,0.7)] hover:brightness-110 transition-all text-sm md:text-base"
                    style={{ fontFamily: 'var(--font-exo2)' }}
                  >
                    Subscribe Now
                  </button>
                </div>
              </div>
              <div className="hidden md:flex flex-shrink-0 items-center justify-center">
                <div className="relative w-[320px] h-[260px] rounded-[32px] ">
                  <img 
                    src={spadesImage.src} 
                    alt="21 Spades" 
                    className="absolute inset-0 m-auto w-52 h-52 object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.8)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-8 md:mt-16">
            <h2 className="text-white text-3xl md:text-5xl font-bold mb-4 md:mb-8 text-start" style={{ fontFamily: 'var(--font-exo2)' }}>
              FAQ's
            </h2>

            <FAQAccordion />
          </div>
        </div>
      </div>

    </div>
  )
}

// FAQ Accordion Component
function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "What is Tokenization?",
      answer: "Tokenization is the process of converting real-world or digital assets into blockchain-based tokens (NFTs). On 21Spades, our guided studio makes this simple — just upload your asset, add details, and mint your token in minutes. No technical knowledge required."
    },
    {
      question: "How do D-Drops work?",
      answer: "D-Drops are our exclusive digital drop events where creators can launch limited collections. Users can participate in these drops to acquire unique tokenized assets directly from creators."
    },
    {
      question: "How are royalties paid?",
      answer: "Royalties are automatically distributed to creators whenever their tokenized assets are resold on the platform. The royalty percentage is set by the creator at the time of minting and is enforced through smart contracts."
    },
    {
      question: "Is 21Spades safe?",
      answer: "Yes, 21Spades is built on secure blockchain infrastructure with rigorous smart-contract audits and industry-leading authentication systems. We protect user assets with decentralized security principles, encrypted wallet integrations, and strict compliance with global standards."
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="bg-[#090721] border border-white/10 rounded-2xl overflow-hidden">
      {faqs.map((faq, index) => (
        <div key={index} className="border-b border-white/10 last:border-b-0">
          <button
            onClick={() => toggleFAQ(index)}
            className={`flex items-center justify-between w-full text-left px-4 md:px-6 py-4 md:py-5 transition-colors ${
              openIndex === index ? 'bg-white/5' : 'bg-transparent'
            }`}
          >
            <span className="text-white font-bold text-base md:text-lg pr-4" style={{ fontFamily: 'var(--font-exo2)' }}>
              {faq.question}
            </span>
            <ChevronDown
              className={`w-5 h-5 md:w-6 md:h-6 text-gray-400 transition-transform flex-shrink-0 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openIndex === index && (
            <div className="px-4 md:px-6 pb-4 md:pb-5 bg-white/5">
              <p className="text-gray-300 text-sm md:text-base leading-relaxed" style={{ fontFamily: 'var(--font-exo2)' }}>
                {faq.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

