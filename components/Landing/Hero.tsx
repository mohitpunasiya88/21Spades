'use client'

import { Facebook, Instagram, Twitter } from "lucide-react";
import Header from "./Header";
import './landingPage.css'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'

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
    <div className="hero-section relative md:w-[97%] w-[100%] mx-auto min-h-screen flex flex-col items-center justify-center mt-5 ">
      {/* background image */}
        <div className="hero-background-image">
          <img src="/assets/star-bg.png" alt="Hero Background" />
        </div>
        <div className="hero-blobs">
          <div className="blob ani-1" style={{ top: 308, left: 114 }}>
            <div className="blob-shape ani-1" style={{ transform: 'rotate(100.53deg)' }} />
          </div>
          <div className="blob ani-2" style={{ top: 655, left: 182 }}>
            <div className="blob-shape ani-2" style={{ transform: 'rotate(168.05deg)' }} />
          </div>
          <div className="blob ani-3" style={{ top: 43, left: 50 }}>
            <div className="blob-shape ani-3" style={{ transform: 'rotate(143.62deg)' }} />
          </div>
        </div>

      {/* header section */}
      <div className="header-section w-full">
        <Header />
        {/* <hr className="border-white/20 w-full my-4" /> */}
      </div>
      
      <div className="hero-content">
      
        {/* hero content inner */}
        <div className="hero-content-inner">
          <div className="hero-content-inner-top">
          <div className="text-white text-6xl md:text-7xl sm:text-5xl sm:mt-0 sm:pt-0">♠</div>
            {/* title plate */} {/* small or phone view size font size small */}
            {/* <div className="title-plate md:text-6xl text-4xl sm:text-5xl"> */}
              <p className="title-plate md:text-6xl text-3xl sm:text-2xl text-[#FFB600] font-audiowide">Social Exchange</p>
            {/* </div> */}

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
            <p className="font-[400] md:font-[600] md:text-2xl text-[12px] sm:text-[12px] justify-center text-center align-center text-[#BBB8E5]">
              Create, trade, and connect in a decentralized Web3 social economy. Earn from your creativity, and exchange value transparently.
            </p>
          </div>
          <div className="flex gap-2 md:gap-6 font-[400] font-exo2">
            <button className="text-black bg-white rounded-full border border-[#CBD5E14D] px-4 py-2 md:text-2xl text-[12px]">Explore more</button>
            <button 
              onClick={handleExploreFeed}
              className="text-white bg-transparent border border-[#CBD5E14D] rounded-full px-4 py-2 md:text-2xl text-[12px]"
            >
              Explore feed
            </button>
            {/* Show Chat button only if user is logged in */}
            {isAuthenticated && (
              <button 
                onClick={handleChatClick}
                className="text-white bg-transparent border border-[#CBD5E14D] rounded-full px-4 py-2 md:text-2xl text-[12px]"
              >
                Chat
              </button>
            )}
          </div>
        </div>
        {/* right side image */}
      <div className="social-rail">
          <a href="#" aria-label="Instagram" className="social-btn">
            <Instagram />
          </a>
          <a href="#" aria-label="X (Twitter)" className="social-btn">
            <Twitter />
          </a>
          <a href="#" aria-label="Facebook" className="social-btn">
            <Facebook />
          </a>
        </div>
      </div>
      
    </div>
  );
}