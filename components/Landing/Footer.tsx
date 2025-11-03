export default function Footer() {
    return (
      <footer className="bg-gradient-to-b from-gray-950 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-transparent" />
  
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-block bg-gradient-to-br from-purple-900 via-purple-700 to-purple-900 rounded-3xl p-16 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-transparent rounded-3xl" />
              <h2 className="text-5xl md:text-6xl font-bold mb-8 text-yellow-400 relative z-10" style={{ fontFamily: 'system-ui, sans-serif', letterSpacing: '0.05em' }}>
                JOIN THE WORLD OF WEB3 TODAY
              </h2>
              <button className="px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-all hover:scale-105 relative z-10">
                Get Started Now
              </button>
            </div>
          </div>
  
          <div className="border-t border-gray-800 pt-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-3xl font-bold text-white">21</span>
                  <span className="text-yellow-400 text-3xl">♠</span>
                  <span className="text-2xl font-bold" style={{ color: '#9b59ff' }}>SPADES</span>
                </div>
              </div>
  
              <div>
                <h4 className="text-white font-semibold mb-4">Platform</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Marketplace</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Collections</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Events</a></li>
                </ul>
              </div>
  
              <div>
                <h4 className="text-white font-semibold mb-4">Resource</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                </ul>
              </div>
  
              <div>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partners</a></li>
                </ul>
              </div>
            </div>
  
            <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-800">
              <div className="text-gray-500 text-sm mb-4 md:mb-0">
                © Copyright 2025. All Rights Reserved
              </div>
  
              <div className="flex items-center gap-6 mb-4 md:mb-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">X</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">f</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">in</a>
              </div>
  
              <div className="flex items-center gap-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms & Conditions</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
  