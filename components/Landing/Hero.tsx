import { Facebook, Instagram, Twitter } from "lucide-react";
import Header from "./Header";
import './landingPage.css'

export default function Hero() {  
  return (
    <div className="hero-section relative w-full min-h-screen flex flex-col items-center justify-center ">
      <div className="header-section w-full">
        <Header />
        {/* <hr className="border-white/20 w-full my-4" /> */}
      </div>
      
      <div className="hero-content">

        {/* background image */}
        <div className="hero-background-image">
          <img src="/assets/star-bg.png" alt="Hero Background" />
        </div>
       
        {/* hero content inner */}
        <div className="hero-content-inner">
          <div className="hero-content-inner-top">
          <div className="text-white text-6xl md:text-7xl">♠</div>
            {/* title plate */}
            <div className="title-plate">
              <h1>Social Exchange</h1>
            </div>

            {/* subtitle */}
            <h2 className="subtitle-gradient">
              Connect<span style={{ color: '#FFB600' }}>,</span> Create <span style={{ color: '#FFB600' }}>&amp;</span> Trade
            </h2>

            {/* inner line */}
            <div className="inline-combo">
              <span className="in-the">in the</span>
              <span className="web3">WEB3 World</span>
            </div>

            {/* lead paragraph */}
            <p className="lead-text">
              Create, trade, and connect in a decentralized Web3 social economy. Earn from your creativity, and exchange value transparently.
            </p>
          </div>
          <div className="hero-content-inner-bottom">
            <button className="btn-base btn-primary">Explore more</button>
            <button className="btn-base btn-secondary">Explore feed</button>
            <button className="btn-base btn-secondary">Chat</button>
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