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
  ]

  return (
    <section className="px-4 md:px-6 lg:px-8 py-10">
      {/* Outer frame 1367x591 with rounded and thin border */}
      <div className="mx-auto w-full max-w-[1367px] rounded-[51px] border border-white/20" style={{ minHeight: 591 }}>
        {/* Heading */}
        <div className="flex flex-col items-center pt-10 md:pt-14">
          <div className="text-white/90 mb-3">{/* small spade */}♠</div>
          <h2
            className="text-center font-audiowide gold-gradient-text font-audiowide text-4xl md:text-5xl font-bold"
           
          >
            Your All-in-One Gateway to Web3 World
          </h2>
        </div>

        {/* Grid group */}
        <div className="mx-auto mt-10 md:mt-16 w-[min(1254px,100%)] px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0 items-stretch">
            {features.map((f, idx) => (
              <div
                key={f.title}
                className={
                  'flex flex-col items-center justify-center text-center gap-3 px-6 md:px-10 py-6 md:py-10 relative h-full' +
                  (idx % 3 !== 2 ? ' md:border-r md:border-white/20 md:border-r-[0.6px]' : '') +
                  (idx >= 3 ? ' md:border-t md:border-white/20 md:border-t-[0.6px]' : '')
                }
                style={{ width: '100%', minHeight: 130 }}
              >
                {/* Icon block 28x28 with 5px radius */}
                <div className="w-7 h-7 rounded-[5px] bg-[#6E58E6]/40 flex items-center justify-center">
                  <span className="text-lg">▣</span>
                </div>

                {/* Title plate 214x36 look */}
                <div className="min-h-9">
                  <h3
                    className="font-audiowide text-center"
                    style={{
                      fontFamily: 'var(--font-audiowide)',
                      fontWeight: 400,
                      fontSize: 'clamp(18px, 2.4vw, 28px)',
                      lineHeight: '100%'
                    }}
                  >
                    {f.title}
                  </h3>
                </div>

                <p className="text-center text-white/80 max-w-[330px]">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
  