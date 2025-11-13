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
    <section className="py-16 md:py-20 relative overflow-hidden min-h-screen rounded-[24px]">

      <img src="/assets/star-animation.jpg" alt="How to Tokenize" className="absolute top-0 left-0 w-full h-full object-cover opacity-50" />

      {/* White spade icon at top center */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
        <span className="text-white text-5xl font-bold">♠</span>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Title Section */}
        <div className="text-center mt-4 md:mt-5 px-4">
          <h2 className="gold-gradient-text font-audiowide font-[400] text-[16px] sm:text-[36px] md:text-[48px] mb-6 md:mb-6 text-center" style={{ letterSpacing: '0.06em' }}>
            HOW TO TOKENIZE AN ASSET
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto px-4">
          {steps.map((step, index) => (
            <div key={index} className="relative min-h-[200px] md:min-h-[250px] flex flex-col md:flex-row items-center md:items-start justify-between gap-3 md:gap-2">
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
              className={`relative z-10 flex flex-col items-center text-center md:text-inherit ${
                index === 0 || index === 2 ? 'md:items-start md:text-left' : 'md:items-end md:text-right'
              } md:max-w-[460px] w-full md:mt:[60px] ${index === 0 || index === 2 ? 'md:ml-20' : ''} ${index === 1 || index === 3 ? 'md:mr-20' : ''}`}
            >
              {/* Mobile badge number */}
              <div className="md:hidden mb-2 inline-flex items-center justify-center w-10 h-1border border-white/20">
                <span className="font-audiowide text-[18px]" style={{
                  background: 'linear-gradient(180deg, #FFFFFF 22.25%, #FFB600 82.42%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                }}>{String(step.number).padStart(2,'0')}</span>
              </div>

              <h3 className="font-audiowide gold-gradient-text mb-1 text-[18px] sm:text-[22px] md:text-[32px] font-normal leading-tight tracking-wide uppercase">
                {step.title}
              </h3>
              <p
                className="text-[12px] sm:text-sm leading-relaxed font-exo2 rounded mt-2 w-full max-w-[460px] text-[#E5C9B8]"
                style={{
                }}
              >
                {step.description}
              </p>
              {/* Mobile divider */}
              {index !== steps.length - 1 && (
                <hr className="md:hidden w-4/5 mx-auto border-white/20 mt-6" />
              )}
            </div>
          </div>
          
          ))}
        </div>
      </div>
    </section>
  );
}
