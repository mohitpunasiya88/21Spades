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
      {/* Header */}
      <Header />

      {/* Main Content Wrapper */}
      <div className="w-full px-8">

        {/* About Title */}
        <h1 className="text-white font-400 text-2xl md:text-3xl font-audiowide mb-4">
          About
        </h1>

        {/* Hero Image */}
        <div className="flex justify-center mb-4 relative w-full">
          <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden">

            {/* Background Pattern */}
            <img
              src={aboutImage.src}
              alt="About Background"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Spade Logo */}
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="relative flex items-center justify-center">

                <div className="absolute w-60 h-60 md:w-80 md:h-80 rounded-full bg-[radial-gradient(circle_at_center,_#F6E9FF_0%,_#C08CFF_40%,_rgba(0,0,0,0)_80%)] opacity-95" />

                <img
                  src={spadesImage.src}
                  alt="21 Spades"
                  className="relative w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl"
                />

              </div>
            </div>
          </div>
        </div>

        {/* About Content */}
        <div className="space-y-6 text-white font-exo2">

          <p className="text-base md:text-lg font-500 leading-relaxed text-[#A3AED0]">
            21Spades is redefining the future of digital interaction as a fully integrated, social-first platform for tokenized assets bridging next-generation social engagement with the power of blockchain. More than a marketplace, it is a comprehensive ecosystem where creators, collectors, traders, and brands can connect, transact, and participate in the evolving digital economy through a seamless and intuitive experience.
          </p>

          <p className="text-base md:text-lg font-500 leading-relaxed text-[#A3AED0]">
            At the core of the platform is an intelligent social layer that transforms digital ownership into meaningful interaction. Users can build dynamic profiles, join curated feeds, participate in live drops, engage in community groups, and showcase their digital identity within a highly interactive environment tailored for modern Web3 culture. From tokenized art, gaming assets, digital fashion, ticketing, domains, and real-world assets (RWA), 21Spades delivers a complete, unified space for discovering and exchanging tokenized values.
          </p>

          <p className="text-base md:text-lg font-500 leading-relaxed text-[#A3AED0]">
            This experience is powered by a robust multi-chain architecture supporting Flow, Avalanche, and EVM-compatible networks, ensuring fast, secure, cost-efficient, and eco-friendly minting. Through the integration of the Privy embedded wallet, every user—regardless of their technical background—benefits from secure, frictionless onboarding without having to understand traditional wallet complexity.
            <br />
            Together, these integrations allow users to move effortlessly between social interaction, trading, swapping, minting, and financial empowerment within a single platform.
          </p>

          <p className="text-base md:text-lg font-500 leading-relaxed text-[#A3AED0]">
            Creators can launch collections, build communities, monetize their audience, and engage directly with supporters without intermediaries. Users can explore, trade, and participate in the social Web3 economy with confidence. And newcomers benefit from guided onboarding, education, and intuitive design that makes Web3 accessible to everyone.
          </p>

          <p className="text-base md:text-lg font-700 leading-relaxed text-white">
            21Spades stands at the intersection of tokenization, social engagement, and financial innovation, making Web3 more accessible, more interactive, and fundamentally more human.
          </p>

        </div>


        {/* Entrusting Section */}
        <div className="mt-16">
          <h2 className="text-white text-2xl md:text-3xl font-audiowide mb-4">
            Entrusting the Digital Creators Globally
          </h2>

          <div className="space-y-6 text-white font-exo2">

            <p className="text-base md:text-lg leading-relaxed text-[#A3AED0]">
              21Spades exists to give creators true ownership, freedom, and global reach in the new digital economy.
              We bridge creators with collectors, brands, and communities through an ecosystem built for the next generation of tokenization.
            </p>

            <p className="text-base md:text-lg leading-relaxed text-[#A3AED0]">
              Whether it’s art, gaming, fashion, real estate, or luxury assets, we provide the tools, technology, and visibility creators need to grow, monetize, and thrive — without borders, intermediaries, or limitations.
              <br />
              Our mission is simple: enable every creator, everywhere, to turn imagination into value.
            </p>

          </div>

        </div>

        {/* Introducing Video Placeholder */}
        <div className="mt-16">
          <h2 className="text-white text-2xl md:text-3xl font-audiowide mb-4">
            Introducing 21Spades
          </h2>

          <div className="relative w-full h-[220px] sm:h-[300px] md:h-[350px] lg:h-[400px] bg-[#B4B4C4] overflow-hidden flex items-center justify-center">

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center cursor-pointer group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-black/80 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* <p className="text-gray-700 font-exo2">Video Player</p> */}

          </div>
        </div>

        {/* Our Values */}
        <div className="mt-16">
          <h2 className="text-white text-2xl md:text-3xl font-audiowide mb-4">
            Our Values
          </h2>

          <div className="space-y-6 text-white font-exo2">

            {[
              {
                title: "Innovation First",
                text: "We push the boundaries of Web3 by making tokenization accessible, intuitive, and meaningful."
              },
              {
                title: "Creator-Centric",
                text: "Creators are the heart of the 21Spades ecosystem. Every feature we build is designed to elevate their work and amplify their success."
              },
              {
                title: "Transparency",
                text: "From smart contracts to platform processes, clarity and openness guide every decision."
              },
              {
                title: "Community",
                text: "We believe Web3 is built through collaboration. We foster a space where users, creators, and partners grow together."
              },
              {
                title: "Integrity",
                text: "We uphold ethical standards across technology, partnerships, and operations — ensuring fairness in every interaction."
              },
              {
                title: "Accessibility",
                text: "Tokenization should be for everyone. We simplify onboarding, education, and user experience to welcome the world into Web3."
              }
            ].map((item, i) => (
              <div key={i}>
                <h3 className="text-[#884DFF] text-xl md:text-2xl font-700">{item.title}</h3>
                <p className="text-base md:text-lg leading-relaxed text-[#A3AED0]">{item.text}</p>
              </div>
            ))}

          </div>
        </div>


        {/* Security Section */}
        <div className="mt-16">
          <h2 className="text-white text-2xl md:text-3xl font-audiowide mb-4">
            Security & Trust
          </h2>

          <div className="space-y-6 text-white font-exo2">

            <p className="text-base md:text-lg leading-relaxed text-[#A3AED0]">
              Trust is the foundation of tokenization — and we take that responsibility seriously.
              21Spades is built on secure blockchain infrastructure, rigorous smart-contract audits, and industry-leading authentication systems.
            </p>

            <p className="text-base md:text-lg leading-relaxed text-[#A3AED0]">
              We protect user assets with decentralized security principles, encrypted wallet integrations, and strict compliance with global standards.
            </p>

            <p className="text-base md:text-lg leading-relaxed text-[#A3AED0]">
              From tokenized assets to real-world asset (RWA) listings, every interaction is safeguarded through transparent processes,
              verified contracts, and continuous platform monitoring.
            </p>

            <div className="mt-6">
              <h3 className="text-[#884DFF] text-xl md:text-2xl font-700">Our promise is simple:</h3>
              <p className="text-base md:text-lg leading-relaxed text-[#A3AED0]">
                Your assets. Your data. Your ownership — secured with the highest level of protection.
              </p>
            </div>

          </div>

        </div>

        {/* Subscribe Section */}
        <SubscribeSection />

        {/* FAQ Section */}
        <FAQSection />

      </div>
    </div>
  )
}

/* ----------------------- Subscribe Section ----------------------- */
function SubscribeSection() {
  return (
    <div className="mt-16 overflow-hidden"
      style={{ background: 'radial-gradient(circle at 85% 50%, #5B21B6 0%, #1E1B4B 5%, #090721 40%)' }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 p-12">

        <div className="flex-1 max-w-lg">
          <h2 className="text-white text-3xl font-700 font-exo2 mb-4">
            Subscribe to our newsletter
          </h2>
          <p className="text-gray-300 font-400 font-exo2 mb-8">
            Join our newsletter to get Web3 news, updates, interviews, and deep dives.
          </p>

          <div className="flex flex-col gap-4 max-w-md">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 bg-transparent border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 font-exo2"
            />
            <button className="px-6 py-3 rounded-full bg-gradient-to-b from-[#4F01E6] to-[#25016E] text-white font-700 font-exo2 hover:scale-105 transition-transform">
              Subscribe Now
            </button>
          </div>
        </div>

        <img
          src={spadesImage.src}
          className="w-48 md:w-64 drop-shadow-[0_20px_40px_rgba(139,92,246,0.5)]"
        />
      </div>
    </div>
  )
}

/* ----------------------- FAQ Section ----------------------- */
function FAQSection() {
  return (
    <div className="mt-16 mb-4">
      <h2 className="text-white text-3xl font-audiowide mb-6">FAQ's</h2>
      <FAQAccordion />
    </div>
  )
}

/* ----------------------- FAQ Accordion ----------------------- */
function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    { question: "What is Tokenization?", answer: "Tokenization is the process of converting real-world or digital assets into blockchain-based tokens (NFTs). On 21Spades, our guided studio makes this simple — just upload your asset, add details, and mint your token in minutes. No technical knowledge required." },
    { question: "How do D-Drops work?", answer: "D-Drops are exclusive digital drop events where creators can release their work to a select audience. On 21Spades, you can create your own D-Drop, set a release date, and invite your followers to join. It's a great way to build your community and share your work with like-minded individuals." },
    { question: "How are royalties paid?", answer: "Royalties are automatically distributed to creators when their work is sold on the marketplace." },
    { question: "Is 21Spades safe?", answer: "Yes, we use secure blockchain infrastructure, rigorous smart-contract audits, and industry-leading authentication systems." },
  ]

  return (
    <div className="bg-[#090721] rounded-2xl overflow-hidden p-6">

      {faqs.map((faq, i) => (
        <div key={i} className="border-b border-[#A3AED04D] last:border-0">

          <button
            className="w-full flex justify-between items-center py-5"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span className="text-white font-600 font-exo2">{faq.question}</span>
            <ChevronDown className={`text-white transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
          </button>

          {openIndex === i && (
            <p className="px-1 pb-5 text-[#A3AED0] font-exo2 leading-relaxed">
              {faq.answer}
            </p>
          )}

        </div>
      ))}

    </div>
  )
}
