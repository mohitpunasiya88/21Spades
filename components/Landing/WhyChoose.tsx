export default function WhyChoose() {
    const features = [
      {
        title: 'CURATED PREMIUM CONTENT',
        description: 'Quality over quantity, Discover handpicked creators, collections, and storles that define the culture of Web3.'
      },
      {
        title: 'VIBRANT COMMUNITY SUPPORT',
        description: 'Bullt around you, Engage with creators, collectors, and fans In a network that thrives on collaboration and connection.'
      },
      {
        title: 'SECURE AND TRANSPARENT',
        description: 'Trust, on-chain, Your assets and data are protected by blockchain technology, which is fully verifiable, always yours.'
      },
      {
        title: 'BLAZING FAST TRANSACTION',
        description: 'Speed meets simplicity., Experlence seamless trades, mints, and payments powered by next-gen Web3 Infrastructure.'
      }
    ];
  
    return (
      <section className="py-20 relative">
        {/* White spade icon at top center */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
          <span className="text-white text-5xl font-bold">♠</span>
        </div>
  
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mt-5">
            <h2 className="gold-gradient-text font-audiowide text-4xl md:text-5xl mb-6 text-center">
              Why 21spades
            </h2>
            <p className="text-white w-[500px] text-lg font-exo2 font-medium max-w-3xl mx-auto text-center">
              All-in-one access to social, Tokenization, events, and news powered by Web3 simplicity.
            </p>
          </div>
  
          {/* Content Grid Container - Centered with specified dimensions */}
          <div className="flex justify-center">
            <div 
              className="grid grid-cols-1 md:grid-cols-2 max-w-full mx-auto my-0"
              style={{
                width: '1000px',
                minHeight: '350px',
              }}
            >
              {features.map((feature, index) => (
                <div key={index} className="relative flex flex-col items-center justify-center">
                  <h3 className="text-[#884DFF] text-lg font-bold mb-3 font-audiowide text-center" style={{ letterSpacing: '0.1em' }}>
                    {feature.title}
                  </h3>
                  <p className="text-[#E5C9B8] text-sm leading-relaxed font-exo2 w-[400px] text-center">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
  