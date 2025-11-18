"use client";

import { BsSuitSpade } from "react-icons/bs";
import './landingPage.css'

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
    <section className="mt-10 relative overflow-hidden">

        <div className="star-animation">
          <img src="/assets/star-animation.jpg" alt="How to Tokenize" className="absolute top-0 left-0 w-full h-full object-cover opacity-50" />
        </div>

      {/* White spade icon at top center */}


      <div className="mx-auto flex flex-col relative justify-center items-center mt-10 relative z-10">

        <div className="flex justify-center items-center">
          <BsSuitSpade className="text-white w-6 h-6" />
        </div>
        {/* Title Section */}
        <div className="text-center mt-4 md:mt-5 px-4">
          <h2 className="gold-gradient-text font-audiowide font-[400] text-[24px] sm:text-[36px] md:text-[48px] mb-6 md:mb-6 text-center" style={{ letterSpacing: '0.06em' }}>
            HOW TO TOKENIZE AN ASSET
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 my-5 gap-5 md:gap-5 md:max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative min-h-[200px] md:min-h-[250px] flex flex-col md:flex-row items-center md:items-start justify-between">
              {/* Step Number */}
              <div
                className={`absolute top-0 z-0 font-audiowide text-[50px] md:text-[100px] font-normal opacity-20 select-none ${index === 0 || index === 2 ? 'md:left-5 left-2 text-left md:-translate-y-1/8 translate-x-1/4 md:translate-x-2/3' : 'md:right-5 right-2 text-right  md:-translate-y-1/8 -translate-x-1/4 md:-translate-x-2/3'
                  }`}
                style={{
                  background: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: '1',
                  WebkitTextStroke: '2px',
                  WebkitTextStrokeColor: 'linear-gradient(180deg, #FFFFFF, #FFB600 )',
                }}
              >
                {step.number}
              </div>

              {/* Step Content */}
              <div
                className={`relative z-10 flex flex-col items-center px-5 text-center -bottom-12 md:text-inherit ${index === 0 || index === 2 ? 'items-start text-left' : 'items-end text-right'
                  } md:max-w-[460px] w-full ${index === 0 || index === 2 ? 'md:ml-20' : ''} ${index === 1 || index === 3 ? 'md:mr-20' : ''}`}
              >
                <h3 className="font-audiowide text-white mb-1 text-[16px] sm:text-[20px] md:text-[24px] font-normal leading-tight tracking-wide uppercase">
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
                  <hr className="md:hidden w-full md:w-4/5 mx-auto border-white/20 mt-6" />
                )}
              </div>
            </div>

          ))}
        </div>

        <div className=" md:absolute hidden md:flex  justify-center items-center mt-20 bottom-0 ">
          <img src="/assets/card-icon.png" alt="" className="w-[40%] h-[40%] object-contain translate-y-3/5" />
        </div>
      </div>

    </section>
  );
}
