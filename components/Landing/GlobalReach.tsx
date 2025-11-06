export default function GlobalReach() {
  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
      {/* Spade Icon */}
      <div className="text-white text-3xl sm:text-4xl md:text-[40px] font-semibold mb-2 sm:mb-3">♠</div>

      {/* Main Title with Golden Gradient */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center mb-8 sm:mb-12 md:mb-16 px-4 gold-gradient-text font-audiowide">
        Global Reach & Impact
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 lg:gap-16 w-full max-w-5xl">
        {/* Stat 1 */}
        <div className="flex flex-col items-center py-6 sm:py-8 md:py-10">
          <div className="text-[36px] sm:text-[20px] md:text-[28px] lg:text-[36px] font-[700] font-exo2 ">
            250K+
          </div>
          <div className="text-[24px] sm:text-[16px] md:text-[20px] lg:text-[24px] text-[#884DFF] font-exo2 font-[700] ">
            Active Users
          </div>
        </div>

        {/* Stat 2 */}
        <div className="flex flex-col items-center py-6 sm:py-8 md:py-10">
          <div className="text-[36px] sm:text-[20px] md:text-[28px] lg:text-[36px] font-[700] font-exo2 ">
            1M+
          </div>
          <div className="text-[24px] sm:text-[16px] md:text-[20px] lg:text-[24px] text-[#884DFF] font-exo2 font-[400] ">
            Digital Creations
          </div>
        </div>

        {/* Stat 3 */}
        <div className="flex flex-col items-center py-6 sm:py-8 md:py-10 sm:col-span-2 md:col-span-1">
          <div className="text-[36px] sm:text-[20px] md:text-[28px] lg:text-[36px] font-[700] font-exo2 ">
            Top 10
          </div>
          <div className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] text-[#884DFF] font-exo2 font-[400] ">
            Market Ranking
          </div>
        </div>
      </div>
    </div>
  );
}
