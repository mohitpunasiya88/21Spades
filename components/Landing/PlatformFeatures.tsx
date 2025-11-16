export default function PlatformFeatures() {
  const features = [
    {
      title: 'SOCIAL FEED',
      description: 'Where connection meets creation. Share, discover, and engage in real time.'
    },
    {
      title: 'EVENT TICKETING',
      description: 'Access reimagined. Verified digital tickets secure, simple, and fraud‑proof.'
    },
    {
      title: 'Tokenize Marketplace',
      description: 'Redefining digital ownership trade tokenized assets across art, gaming, fashion, and beyond all on-chain.'
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
    <section className="w-full md:w-[97%] mx-auto py-8 sm:py-10 md:py-12 lg:py-16">
      {/* Outer Frame */}
      <div className="mx-auto w-full rounded-[10px] border border-[#FFFFFF33] border-[0.6px] backdrop-blur-md overflow-hidden">

        {/* Heading */}
        <div className="flex flex-col items-center pt-8 sm:pt-10 md:pt-12 lg:pt-14 px-4 sm:px-6">
          <div className="text-white/90 mb-2 sm:mb-3 text-3xl sm:text-4xl md:text-[40px] font-semibold">♠</div>

          <p className="text-center text-[20px] sm:text-3xl md:text-4xl lg:text-5xl px-4 leading-tight font-audiowide gold-gradient-text">
            Your All-in-One Gateway to Web3 World
          </p>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mt-8 sm:mt-10 md:mt-12 lg:mt-16 w-full px-4 sm:px-6 md:px-8 lg:px-12 pb-8 sm:pb-10 md:pb-12">

          <div className="
        grid grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-3 
        divide-y divide-white/20 
        sm:divide-y-0 sm:divide-x sm:divide-y 
        lg:divide-y lg:divide-x
      ">

            {features.map((f, idx) => (
              <div
                key={f.title}
                className="
              flex flex-col items-start sm:items-center justify-start 
              text-left sm:text-center gap-2 sm:gap-4 px-4 sm:px-6 md:px-8 lg:px-10 
              py-6 sm:py-8 md:py-10
              min-h-[160px] sm:min-h-[220px] md:min-h-[20px]
            "
              >
                {/* Icon */}
                <div className="w-7 h-7 rounded-[5px] bg-[#6E58E6]/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg text-white">▣</span>
                </div>

                {/* Title */}
                <div className="min-h-[32px] sm:min-h-[40px] flex items-center mt-1">
                  <h3 className="text-white uppercase tracking-wide 
                text-[16px] sm:text-xl md:text-2xl lg:text-[28px] 
                leading-tight font-audiowide font-[400]">
                    {f.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-[12px] sm:text-base md:text-[18px] lg:text-[20px] 
              text-[#E5C9B8] max-w-[308px] leading-snug sm:leading-relaxed font-exo2">
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