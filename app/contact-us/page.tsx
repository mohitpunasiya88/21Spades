"use client";

import Header from "@/components/Landing/Header";
import Footer from "@/components/Landing/Footer";
import Image from "next/image";
import spadesImageRight from "@/components/assets/Spades-left-Right.png"


export default function ContactUsPage() {
  return (
    <div style={{ background: "#0F0F23", minHeight: "100vh", width: "100%", overflowX: "hidden" }} >
      {/* Header */}
      <div className="w-full">
        <Header />
      </div>

      {/* Content */}
      <div className="w-full px-4 w-[100%]">
        <div className=" mx-auto w-[100%]">
          {/* Banner */}
        

          {/* Contact Form Card */}
          <div className="bg-[#090721] rounded-2xl md:rounded-3xl border border-white/10 px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 md:py-10">
            <div className="relative rounded-xl  overflow-hidden bg-gradient-to-r from-[#4F01E6] to-[#020019] h-[120px] md:h-[160px]">
                  <div className="absolute inset-0 overflow-hidden">

  {/* Left Spade */}
  <div
    className="
      absolute left-0 top-1/2 -translate-y-1/2 
      -translate-x-[35%] 
      w-[150px] h-[150px] 
      sm:w-[200px] sm:h-[200px] 
      md:w-[240px] md:h-[240px] md:-translate-x-[20%] 
      lg:w-[300px] lg:h-[300px] lg:-translate-x-[15%]
    "
  >
    <Image
      src={spadesImageRight}
      alt="Left spade accent"
      fill
      sizes="(max-width: 640px) 150px,
             (max-width: 768px) 200px,
             (max-width: 1024px) 240px,
             300px"
      priority
      className="object-contain"
      style={{
        filter: "blur(3px) brightness(1.5) contrast(1.3)",
        transform: "scaleX(-1)",
      }}
    />
  </div>

  {/* Right Spade */}
  <div
    className="
      absolute right-0 top-1/2 -translate-y-1/2 
      translate-x-[35%] 
      w-[150px] h-[150px] 
      sm:w-[200px] sm:h-[200px] 
      md:w-[240px] md:h-[240px] md:translate-x-[20%]
      lg:w-[300px] lg:h-[300px] lg:translate-x-[15%]
    "
  >
    <Image
      src={spadesImageRight}
      alt="Right spade accent"
      fill
      sizes="(max-width: 640px) 150px,
             (max-width: 768px) 200px,
             (max-width: 1024px) 240px,
             300px"
      priority
      className="object-contain"
      style={{
        filter: "blur(3px) brightness(1.5) contrast(1.3)",
      }}
    />
  </div>

</div>

                   {/* Text Content */}
                   <div className="relative z-10 flex items-center justify-center h-full">
                     <h1 className="text-white text-lg sm:text-2xl md:text-3xl lg:text-4xl font-exo2 tracking-wider font-semibold">
                       Need help on 21Spades?
                     </h1>
                   </div>
                 </div>
            <h2 className="text-white mt-4 text-2xl md:text-3xl font-semibold mb-6 md:mb-8 text-start" style={{ fontFamily: 'var(--font-exo2)' }}>
              Contact Us
            </h2>

            <form className="space-y-6 md:space-y-7">
              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm md:text-base text-gray-200" style={{ fontFamily: 'var(--font-exo2)' }}>
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-[#05051a] border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm md:text-base"
                  style={{ fontFamily: 'var(--font-exo2)' }}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm md:text-base text-gray-200" style={{ fontFamily: 'var(--font-exo2)' }}>
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email id"
                  className="w-full px-4 py-3 bg-[#05051a] border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm md:text-base"
                  style={{ fontFamily: 'var(--font-exo2)' }}
                />
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label className="block text-sm md:text-base text-gray-200" style={{ fontFamily: 'var(--font-exo2)' }}>
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your Subject"
                  className="w-full px-4 py-3 bg-[#05051a] border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm md:text-base"
                  style={{ fontFamily: 'var(--font-exo2)' }}
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="block text-sm md:text-base text-gray-200" style={{ fontFamily: 'var(--font-exo2)' }}>
                  How can we help? <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Write what you wish to enquire from us"
                  className="w-full px-4 py-3 bg-[#05051a] border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm md:text-base resize-none"
                  style={{ fontFamily: 'var(--font-exo2)' }}
                />
              </div>

              {/* File Upload (UI only) */}
              <div className="space-y-2">
                <label className="block text-sm md:text-base text-gray-200" style={{ fontFamily: 'var(--font-exo2)' }}>
                  Attachment
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3 text-sm md:text-base">
                  <label className="inline-flex items-center px-4 py-2 rounded-full bg-[#05051a] border border-white/15 text-white cursor-pointer hover:border-purple-500 transition-colors" style={{ fontFamily: 'var(--font-exo2)' }}>
                    Choose File
                    <input type="file" className="hidden" />
                  </label>
                  <span className="text-gray-500" style={{ fontFamily: 'var(--font-exo2)' }}>
                    No file chosen
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="button"
                  className="w-full px-6 py-3 md:py-3.5 rounded-full text-white font-bold bg-gradient-to-r from-[#4F01E6] to-[#25016E] shadow-[0_12px_30px_rgba(37,1,110,0.7)] hover:brightness-110 transition-all text-sm md:text-base"
                  style={{ fontFamily: 'var(--font-exo2)' }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
