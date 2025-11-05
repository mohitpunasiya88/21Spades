export default function PlatformFeatures() {
  const features = [
    {
      title: 'SOCIAL FEED',
      description: 'Where connection meets creation. Share, discover, and engage in real time.'
    },
    {
      title: 'Tokenize Marketplace',
      description: 'Redefining digital ownership trade tokenized assets across art, gaming, fashion, and beyond all on-chain.'
    },
    {
      title: 'EVENT TICKETING',
      description: 'Access reimagined. Verified digital tickets secure, simple, and fraud‑proof.'
    },
    {
      title: 'COMMUNITIES',
      description: 'Built around what you love. Join, collaborate, and grow in shared spaces that matter.'
    },
    {
      title: 'SECURE CHAT',
      description: 'Privacy meets Connection. End‑to‑end encrypted conversations backed by blockchain identity.'
    },
    {
      title: 'AI WEB3 NEWS',
      description: 'Your Smart Web3 Digest. Curated updates across crypto, NFTs, and culture — personalized for you.'
    }
  ];

  return (
    <section className="px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12 lg:py-16">
      {/* Outer frame */}
      <div className="mx-auto w-full max-w-[1367px] rounded-3xl sm:rounded-[40px] md:rounded-[51px] border border-white/20 overflow-hidden">
        
        {/* Heading Section */}
        <div className="flex flex-col items-center pt-8 sm:pt-10 md:pt-12 lg:pt-14 px-4 sm:px-6">
          <div className="text-white/90 mb-2 sm:mb-3 text-3xl sm:text-4xl md:text-[40px] font-semibold">♠</div>
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl px-4 leading-tight font-audiowide gold-gradient-text">
            Your All-in-One Gateway to Web3 World
          </h2>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mt-8 sm:mt-10 md:mt-12 lg:mt-16 w-full px-4 sm:px-6 md:px-8 lg:px-12 pb-8 sm:pb-10 md:pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-0">
            {features.map((f, idx) => (
              <div
                key={f.title}
                className={
                  'flex flex-col items-center justify-start text-center gap-3 sm:gap-4 px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10 relative min-h-[200px] sm:min-h-[220px] md:min-h-[240px] ' +
                  // Desktop borders (3 columns)
                  (idx % 3 !== 2 ? ' lg:border-r lg:border-white/20'  : '') +
                  (idx >= 3 ? ' lg:border-t lg:border-white/20' : '') + 
                  // Tablet borders (2 columns)
                  (idx % 2 !== 1 ? ' sm:border-r sm:border-white/20 lg:border-r-0' : ' sm:border-r-0') +
                  (idx >= 2 ? ' sm:border-t sm:border-white/20 lg:border-t-0' : '') +
                  (idx >= 3 ? ' lg:border-t lg:border-white/20' : '') +
                  // Mobile borders
                  (idx !== features.length - 1 ? ' border-b border-white/20 sm:border-b-0' : '')
                }
              >
                {/* Icon block */}
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-[5px] bg-[#6E58E6]/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-base sm:text-lg text-white">▣</span>
                </div>

                {/* Title */}
                <div className="min-h-[36px] sm:min-h-[40px] flex items-center">
                  <h3 className="text-white text-lg sm:text-xl md:text-2xl lg:text-[28px] leading-tight font-audiowide">
                    {f.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg text-[#E5C9B8] max-w-[330px] leading-relaxed font-exo2">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}