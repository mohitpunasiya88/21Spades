import { Twitter, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-indigo-950 via-purple-950 to-black relative overflow-hidden mb-10 mt-10 mx-5 rounded-[46px]">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `
          linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }} />
      
      <div className="container mx-auto px-4 py-10 relative z-10">
        {/* CTA Section */}
        <div className=" mx-auto text-center mb-20">
          <h2 className="text-[#FFB600] font-audiowide text-[48px] mb-8 relative">
            JOIN THE WORLD OF WEB3 TODAY
          </h2>
          <button className="px-8 py-3 mb-8 bg-white text-black rounded-full font-semibold transition-all relative font-exo2">
            Get Started Now
          </button>
        </div>

        {/* Footer Content */}
        <div className="border-t border-purple-800/30 pt-12 font-exo2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Left Section - Logo and Copyright */}
              <div className="flex items-center gap-2 mb-4">
                <img src="/assets/logo.png" alt="Logo" className="" />
              </div>

            {/* Middle Section - Navigation Links */}
            <div className="flex justify-center items-center gap-8 font-exo2">
              <a href="#" className="text-white hover:text-purple-400 transition-colors text-sm font-medium">
                Platform
              </a>
              <a href="#" className="text-white hover:text-purple-400 transition-colors text-sm font-medium">
                Resource
              </a>
              <a href="#" className="text-white hover:text-purple-400 transition-colors text-sm font-medium">
                Company
              </a>
            </div>

            {/* Right Section - Social Media and Legal Links */}
            <div className="flex flex-col items-end font-exo2">
              {/* Social Media Icons */}
              <div className="flex items-center gap-4 mb-4">
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
          <div className="flex items-center justify-between w-full mt-6">
            <div>
              <p className="text-[14px] text-left font-exo2 text-[#ACACAC]">
                © 2025 21spades. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-4">
                <a href="#" className="text-[#ACACAC] hover:text-white transition-colors text-[14px]">
                Privacy Policy
              </a>
              <a href="#" className="text-[#ACACAC] hover:text-white transition-colors text-[14px]">
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );  
}
  