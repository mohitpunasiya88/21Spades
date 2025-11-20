'use client'

import { useRouter } from 'next/navigation'
import { Home, ArrowLeft, Search, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F23] via-[#1a1a2e] to-[#0F0F23] flex items-center justify-center px-4 relative overflow-hidden font-exo2">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#8B5CF6] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#FFD700] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-[#7E6BEF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#2A2F4A_1px,transparent_1px),linear-gradient(to_bottom,#2A2F4A_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* 404 Number with Glow Effect */}
        <div className="mb-8">
          <h1 
            className={`text-9xl sm:text-[12rem] md:text-[15rem] font-bold font-exo2 transition-all duration-1000 ${
              mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #FFD700 50%, #7E6BEF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 80px rgba(139, 92, 246, 0.5), 0 0 120px rgba(139, 92, 246, 0.3)',
              filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.6))',
            }}
          >
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className={`mb-12 transition-all duration-1000 delay-300 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-exo2">
            Page Not Found
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#8B5CF6] to-[#FFD700] mx-auto mb-6 rounded-full"></div>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Oops! The page you're looking for seems to have vanished into the digital void. 
            It might have been moved, deleted, or never existed.
          </p>
        </div>

        {/* Animated Icon */}
        <div className={`mb-12 transition-all duration-1000 delay-500 ${
          mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}>
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-[#8B5CF6]/20 to-[#FFD700]/20 border-2 border-[#8B5CF6]/30 backdrop-blur-sm">
            <Sparkles className="w-16 h-16 text-[#8B5CF6] animate-pulse" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-700 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <button
            onClick={() => router.push('/')}
            className="group relative px-8 py-4 bg-gradient-to-b from-[#4F01E6] to-[#25016E] text-white font-semibold rounded-full shadow-lg hover:shadow-[#8B5CF6]/50 transition-all duration-300 hover:scale-105 flex items-center gap-2 min-w-[200px] justify-center"
          >
            <Home className="w-5 h-5 group-hover:translate-x-[-2px] transition-transform" />
            <span>Go Home</span>
          </button>

          <button
            onClick={() => router.back()}
            className="group px-8 py-4 bg-[#1a1a2e] border-2 border-[#2A2F4A] text-white font-semibold rounded-full hover:border-[#8B5CF6] transition-all duration-300 hover:scale-105 flex items-center gap-2 min-w-[200px] justify-center"
          >
            <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-2px] transition-transform" />
            <span>Go Back</span>
          </button>

          <button
            onClick={() => router.push('/marketplace')}
            className="group px-8 py-4 bg-[#1a1a2e] border-2 border-[#2A2F4A] text-white font-semibold rounded-full hover:border-[#FFD700] transition-all duration-300 hover:scale-105 flex items-center gap-2 min-w-[200px] justify-center"
          >
            <Search className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Explore</span>
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 flex justify-center gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full bg-[#8B5CF6] transition-all duration-1000 delay-${(i + 1) * 200} ${
                mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              }`}
              style={{
                animation: `pulse 2s ease-in-out infinite ${i * 0.3}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  )
}

