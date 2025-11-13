const cardImages = [
  '/assets/image1.jpg',
  '/assets/image2.jpg',
  '/assets/image3.jpg',
  '/assets/image4.jpg',
  '/assets/image5.jpg',
  '/assets/image6.jpg',
];

function AuthLeftPanel() {
  return (
    <div className="hidden md:block w-1/2 relative px-5 overflow-hidden bg-[#03020800]">
      {/* Bottom-right purple glow to match signup page */}
      <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96  rounded-full "></div>
      {/* Header logo above cards */}
      <div className="absolute w-[200] mx-24 flex justify-center z-8 p-4 mt-8">
        <img src="/assets/logo.png" alt="21 Spades" className="h-8 sm:h-10 object-contain" />
      </div>
      <div className="absolute top-0 left-0 right-0 w-full h-full flex justify-center gap-6 p-6">
        <div className="flex flex-col gap-6 animate-scroll-up">
          {[...cardImages, ...cardImages].map((src, index) => (
            <div
              key={`col1-${index}`}
              className={`w-64 h-95 rounded-3xl flex-shrink-0  relative overflow-hidden`}
            >
              <img src={src} alt={`Card ${index + 1}`} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6 animate-scroll-down">
          {[...cardImages.slice().reverse(), ...cardImages].map((src, index) => (
            <div
              key={`col2-${index}`}
              className={`w-64 h-94 rounded-3xl flex-shrink-0  relative overflow-hidden`}
            >
              <img src={src} alt={`Card ${index + 1}`} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
          ))}
        </div>
      </div>

      {/* <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a1f] via-transparent to-[#0a0a1f] pointer-events-none"></div> */}
    </div>
  );
}

export default AuthLeftPanel;
