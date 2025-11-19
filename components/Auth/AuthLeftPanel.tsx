// Generate array of all images from /auth directory (1.jpg to 29.jpg and 30.png)
const cardImages = Array.from({ length: 30 }, (_, i) => {
  if (i === 29) return '/auth/30.png';
  return `/auth/${i + 1}.jpg`;
});

function AuthLeftPanel() {
  // Split images into 3 columns for better distribution
  const col1Images = cardImages.filter((_, i) => i % 3 === 0);
  const col2Images = cardImages.filter((_, i) => i % 3 === 1);
  const col3Images = cardImages.filter((_, i) => i % 3 === 2);

  return (
    <div className="absolute justify-center  items-center  md:relative inset-0 md:w-1/2 w-full  px-5 m-4 overflow-hidden bg-black opacity-20 md:opacity-100">
      {/* Bottom-right purple glow - very subtle effect matching Figma */}
      <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-purple-600/8 rounded-full blur-3xl"></div>
      {/* Header logo above cards - Hidden on mobile, shown on desktop */}
      <div className="hidden md:flex absolute w-[200] mx-24 justify-center z-8 p-4 mt-8">
        <img src="/assets/logo.png" alt="21 Spades" className="h-8 sm:h-10 object-contain" />
      </div>
      <div className="absolute top-0 left-0 right-0 w-full h-full flex justify-center gap-4 md:gap-6 p-4 md:p-6">
        {/* Column 1 - Scroll Up */}
        <div className="flex flex-col gap-6 animate-scroll-up">
          {[...col1Images, ...col1Images].map((src, index) => (
            <div
              key={`col1-${index}`}
              className={`w-40 md:w-56 h-72 md:h-80 rounded-3xl flex-shrink-0 relative overflow-hidden`}
            >
              <img src={src} alt={`Card ${index + 1}`} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
          ))}
        </div>

        {/* Column 2 - Scroll Down */}
        <div className="flex flex-col gap-6 animate-scroll-down">
          {[...col2Images.slice().reverse(), ...col2Images].map((src, index) => (
            <div
              key={`col2-${index}`}
              className={`w-40 md:w-56 h-72 md:h-80 rounded-3xl flex-shrink-0 relative overflow-hidden`}
            >
              <img src={src} alt={`Card ${index + 1}`} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
          ))}
        </div>

        {/* Column 3 - Scroll Up (with delay for variety) */}
        <div className="flex flex-col gap-6 animate-scroll-up">
          {[...col3Images, ...col3Images].map((src, index) => (
            <div
              key={`col3-${index}`}
              className={`w-40 md:w-56 h-72 md:h-80 rounded-3xl flex-shrink-0 relative overflow-hidden`}
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
