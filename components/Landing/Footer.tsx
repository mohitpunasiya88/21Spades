import { Twitter, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t w-[100%] md:w-[97%] mx-auto from-indigo-950 via-purple-950 to-black relative overflow-hidden mb-10 mt-10 mx-3 sm:mx-5 rounded-[24px] sm:rounded-[46px]">

      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `
          linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }} />
      
      <div className="container mx-auto px-4 py-8 sm:py-10 relative z-10 flex flex-col">

        {/* CTA Section */}
        <div className="mx-auto text-center mb-10 sm:mb-20 px-2 order-2 md:order-1">
          <h2 className="text-[#FFB600] font-audiowide text-2xl sm:text-[42px] md:text-[48px] mb-4 sm:mb-8 relative">
            JOIN THE WORLD OF WEB3 TODAY
          </h2>
          <button className="px-6 sm:px-8 py-2.5 sm:py-3 mb-6 sm:mb-8 bg-white text-black rounded-full font-semibold transition-all relative font-exo2">
            Get Started Now
          </button>
        </div>

        {/* Footer Content */}
        <div className="border-t border-purple-800/30 pt-6 sm:pt-12 font-exo2 order-1 md:order-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Left Section - Logo and Copyright */}
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3 sm:mb-4">
                <img src="/assets/logo.png" alt="Logo" className="h-6 sm:h-auto" />
              </div>

            {/* Middle Section - Navigation Links */}
            <div className="flex justify-center items-center gap-3 sm:gap-8 flex-wrap font-exo2 text-center">
              <a href="#" className="text-white hover:text-purple-400 transition-colors text-sm font-medium">
                Platform
              </a>
              {/* vertical line */}
              <span className="text-white hidden xs:inline">|</span> 
              <a href="#" className="text-white hover:text-purple-400 transition-colors text-sm font-medium">
                Resource
              </a>
              {/* vertical line */}
              <span className="text-white hidden xs:inline">|</span>
              <a href="#" className="text-white hover:text-purple-400 transition-colors text-sm font-medium">
                Company
              </a>
            </div>

            {/* Right Section - Social Media and Legal Links */}
            <div className="flex flex-col items-center md:items-end font-exo2">
              {/* Social Media Icons */}
              <div className="hidden md:flex items-center gap-4 mb-4">
                <a href="#" className="text-white hover:text-purple-400 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-white hover:text-purple-400 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-white hover:text-purple-400 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
              
              
              {/* Legal Links */}
              
            </div>
          </div>

          <hr className="border-white/20 w-full my-4" />
          <div className="flex flex-col md:flex-row items-center justify-between w-full mt-4 md:mt-6 gap-2 md:gap-0">
            <div className="text-center md:text-left">
              <p className="text-[12px] md:text-[14px] font-exo2 text-[#ACACAC]">
                © 2025 21spades. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-4 flex-wrap justify-center md:justify-end">
                <a href="#" className="text-[#ACACAC] hover:text-white transition-colors text-[12px] md:text-[14px]">
                Privacy Policy
              </a>
              <a href="#" className="text-[#ACACAC] hover:text-white transition-colors text-[12px] md:text-[14px]">
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>

  );  
}