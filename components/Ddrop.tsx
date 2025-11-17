import Image from 'next/image'
import banner from './assets/D-Drop Banner.svg'

export const Ddrop = () => {
  return (
    <div className="relative my-5 w-full h-[40vh] bg-[#0F0F23] overflow-hidden rounded-lg">
      <Image
        src={banner}
        alt="D-Drop Banner"
        fill
        priority
        className="w-full h-full object-contain sm:object-cover"
      />
    </div>

  )
}