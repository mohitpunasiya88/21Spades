// 'use client'

// import { useState, useEffect, useRef } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { useAuthStore } from '@/lib/store/authStore'
// import { ArrowLeft } from 'lucide-react'

// export default function OTPVerification() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const phone = searchParams.get('phone') || ''
//   const { verifyOTP, isLoading } = useAuthStore()
//   const [otp, setOtp] = useState(['', '', '', ''])
//   const [timer, setTimer] = useState(60)
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([])

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTimer((prev) => (prev > 0 ? prev - 1 : 0))
//     }, 1000)
//     return () => clearInterval(interval)
//   }, [])

//   const handleChange = (index: number, value: string) => {
//     if (value.length > 1) return
//     const newOtp = [...otp]
//     newOtp[index] = value
//     setOtp(newOtp)

//     if (value && index < 3) {
//       inputRefs.current[index + 1]?.focus()
//     }
//   }

//   const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
//     if (e.key === 'Backspace' && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus()
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const otpString = otp.join('')
//     if (otpString.length !== 4) return

//     try {
//       await verifyOTP({ phone, otp: otpString })
//       router.push('/feed')
//     } catch (error) {
//       console.error('OTP verification error:', error)
//       alert('Invalid OTP. Try 1234 or 1537')
//     }
//   }

//   const maskedPhone = phone.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+1 *** *** $4')

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <div className="w-full max-w-2xl bg-gradient-to-br from-[#4A01D8] to-black border border-gray-800/40 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
//         <h2 className="text-2xl font-bold text-purple-400 mb-2 text-center">
//           Enter the OTP code
//         </h2>
//         <p className="text-gray-400 mb-2 text-sm text-center">
//           Not registered yet?{' '}
//           <button
//             onClick={() => router.push('/signup')}
//             className="text-purple-400 hover:text-purple-300 underline"
//           >
//             Create Account
//           </button>
//         </p>

//         <p className="text-sm text-gray-500 mb-6">
//           Enter the 4-digit code that we have sent on the Phone No. <br /> {maskedPhone || '+1 *** *** 7294'}
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="flex gap-3 justify-center">
//             {otp.map((digit, index) => (
//               <input
//                 key={index}
//                 ref={(el) => {
//                   inputRefs.current[index] = el
//                 }}
//                 type="text"
//                 inputMode="numeric"
//                 maxLength={1}
//                 value={digit}
//                 onChange={(e) => handleChange(index, e.target.value)}
//                 onKeyDown={(e) => handleKeyDown(index, e)}
//                 className="w-16 h-16 text-center text-2xl font-bold bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 transition-all"
//               />
//             ))}
//           </div>

//           <p className="text-center text-sm text-gray-400">
//             {timer > 0 ? (
//               <>Resend code in {String(Math.floor(timer / 60)).padStart(2, '0')}:{String(timer % 60).padStart(2, '0')}</>
//             ) : (
//               <button
//                 type="button"
//                 onClick={() => setTimer(60)}
//                 className="text-purple-400 hover:text-purple-300 hover:underline"
//               >
//                 Resend code
//               </button>
//             )}
//           </p>

//           <div className="flex gap-4 pt-4">
//             <button
//               type="submit"
//               disabled={isLoading || otp.join('').length !== 4}
//               className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 shadow-lg"
//             >
//               {isLoading ? 'Verifying...' : 'Verify OTP'}
//             </button>
//             <button
//               type="button"
//               onClick={() => router.back()}
//               className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700"
//             >
//               <ArrowLeft className="w-5 h-5" />
//             </button>
//           </div>
//         </form>

//         <p className="text-xs text-gray-500 mt-6 text-center">
//           © 2023 21Spades. All Rights Reserved.
//         </p>
//       </div>
//     </div>
//   )
// }


'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { ArrowLeft } from 'lucide-react'

export default function OTPVerification() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') || ''
  const { verifyOTP, isLoading } = useAuthStore()
  const [otp, setOtp] = useState(['', '', '', ''])
  const [timer, setTimer] = useState(60)

  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 3) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpString = otp.join('')
    if (otpString.length !== 4) return

    try {
      await verifyOTP({ phone, otp: otpString })
      router.push('/feed')
    } catch (error) {
      console.error('OTP verification error:', error)
      alert('Invalid OTP. Try 1234 or 1537')
    }
  }

  const maskedPhone = phone
    ? phone.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+1 *****$4')
    : '+1 *****244'

  return (
    <div className="min-h-screen  flex items-center justify-center m-4 p-4">
      <div className="w-full max-w-2xl bg-gradient-to-br from-[#4A01D8] to-black border border-gray-800/40 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
        <div >

          <h1 className="text-2xl font-extrabold text-[#ffcc00] mb-2">Enter the OTP code</h1>

          <p className="text-sm text-gray-400 mb-6 font-medium">
            Not register yet?{' '}
            <button
              onClick={() => router.push('/signup')}
              className="text-[#ffcc00] hover:underline font-semibold"
            >
              Create Account
            </button>
          </p>

          <p className="text-gray-300 mb-8 text-sm font-semibold">
            Enter the 4-digit code that we have sent<br />
            via the Phone-No <span className="text-white font-extrabold">{maskedPhone}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-center space-x-5">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el: HTMLInputElement | null) => {
                    inputRefs.current[index] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-2xl font-extrabold bg-transparent border-b-4 border-gray-600 text-white focus:border-[#ffcc00] outline-none transition-all"
                />
              ))}
            </div>

            <div className="text-gray-400 text-sm font-medium">
              {timer > 0 ? (
                <>
                  Resend code in{' '}
                  <span className="text-white font-extrabold">
                    {String(Math.floor(timer / 60)).padStart(2, '0')}:
                    {String(timer % 60).padStart(2, '0')}
                  </span>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setTimer(120)}
                  className="text-[#9b59ff] hover:underline font-semibold"
                >
                  Resend
                </button>
              )}
              <br />
              Didn’t receive the code?{' '}
              <button
                type="button"
                onClick={() => setTimer(120)}
                className="text-[#9b59ff] hover:underline font-semibold"
              >
                Resend
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.join('').length !== 4}
              className="w-full py-3 bg-[#4A01D8] rounded-full text-lg font-extrabold hover:opacity-90 transition disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Send Verification Code'}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="w-full py-3 border border-gray-800 rounded-full text-lg font-extrabold text-gray-300 hover:bg-[#1b0045] transition flex justify-center items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}




