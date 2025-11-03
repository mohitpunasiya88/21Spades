export default function HowToTokenize() {
    const steps = [
      {
        number: '1',
        title: 'Set up a Crypto Wallet',
        description: 'Lorem ipsum dolor sit amet consectetur. Commodo vulputate pellentesque sagittis odio in duis. Vitae et Lorem ipsum dolor sit amet consectetur. Commodo'
      },
      {
        number: '2',
        title: 'Choose a Blockchain',
        description: 'Lorem ipsum dolor sit amet consectetur. Commodo vulputate pellentesque sagittis odio in duis. Vitae et Lorem ipsum dolor sit amet consectetur. Commodo'
      },
      {
        number: '3',
        title: 'Create Your Collection',
        description: 'Lorem ipsum dolor sit amet consectetur. Commodo vulputate pellentesque sagittis odio in duis. Vitae et Lorem ipsum dolor sit amet consectetur. Commodo'
      },
      {
        number: '4',
        title: 'Mint Your Asset',
        description: 'Lorem ipsum dolor sit amet consectetur. Commodo vulputate pellentesque sagittis odio in duis. Vitae et Lorem ipsum dolor sit amet consectetur. Commodo'
      }
    ];
  
    return (
      <section className="py-20 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDAgTCAwIDIwIE0gMCAwIEwgMjAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />
  
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-white text-4xl z-10">♠</div>
  
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-yellow-400" style={{ fontFamily: 'system-ui, sans-serif', letterSpacing: '0.05em' }}>
              HOW TO TOKENIZE AN ASSET
            </h2>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto mb-20">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center text-white text-2xl font-bold border-2 border-purple-400">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-purple-300 text-2xl font-bold mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
  
          <div className="relative flex justify-center mb-20">
            <svg viewBox="0 0 300 200" className="w-full max-w-md">
              <defs>
                <linearGradient id="bottomSpadeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#FCD34D', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#F59E0B', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <path
                d="M 150 0 L 75 150 L 125 150 L 125 180 L 175 180 L 175 150 L 225 150 Z"
                fill="url(#bottomSpadeGradient)"
                stroke="#FCD34D"
                strokeWidth="3"
              />
            </svg>
          </div>
  
          <div className="overflow-hidden mb-20">
            <div className="flex animate-scroll whitespace-nowrap">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="inline-flex items-center mx-8">
                  <span className="text-3xl font-bold text-white">21</span>
                  <span className="text-yellow-400 text-3xl mx-1">♠</span>
                  <span className="text-3xl font-bold" style={{ color: '#9b59ff' }}>SPADES</span>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        <style>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-scroll {
            animation: scroll 30s linear infinite;
          }
        `}</style>
      </section>
    );
  }
  