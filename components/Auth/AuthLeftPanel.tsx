'use client'

export default function AuthLeftPanel() {
  return (
    <div className="w-1/2 hidden lg:flex flex-col gap-4 p-8 bg-gray-950">
      <div className="grid grid-cols-2 gap-4 h-full">
        {/* Top Left - 21 SPADES */}
        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-xl p-6 flex items-center justify-center border border-purple-700/30">
          <div className="text-center">
            <div className="text-6xl font-bold text-yellow-400 mb-2">21</div>
            <div className="text-purple-400 text-2xl font-bold">SPADES</div>
          </div>
        </div>

        {/* Top Right - Blue Gradient Block */}
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-xl border border-blue-700/30">
          <div className="w-full h-full bg-gradient-to-br from-blue-600/40 to-blue-800/40 rounded-xl"></div>
        </div>

        {/* Bottom Left - Bitcoin Icon with N */}
        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-xl p-6 flex flex-col items-center justify-center border border-purple-700/30 relative">
          <div className="text-center text-yellow-400 text-4xl font-bold mb-2">₿</div>
          <div className="absolute bottom-4 left-4 text-white text-xl font-bold">N</div>
        </div>

        {/* Bottom Right - Teal/Blue-Green Gradient */}
        <div className="bg-gradient-to-br from-teal-900/50 to-cyan-800/30 rounded-xl border border-teal-700/30">
          <div className="w-full h-full bg-gradient-to-br from-teal-600/40 to-cyan-600/40 rounded-xl"></div>
        </div>
      </div>
    </div>
  )
}
