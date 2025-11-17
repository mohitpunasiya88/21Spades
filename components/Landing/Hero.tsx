'use client'

import { Instagram, Twitter } from "lucide-react";
import Header from "./Header";
import './landingPage.css'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { FaTelegram } from "react-icons/fa";

export default function Hero() {
  const isAuthenticated = useAuth()
  const router = useRouter()

  const handleChatClick = () => {
    if (isAuthenticated) {
      router.push('/messages')
    } else {
      router.push('/login')
    }
  }

  const handleExploreFeed = () => {
    // Allow all users to visit feed page, but they'll need to login for actions
    router.push('/feed')
  }

  return (
    <div className="hero-section bg-[#000000] relative md:w-[97%] w-[100%] mx-auto min-h-screen flex flex-col items-center justify-center mt-5 ">
      {/* background image */}
      {/* <div className="hero-background-image">
          <img src="/assets/star-bg.png" alt="Hero Background" className="w-full h-full object-cover"/>
        </div> */}
      <div className="hero-blobs">
        <div className="blob ani-1" style={{ top: 600, left: 400 }}>
          <div className="blob-shape ani-1" style={{ transform: 'rotate(100.53deg)' }} />
        </div>
        <div className="blob ani-2" style={{ top: 1200, left: 100, bottom: 200 }}>
          <div className="blob-shape ani-2" style={{ transform: 'rotate(168.05deg)' }} />
        </div>
        <div className="blob ani-3" style={{ top: 1200, left: 50, bottom: 300 }}>
          <div className="blob-shape ani-3" style={{ transform: 'rotate(143.62deg)' }} />
        </div>
      </div>

      {/* header section */}
      <div className="header-section w-full">
        <Header />
        {/* <hr className="border-white/20 w-full my-4" /> */}
      </div>

      <div className="relative hero-content">

        <div className="absolute hero-image z-0 w-[120%] h-[100%]">
          <img src="/assets/star-bg.png" alt="Hero Image" className="w-[120%] h-[100%] object-cover" />
        </div>

        {/* hero content inner */}
        <div className="hero-content-inner relative">
          <div className="flex flex-col items-center justify-center gap-4 w-full">
            <div className="hero-content-inner-top">
              <div className="text-white text-6xl md:text-7xl sm:text-5xl sm:mt-0 sm:pt-0">♠</div>

              {/* title plate */}
              <p className="title-plate md:text-6xl text-3xl sm:text-2xl text-[#FFB600] font-audiowide">Social Exchange</p>

              {/* subtitle */}
              <p className="subtitle-gradient md:text-6xl text-[20px] sm:text-[16px]">
                Connect, Create &amp; Trade
              </p>

              {/* inner line */}
              <div className="inline-combo">
                <span className="in-the text-[20px] md:text-6xl">in the</span>
                <span className="web3 text-[20px] md:text-6xl">WEB3 World</span>
              </div>

              {/* lead paragraph */}
              <p className="md:font-[600] md:text-[20px] text-[12px] sm:text-[12px] justify-center text-center align-center text-[#BBB8E5] font-exo2">
                Create, trade, and connect in a decentralized Web3 social economy. Earn from your creativity, and exchange value transparently.
              </p>
            </div>

            <div className="flex gap-2 md:gap-6 font-exo2 mt-0 md:mt-5">
              <button className="text-black font-[400] bg-white rounded-full border border-[#CBD5E14D] px-6 py-2 md:text-2xl text-[12px]">Explore more</button>
              <button
                onClick={handleExploreFeed}
                className="text-white font-[400] bg-[#FFFFFF1A] backdrop-blur-[20px] border border-[#CBD5E14D] rounded-full px-6 py-2 md:text-2xl text-[12px]"
              >
                Explore feed
              </button>
              {/* Show Chat button only if user is logged in */}
              {isAuthenticated && (
                <button
                  onClick={handleChatClick}
                  className="text-white font-[400] bg-transparent border border-[#CBD5E14D] rounded-full px-6 py-2 md:text-2xl text-[12px]"
                >
                  Chat
                </button>
              )}
            </div>

            {/* Social buttons - Mobile: centered row at bottom, Desktop: right side vertical */}
            <div className="flex flex-row gap-4 justify-center md:hidden mt-4">
              <a href="https://www.instagram.com/21spades.io" target="_blank" aria-label="Instagram" className="social-btn">
                <Instagram />
              </a>
              <a href="https://twitter.com/@21SpadesDPR" target="_blank" aria-label="X (Twitter)" className="social-btn">
                <Twitter />
              </a>
              <a href="https://t.me/+XyKl3RHYu-QxNWMx" target="_blank" aria-label="Telegram" className="social-btn">
                <FaTelegram />
              </a>
            </div>
          </div>

          {/* Social buttons - Desktop: right side vertical */}
          <div className="hidden md:flex flex-col gap-4 absolute -right-1/6 top-1/2 -translate-y-1/2 -translate-x-1/4">
            <a href="https://www.instagram.com/21spades.io" target="_blank" aria-label="Instagram" className="social-btn">
              <Instagram />
            </a>
            <a href="https://twitter.com/@21SpadesDPR" target="_blank" aria-label="X (Twitter)" className="social-btn">
              <Twitter />
            </a>
            <a href="https://t.me/+XyKl3RHYu-QxNWMx" target="_blank" aria-label="Telegram" className="social-btn">
              <FaTelegram />
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}