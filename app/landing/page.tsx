'use client'

import DiscoverCollections from "@/components/Landing/DiscoverCollections"
import Footer from "@/components/Landing/Footer"
import Header from "@/components/Landing/Header"
import Hero from "@/components/Landing/Hero"
import HowToTokenize from "@/components/Landing/HowToTokenize"
import LiveAuctions from "@/components/Landing/LiveAuctions"
import PlatformFeatures from "@/components/Landing/PlatformFeatures"
import Trending from "@/components/Landing/Trending"
import WhyChoose from "@/components/Landing/WhyChoose"
import LogoAnimation from "@/components/Landing/LogoAnimation"


export default function LandingPage() {
  return (
    <div style={{ background: '#0F0F23', minHeight: '100vh', width: '100%', overflowX: 'hidden'}}>
      <Hero />
      <LogoAnimation />
      <PlatformFeatures />
      <Trending />
      <LiveAuctions />
      <DiscoverCollections />
      <WhyChoose />
      <HowToTokenize />
      <LogoAnimation />
      <Footer />
      
    </div>
  )
}

