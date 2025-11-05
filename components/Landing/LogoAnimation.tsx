import React from 'react'

export default function LogoAnimation() {
  const items = Array.from({ length: 8 }).map((_, i) => i)

  const Logo = () => (
    <div className="flex items-center gap-2 mx-10">
      <img src="/assets/logo.png" alt="Logo" className="w-full h-full" />
    </div>
  )

  return (
    <div className="px-4 md:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1367px] h-[72px] rounded-[20px] border border-white/30 overflow-hidden">
        <div className="logo-marquee relative h-full">
          {/* Track duplicated for seamless loop */}
          <div className="marquee-track h-full flex items-center">
            {items.map((i) => (
              <Logo key={`a-${i}`} />
            ))}
          </div>
          <div className="marquee-track h-full flex items-center" aria-hidden>
            {items.map((i) => (
              <Logo key={`b-${i}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}