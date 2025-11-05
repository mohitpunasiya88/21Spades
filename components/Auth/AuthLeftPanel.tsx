const cardImages = [
  {
    id: 1,
    gradient: 'from-purple-900 via-blue-900 to-cyan-600',
    type: 'cityscape'
  },
  {
    id: 2,
    gradient: 'from-pink-600 via-purple-600 to-blue-600',
    type: 'abstract'
  },
  {
    id: 3,
    gradient: 'from-cyan-500 via-blue-600 to-purple-700',
    type: 'isometric'
  },
  {
    id: 4,
    gradient: 'from-purple-600 via-pink-600 to-orange-500',
    type: 'character'
  },
];

function AuthLeftPanel() {
  return (
    <div className="hidden md:block md:w-1/2 relative overflow-hidden bg-black">
      <div className="absolute top-0 left-0 right-0 w-full h-full flex gap-6 p-6">
        <div className="flex flex-col gap-6 animate-scroll-up">
          {[...cardImages, ...cardImages].map((card, index) => (
            <div
              key={`col1-${index}`}
              className={`w-80 h-96 rounded-3xl bg-gradient-to-br ${card.gradient} flex-shrink-0 shadow-2xl relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute inset-0 backdrop-blur-sm bg-white/5"></div>
              {card.type === 'cityscape' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg opacity-60 transform rotate-12"></div>
                  <div className="absolute w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg opacity-60 transform -rotate-6"></div>
                </div>
              )}
              {card.type === 'isometric' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-64 h-64">
                    <div className="absolute top-1/4 left-1/4 w-20 h-32 bg-gradient-to-b from-cyan-400 to-blue-600 transform skew-y-12 opacity-80"></div>
                    <div className="absolute top-1/3 right-1/4 w-16 h-28 bg-gradient-to-b from-purple-400 to-pink-600 transform skew-y-12 opacity-80"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-24 h-36 bg-gradient-to-b from-blue-500 to-purple-700 transform skew-y-12 opacity-80"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6 animate-scroll-down">
          {[...cardImages.reverse(), ...cardImages].map((card, index) => (
            <div
              key={`col2-${index}`}
              className={`w-80 h-96 rounded-3xl bg-gradient-to-br ${card.gradient} flex-shrink-0 shadow-2xl relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute inset-0 backdrop-blur-sm bg-white/5"></div>
              {card.type === 'abstract' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-56 h-56 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full opacity-50 blur-xl"></div>
                  <div className="absolute w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-60"></div>
                </div>
              )}
              {card.type === 'character' && (
                <div className="absolute inset-0">
                  <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full opacity-70"></div>
                  <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full opacity-70"></div>
                  <div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full opacity-70"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a1f] via-transparent to-[#0a0a1f] pointer-events-none"></div>
    </div>
  );
}

export default AuthLeftPanel;
