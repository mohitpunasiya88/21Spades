"use client";

export default function HowToTokenize() {
  const steps = [
    {
      number: '01',
      title: 'Set up a Crypto Wallet',
      description: 'Your key to the 21Spades world. Create or connect a wallet in seconds, no crypto experience required. Store, trade and interact securely with full ownership of your digital assets.'
    },
    {
      number: '02',
      title: 'Choose a Blockchain',
      description: 'Pick your digital home. Select the blockchain that fits your style and assets start creating, collecting, and connecting instantly.'
    },
    {
      number: '03',
      title: 'Create Your Collection',
      description: 'Showcase what you love. Easily mint and organize your Tokens into personalized collections your digital gallery, your rules.'
    },
    {
      number: '04',
      title: 'Mint Your Asset',
      description: 'Bring your creations to life. Turn your Art, Ticket and Real Estate into verified Tokens on the blockchain instantly yours to collect, trade, and share.'
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden min-h-screen">

      <img src="/assets/star-animation.jpg" alt="How to Tokenize" className="absolute top-0 left-0 w-full h-full object-cover opacity-50" />

      {/* White spade icon at top center */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
        <span className="text-white text-5xl font-bold">♠</span>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Title Section */}
        <div className="text-center mt-5 px-4">
          <h2 className="gold-gradient-text font-audiowide font-[400] text-[36px] sm:text-[44px] md:text-[48px] mb-6 text-center" style={{ letterSpacing: '0.05em' }}>
            HOW TO TOKENIZE AN ASSET
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 max-w-6xl mx-auto px-4">
          {steps.map((step, index) => (
            <div key={index} className="relative min-h-[220px] md:min-h-[250px] flex flex-col md:flex-row items-center md:items-start justify-between gap-2">
            {/* Step Number */}
            <div
              className={`hidden md:block absolute top-0 z-0 font-audiowide text-[120px] font-normal opacity-20 select-none ${
                index === 0 || index === 2 ? 'left-0 text-left translate-y-1/4 translate-x-1/3' : 'right-0 text-right translate-y-1/4 -translate-x-1/3'
              }`}
              style={{
                background: 'linear-gradient(180deg, #FFFFFF 22.25%, #FFB600 82.42%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: '1',
              }}
            >
              {step.number}
            </div>
          
            {/* Step Content */}
            <div
              className={`relative z-10 flex flex-col ${
                index === 0 || index === 2 ? 'items-start text-left' : 'items-end text-right'
              } md:max-w-[460px] w-full md:mt-[60px] ${index === 0 || index === 2 ? 'md:ml-20' : ''} ${index === 1 || index === 3 ? 'md:mr-20' : ''}`}
            >
              <h3 className="font-audiowide text-[#884DFF] mb-2 text-[22px] sm:text-[26px] md:text-[32px] font-normal leading-tight tracking-wide">
                {step.title}
              </h3>
              <p
                className="text-sm sm:text-base leading-relaxed font-exo2 rounded mt-2 w-full max-w-[460px]"
                style={{
                  color: '#E5C9B8',
                }}
              >
                {step.description}
              </p>
            </div>
          </div>
          
          ))}
        </div>
      </div>
    </section>
  );
}
