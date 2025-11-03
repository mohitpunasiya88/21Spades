import { Typography } from "antd";

export default function PlatformFeatures() {
    const features = [
      {
        icon: '🟣',
        title: 'SOCIAL FEED',
        description: 'Where connection meets creation. Share, discover, and engage in real time.'
      },
      {
        icon: '🟣',
        title: 'Tokenize Marketplace',
        description: 'Redefining digital ownership. Trade tokenized assets across art, gaming, fashion, and more — all on-chain.'
      },
      {
        icon: '🟣',
        title: 'EVENT TICKETING',
        description: 'Access reimagined with verified digital tickets — secure, simple, and fraud‑proof.'
      },
      {
        icon: '🟣',
        title: 'COMMUNITIES',
        description: 'Built around what you love. Join, collaborate, and grow in shared spaces that matter.'
      },
      {
        icon: '🟣',
        title: 'SECURE CHAT',
        description: 'End‑to‑end encrypted conversations backed by blockchain identity.'
      },
      {
        icon: '🟣',
        title: 'AI WEB3 NEWS',
        description: 'Your Smart Web3 Digest — curated updates across crypto, NFTs, and culture.'
      }
    ];

    const isRightBorder = (index: number) => {
      // add right border on md+ except on the last col of each row
      return (index % 3) !== 2;
    };

    const isTopBorder = (index: number) => {
      // add top border for second row items
      return index >= 3;
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden rounded-3xl border border-white/20 bg-transparent backdrop-blur-lg m-12 md:m-16">
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-white text-2xl md:text-3xl">♠</div>

        <div className="container mx-auto px-6 md:px-8 flex flex-col items-center justify-center">
          <Typography
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-10 text-center gold-gradient-text font-asul w-full"
          >
            Your All-in-One Gateway to Web3 World
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 w-full max-w-6xl mx-auto mt-8 md:mt-12 text-center">
            {features.map((feature, index) => (
              <div
                key={index}
                className={
                  [
                    "flex flex-col items-center text-center px-6 py-10 md:py-12",
                    "",
                    isRightBorder(index) ? "md:border-r md:border-white/10" : "",
                    isTopBorder(index) ? "md:border-t md:border-white/10" : ""
                  ].join(' ')
                }
              >
                <div className="text-3xl md:text-4xl mb-5">{feature.icon}</div>
                <h3 className="text-lg md:text-2xl font-bold text-white tracking-wider mb-3">
                  {feature.title}
                </h3>
                <Typography.Paragraph className="text-gray-400 text-sm md:text-base leading-relaxed max-w-xs m-0">
                  {feature.description}
                </Typography.Paragraph>
              </div>
            ))}
          </div>

        </div>
      </section>
      
    );
  }
  