'use client'

import Header from "./Header"
import { buttonStyle, marginStyle } from "../Style/style"

export default function Hero() {

 
  const outlineStyle = {
    ...buttonStyle,
    backgroundColor: "transparent",
    color: "white",
    border: "1px solid rgba(255,255,255,0.2)"
  };

  

  return (
<section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden rounded-3xl border border-white/20 bg-transparent backdrop-blur-lg"
      style={{
        background: 'linear-gradient(to bottom, #1a0a2e, #0F0F23)',
        paddingTop: '80px',
        margin: '50px'
      }}
    >
<Header />

      {/* Starry Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        {/* Large Spade Icon */}
        <div className="mb-8 flex justify-center">
          <div className="text-white text-6xl md:text-7xl">♠</div>
        </div>

        {/* Social Exchange - Yellow-Orange Gradient */}
        <h1 
          className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6"
          style={{ 
            background: 'linear-gradient(to right, #FF8C00, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: '0.02em',
            margin: '10px'
          }}
          
        >
          Social Exchange
        </h1>

        {/* Connect, Create & Trade - with WEB3 highlighted */}
        <h2 
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-white"
          style={{ fontFamily: 'system-ui, sans-serif', letterSpacing: '0.02em', margin: '10px' }}
        >
          Connect, Create & Trade<br />
          in the{' '}
          <span
            style={{
              background: 'linear-gradient(to right, #FF8C00, #FFA500)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '10px'
            }}
          >
            WEB3
          </span>{' '}
          World
        </h2>

        {/* Centered Single Paragraph - White Text */}
          <p 
            className="text-lg md:text-xl text-white text-center leading-relaxed"
            style={marginStyle}
          >
            
            Create, trade, and connect in a decentralized Web3 social economy. <br /> Earn from your creativity, and exchange value transparently.
          </p>

        {/* Buttons - Exactly as per image */}
        <div className=" items-center justify-center gap-4" style={marginStyle}>
          {/* Explore more - White text on solid purple background */}
          <button 
            className=" px-10 py-4 rounded-full font-semibold text-base md:text-lg transition-all hover:scale-105 bg-white text-black"
            style={outlineStyle} 
          >
            Explore more
          </button>

          {/* Explore feed - White text with purple border, transparent background */}
          <button 
            className="px-10 py-4 rounded-full font-semibold text-base md:text-lg transition-all hover:scale-105 border border-white/20 bg-transparent"
            style={outlineStyle} 
          >
            Explore feed
          </button>

          {/* Chat - White text with purple border, transparent background */}
          <button 
            className="px-10 py-4 rounded-full font-semibold text-base md:text-lg transition-all hover:scale-105 border border-white/20 bg-transparent"
            style={outlineStyle} 
          >
            Chat
          </button>
        </div>

        {/* Social Media Icons - Right Side */}
        <div className="fixed right-6 md:right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-20">
          <a 
            href="#" 
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span className="text-white text-xl">📷</span>
          </a>
          <a 
            href="#" 
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span className="text-white text-xl font-bold">𝕏</span>
          </a>
          <a 
            href="#" 
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span className="text-white text-xl font-bold">f</span>
          </a>
        </div>
      </div>
    </section>
   
  )
}
  