import { BsSuitSpade } from "react-icons/bs";

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
    <section className="w-full md:w-[97%] mx-auto mt-5 py-10 px-5 rounded-lg border border-[#FFFFFF33] border-[0.6px]">
      {/* Outer Frame */}
      {/* <div className="overflow-hidden"> */}

      {/* Heading */}
      <div className="flex flex-col items-center">
        <div className="flex justify-center items-center my-2">
          <BsSuitSpade className="text-white w-6 h-6" />
        </div>

        <p className="text-center text-[32px] md:text-[48px] font-audiowide gold-gradient-text">
          Your All-in-One Gateway to Web3 World
        </p>
      </div>

      {/* Features Grid */}
      <div className="mx-auto mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

          {features.map((f, idx) => {
            const rightBorder = [0, 1, 3, 4].includes(idx)
              ? "md:border-r md:border-[#A3AED033]"
              : ""

            const bottomBorder = [0, 1, 2].includes(idx)
              ? "md:border-b md:border-[#A3AED033]"
              : ""

            return (
              <div
                key={f.title}
                className={
                  `flex flex-col items-start sm:items-center justify-start text-left sm:text-center gap-2 sm:gap-4 p-4  ${rightBorder} ${bottomBorder}`
                }
              >
                {/* Icon */}
                <div className="w-7 h-7 rounded-[5px] bg-[#6E58E6]/40 flex items-center justify-center ">
                  <span className="text-lg text-white">▣</span>
                </div>

                {/* Title */}
                <div className="min-h-[20px] sm:min-h-[20px] flex items-center mt-1">
                  <h3 className="text-white uppercase tracking-wide text-[16px] sm:text-[18px] md:text-[24px] lg:text-[24px] leading-tight font-audiowide font-[400]">
                    {f.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-[14px] sm:text-[16px] md:text-[20px] lg:text-[20px] text-[#E5C9B8] sm:leading-relaxed font-exo2">
                  {f.description}
                </p>
              </div>
            )
          })}

        </div>
      </div>

      {/* </div> */}
    </section>

  );
}