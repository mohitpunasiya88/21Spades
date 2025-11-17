import Image from 'next/image'
import banner from './assets/D-Drop Banner.svg'

export const Ddrop = () => {
    return (
        <div className="mb-10 sm:mb-12 mt-10">
          <div className="relative w-full h-[220px] sm:h-[300px] md:h-[360px] overflow-hidden rounded-lg">
            <Image src={banner} alt="D-Drop Banner" fill priority sizes="100vw" className="object-cover" />
          </div>
        </div>
    )
}