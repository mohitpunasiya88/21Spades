'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Twitter, Instagram } from 'lucide-react';
import { FaTelegram } from "react-icons/fa";

export default function Footer() {
  const router = useRouter();
  const [isCompanyHovered, setIsCompanyHovered] = useState(false);
  return (
    <footer className="min-h-[50vh] md:h-[50vh] mb-5 w-[100%] md:w-[97%] mx-auto bg-gradient-to-t from-indigo-950 via-purple-950 to-black relative overflow-hidden mt-5 mx-3 sm:mx-5 md:rounded-xl py-4 md:py-15">

      {/* Background pattern overlay */}
      <div className="absolute flex justify-center items-center inset-0 opacity-20 translate-y-[15%]" style={{}} >
        <div className="absolute  h-[200vh] md:w-[20%] w-[30%] rounded-[50%] bottom-0 border-1 border-white/40" ></div>
        <div className="absolute h-[200vh] md:w-[40%] w-[80%] rounded-[50%] bottom-0 border-1 border-white/40" ></div>
        <div className="absolute h-[200vh] md:w-[60%] w-[120%] rounded-[50%] bottom-0 border-1 border-white/40" ></div>
        <div className="absolute h-[200vh] md:w-[80%] w-[160%] rounded-[50%] bottom-0 border-1 border-white/40" ></div>
        <div className="absolute h-[200vh] md:w-[100%] w-[200%] rounded-[50%] bottom-0 border-1 border-white/40" ></div>
        <div className="absolute h-[200vh] md:w-[120%] w-[240%] rounded-[50%] bottom-0 border-1 border-white/40" ></div>
      </div>

      <div className="container h-full mx-auto px-4  relative z-10 flex flex-col justify-between">

        {/* Mobile Layout */}
        <div className="flex md:hidden flex-col items-center justify-center flex-1 py-4">
          {/* Logo Section - Mobile */}
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <img src="/assets/logo.png" alt="Logo" className="h-8 sm:h-10" />
          </div>

          {/* Company Section - Mobile */}
          <div className="mb-4 sm:mb-6 flex flex-col items-center gap-2">
            <span className="text-white text-lg font-bold font-exo2">Company</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => router.push('/about-us')}
                className="text-white hover:text-purple-400 transition-colors cursor-pointer font-exo2 text-sm sm:text-base"
              >
                About Us
              </button>
              <span className="text-white/60">|</span>
              <button
                type="button"
                onClick={() => router.push('/contact-us')}
                className="text-white hover:text-purple-400 transition-colors cursor-pointer font-exo2 text-sm sm:text-base"
              >
                Contact Us
              </button>
            </div>
          </div>

          {/* CTA Section - Mobile */}
          <div className="mx-auto text-center mb-4 sm:mb-6">
            <h2 className="text-[#FFB600] font-audiowide text-xl sm:text-2xl mb-3 sm:mb-4 leading-tight">
              JOIN THE WORLD<br /> OF WEB3 TODAY
            </h2>
            <button className="px-8 sm:px-10 py-2.5 sm:py-3 bg-white cursor-pointer text-black rounded-full font-semibold transition-all relative font-exo2 hover:scale-105 text-sm sm:text-base">
              Get Started Now
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex flex-col items-center justify-center flex-1">
          {/* CTA Section - Desktop */}
          <div className="mx-auto text-center mb-8">
            <h2 className="text-[#FFB600] font-audiowide text-[42px] md:text-[48px] mb-6 sm:mb-8 leading-tight">
              JOIN THE WORLD<br className="md:hidden" /> OF WEB3 TODAY
            </h2>
            <button className="px-8 sm:px-10 py-3 sm:py-3 bg-white cursor-pointer text-black rounded-full font-semibold transition-all relative font-exo2 hover:scale-105 text-sm sm:text-base">
              Get Started Now
            </button>
          </div>
        </div>

        {/* Company links centered under CTA - Desktop */}
        {/* <div className="hidden md:flex flex-col  items-center gap-1 font-exo2 mb-10">
          <span className="text-white text-lg font-bold">Company</span>
          <div className="flex gap-2 justify-center text-sm md:text-base">
            <button
              type="button"
              onClick={() => router.push('/about-us')}
              className="text-white hover:text-purple-400 transition-colors cursor-pointer"
            >
              About us
            </button>
            <span className="text-white/60">|</span>
            <button
              type="button"
              onClick={() => router.push('/contact-us')}
              className="text-white hover:text-purple-400 transition-colors cursor-pointer"
            >
              Contact us
            </button>
          </div>
        </div> */}

        {/* Bottom Section - Copyright and Legal */}
        <div className="flex flex-col w-full font-exo2 mt-auto">
          {/* Desktop Top Row - Logo, Company, Social */}
          <div className='hidden md:flex items-center justify-between w-full mb-5'>
            <div className="flex items-center justify-start">
              <img src="/assets/logo.png" alt="Logo" className="h-8" />
            </div>
            
            <div 
              className="relative flex gap-2 justify-center text-sm md:text-base mr-16"
              onMouseEnter={() => setIsCompanyHovered(true)}
              onMouseLeave={() => setIsCompanyHovered(false)}
            >
              <span className="text-white text-lg font-bold cursor-pointer">Company</span>
              {isCompanyHovered && (
                <>
                  {/* Bridge div to prevent dropdown from closing when moving mouse */}
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 w-full h-2"
                    onMouseEnter={() => setIsCompanyHovered(true)}
                  />
                  <div 
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 flex gap-2 items-center bg-[#1a0b2e] border border-purple-800/30 rounded-lg px-4 py-2 shadow-lg z-10"
                    onMouseEnter={() => setIsCompanyHovered(true)}
                  >
                    <button
                      type="button"
                      onClick={() => router.push('/about-us')}
                      className="text-white hover:text-purple-400 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      About us
                    </button>
                    <span className="text-white/60">|</span>
                    <button
                      type="button"
                      onClick={() => router.push('/contact-us')}
                      className="text-white hover:text-purple-400 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Contact us
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Social Media Icons - Desktop Only */}
            <div className="hidden md:flex items-center justify-end gap-4">
              <a href="https://www.instagram.com/21spades.io" target="_blank" aria-label="Instagram" className="text-white hover:text-purple-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/@21SpadesDPR" target="_blank" aria-label="X (Twitter)" className="text-white hover:text-purple-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://t.me/+XyKl3RHYu-QxNWMx" target="_blank" aria-label="Telegram" className="text-white hover:text-purple-400 transition-colors">
                <FaTelegram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Copyright and Legal Links */}
          <div className="flex flex-col md:flex-row border-t border-purple-800/30 items-center justify-between gap-3 md:gap-0 pt-4 md:pt-5">
            <div className="text-center md:text-left">
              <p className="text-[11px] sm:text-[12px] md:text-[14px] font-exo2 text-[#ACACAC]">
                &copy; Copyright 2025. All Rights Reserved
              </p>
            </div>
            <div className="flex items-center gap-4 flex-wrap justify-center md:justify-end">
              <a href="#" className="text-[#ACACAC] hover:text-white transition-colors text-[11px] sm:text-[12px] md:text-[14px]">
                Privacy Policy
              </a>
              <a href="#" className="text-[#ACACAC] hover:text-white transition-colors text-[11px] sm:text-[12px] md:text-[14px]">
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>

  );
}