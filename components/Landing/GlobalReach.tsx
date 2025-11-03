import { marginStyle } from "../Style/style";

export default function GlobalReach() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-4">
      {/* Spade Icon */}
       <div className="text-white text-6xl md:text-7xl">♠</div>

      {/* Main Title with Golden Gradient */}
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-yellow-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent" style={{ margin: '10px' }}>
        Global Reach & Impact
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 w-full max-w-5xl" style={marginStyle}>
        {/* Stat 1 */}
        <div className="flex flex-col items-center" style={{margin: '40px'}}>
          <div className="text-3xl md:text-4xl font-bold text-white mb-2">
            250K+
          </div>
          <div className="text-base md:text-lg text-purple-400 font-medium">
            Active Users
          </div>
        </div>

        {/* Stat 2 */}
        <div className="flex flex-col items-center" style={{margin: '40px'}}>
          <div className="text-3xl md:text-4xl font-bold text-white mb-2">
            1M+
          </div>
          <div className="text-base md:text-lg text-purple-400 font-medium">
            Digital Creations
          </div>
        </div>

        {/* Stat 3 */}
        <div className="flex flex-col items-center" style={{margin: '40px'}}>
          <div className="text-3xl md:text-4xl font-bold text-white mb-2">
            Top 10
          </div>
          <div className="text-base md:text-lg text-purple-400 font-medium">
            Market Ranking
          </div>
        </div>
      </div>
    </div>
  );
  }
  