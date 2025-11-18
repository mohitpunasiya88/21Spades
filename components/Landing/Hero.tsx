'use client'

import { Instagram, Twitter } from "lucide-react";
import Header from "./Header";
import './landingPage.css'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { FaTelegram, FaTwitter } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

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
    <div className=" bg-[#000000] relative md:w-[97%] w-[100%] mx-auto flex flex-col items-center justify-center mt-5 p-8 rounded-lg ">

      {/* blobs */}
      <div className="hero-blobs rounded-lg">
        <div className="blob ani-1" style={{ top: 400, left: 200 }}>
          <div className="blob-shape ani-1" style={{ transform: 'rotate(100.53deg)' }} />
        </div>
        <div className="blob ani-2" style={{ top: 1000, left: 100, bottom: 200 }}>
          <div className="blob-shape ani-2" style={{ transform: 'rotate(168.05deg)' }} />
        </div>
        <div className="blob ani-3" style={{ top: 1200, left: 200, bottom: 100 }}>
          <div className="blob-shape ani-3" style={{ transform: 'rotate(143.62deg)' }} />
        </div>
      </div>

      {/* header section */}
      <Header />

      <div className="relative">

        <div className="absolute z-0 w-[100%] h-[100%] flex items-center justify-center">
          <img src="/assets/star-bg.png" alt="Hero Image" className="w-[100%] h-[100%] object-cover" />
        </div>

        {/* hero content inner */}
        <div className="flex flex-col w-full items-center justify-center">
          <div className="text-white text-4xl md:text-6xl sm:text-5xl">♠</div>
          <div className="flex flex-col items-center justify-center gap-4 w-[100%] md:w-[80%] mx-auto">
            <p className="m-0 p-0 md:text-[80px] text-3xl sm:text-2xl text-[#FFB600] font-audiowide">Social Exchange</p>
            <p className="m-0 p-0 md:text-[64px] text-[20px] sm:text-[16px] font-audiowide gold-gradient-text">
              Connect, Create &amp; Trade
            </p>
            <div className="inline-combo font-audiowide">
              <span className="text-[20px] md:text-[64px]">in the</span>
              <span className="text-[20px] md:text-[64px] gold-gradient-text">WEB3 World</span>
            </div>
            <p
              className="font-[600] font-semibold w-[100%] md:w-[80%] mx-auto md:text-[24px] text-[14px] sm:text-[12px] justify-center text-center align-center text-[#FFFFFFCC] font-exo2">
              Create, trade, and connect in a decentralized Web3 social economy. Earn from your creativity, and exchange value
              transparently.
            </p>
          </div>
          <div className="flex gap-2 md:gap-5 font-exo2 mt-5 md:mt-10">
            <button
              className="text-black cursor-pointer font-[700] bg-white backdrop-blur-[20px] border border-[#CBD5E14D] rounded-full px-6 py-2 md:text-[20px] text-[14px] md:min-w-[160px] transition-all duration-300 ease-in-out hover:text-white hover:bg-[#FFFFFF2A] hover:border-[#CBD5E180] hover:scale-105 hover:shadow-lg hover:shadow-white/10 active:scale-95">Explore
              more
            </button>
            <button onClick={handleExploreFeed}
              className="text-white cursor-pointer font-[700] bg-[#FFFFFF1A] backdrop-blur-[20px] border border-[#CBD5E14D] rounded-full px-6 py-2 md:text-[20px] text-[14px] md:min-w-[160px] transition-all duration-300 ease-in-out hover:bg-[#FFFFFF2A] hover:border-[#CBD5E180] hover:scale-105 hover:shadow-lg hover:shadow-white/10 active:scale-95">
              Explore feed
            </button>
            {/* Show Chat button only if user is logged in */}
            {isAuthenticated && (
              <button 
                onClick={handleChatClick}
                className="text-white cursor-pointer font-[700] bg-transparent backdrop-blur-[20px] border border-[#CBD5E14D] rounded-full px-6 py-2 md:text-[20px] text-[14px] md:min-w-[160px] transition-all duration-300 ease-in-out hover:bg-[#FFFFFF2A] hover:border-[#CBD5E180] hover:scale-105 hover:shadow-lg hover:shadow-white/10 active:scale-95"
              >
                Chat
              </button>
            )}
          </div>

          <div className="hidden md:flex flex-col gap-4 absolute top-1/5 right-4">
            {/* Instagram */}
            <a href="https://www.instagram.com/21spades.io" target="_blank" aria-label="Instagram"
              className="group w-12 h-12 rounded-full border border-[#A3AED033] bg-white/10 bg-blue-50 backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white"
            >
              <Instagram
                className="text-white group-hover:text-pink-500 transition-colors duration-300"
                size={22}
              />
            </a>

            {/* X (Twitter) */}
            <a href="https://twitter.com/@21SpadesDPR" target="_blank" aria-label="X (Twitter)"
              className="group w-12 h-12 rounded-full border border-[#A3AED033] bg-white/10 backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white"
            >
              <FaXTwitter
                className="text-white group-hover:text-black transition-colors duration-300"
                size={22}
              />
            </a>

            {/* Telegram */}
            <a href="https://t.me/+XyKl3RHYu-QxNWMx" target="_blank" aria-label="Telegram"
              className="group w-12 h-12 rounded-full border border-[#A3AED033] bg-white/10 backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white"
            >
              <FaTelegram
                className="text-white group-hover:text-[#229ED9] transition-colors duration-300"
                size={22}
              />
            </a>
          </div>
          <div className="md:hidden sm:hidden flex justify-center gap-4 mt-5 ">
            {/* Instagram */}
            <a href="https://www.instagram.com/21spades.io" target="_blank" aria-label="Instagram"
              className="group w-12 h-12 rounded-full border border-[#A3AED033] bg-white/10 backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white"
            >
              <Instagram
                className="text-white group-hover:text-pink-500 transition-colors duration-300"
                size={22}
              />
            </a>

            {/* X (Twitter) */}
            <a href="https://twitter.com/@21SpadesDPR" target="_blank" aria-label="X (Twitter)"
              className="group w-12 h-12 rounded-full border border-[#A3AED033] bg-white/10 backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white"
            >
              <FaXTwitter
                className="text-white group-hover:text-black transition-colors duration-300"
                size={22}
              />
            </a>

            {/* Telegram */}
            <a href="https://t.me/+XyKl3RHYu-QxNWMx" target="_blank" aria-label="Telegram"
              className="group w-12 h-12 rounded-full border border-[#A3AED033] bg-white/10 backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white"
            >
              <FaTelegram
                className="text-white group-hover:text-[#229ED9] transition-colors duration-300"
                size={22}
              />
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}