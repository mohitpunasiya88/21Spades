import { BsSuitSpade } from "react-icons/bs";

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
      <section className="py-5 md:py-10">
        <div className="flex flex-col justify-center items-center">
        {/* White spade icon at top center */}
        <div className="flex justify-center items-center">
          <BsSuitSpade className="text-white w-6 h-6" />
        </div>
  
          {/* Header Section */}
          <div className="text-center mt-5">
            <h2 className="gold-gradient-text font-audiowide text-xl md:text-5xl mb-6 text-center">
              Why 21spades
            </h2>
            <p className="text-[#A3AED0] text-base sm:text-lg font-exo2 font-medium max-w-[600px] w-full mx-auto text-center px-2 mb-4">
              All-in-one access to social, Tokenization, events, and news powered by Web3 simplicity.
            </p>
          </div>
  
          {/* Content Grid Container - 2x2 Grid Layout */}
          <div className="flex justify-center md:px-4 w-full mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full md:w-[80%] md:mx-auto">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className={`
                    relative flex flex-col
                    p-6 md:p-8
                    ${index === 0 ? 'justify-start items-start text-start' : ''}
                    ${index === 1 ? 'justify-start md:justify-end items-start md:items-end text-start md:text-end' : ''}
                    ${index === 2 ? 'justify-start items-start text-start' : ''}
                    ${index === 3 ? 'justify-start md:justify-end items-start md:items-end text-start md:text-end' : ''}
                  `}
                >
                  <h3 className="text-white text-sm md:text-base font-[400] font-audiowide uppercase tracking-wider mb-3 md:mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-[#E5C9B8] text-xs md:text-sm leading-relaxed font-exo2 w-full md:w-[300px]">
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