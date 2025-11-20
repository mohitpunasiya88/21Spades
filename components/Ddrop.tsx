import Image from 'next/image'
import banner from './assets/D-Drop Banner.svg'

export const Ddrop = () => {
  return (
    <div className="relative my-5 w-full aspect-[5/2] bg-[#0F0F23] overflow-hidden rounded-lg">
      <Image
        src={banner}
        alt="D-Drop Banner"
        fill
        priority
        className="object-cover w-full h-full"
      />
    </div>

  )
}