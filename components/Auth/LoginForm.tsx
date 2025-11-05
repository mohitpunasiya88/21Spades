import { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { FacebookIcon, GoogleIcon, XIcon } from '@/app/icon/svg';
import { useRouter } from 'next/navigation'

function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');



  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gradient-to-br from-[#4A01D8] to-black border border-gray-800/40 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent tracking-wider">
            WELCOME BACK!
          </h1>
          <p className="text-gray-400">
            Not register yet?{' '}
            <button className="text-white hover:text-yellow-400 transition-colors font-medium">
              Create Account
            </button>
          </p>
        </div>

        <div className="flex items-center gap-2 mb-8 bg-black/40 rounded-full p-1 max-w-md mx-auto border border-gray-800">
          <button
            onClick={() => setLoginMethod('email')}
            className={`flex-1 py-3 rounded-full font-medium transition-all ${loginMethod === 'email'
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            Email ID
          </button>

          {/* Vertical Divider */}
          <div className="w-[1px] h-6 bg-gray-700"></div>

          <button
            onClick={() => setLoginMethod('phone')}
            className={`flex-1 py-3 rounded-full font-medium transition-all ${loginMethod === 'phone'
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            Phone number
          </button>
        </div>


        <div className="space-y-6 mb-6">
          <div>
            <label className="block text-white text-lg mb-3 font-medium">Username</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white">
                <User size={20} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="2L_spades"
                className="w-full bg-black/40 border border-gray-700 rounded-xl py-4 px-12 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-lg mb-3 font-medium">Password</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="*****"
                className="w-full bg-black/40 border border-gray-700 rounded-xl py-4 px-12 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-colors"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8 text-sm">
          <label className="flex items-center gap-2 cursor-pointer text-white">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-black/40 accent-yellow-500"
            />
            Remember me
          </label>
          <button className="text-white hover:text-yellow-400 transition-colors">
            Forgot Password
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <button className="w-full bg-black/40 border border-gray-700 rounded-full py-4 text-white font-medium hover:border-gray-500 transition-all flex items-center justify-center gap-3">
            <XIcon />
            Continue with X
          </button>

          <button className="w-full bg-black/40 border border-gray-700 rounded-full py-4 text-white font-medium hover:border-gray-500 transition-all flex items-center justify-center gap-3">
            <FacebookIcon />
            Continue with Facebook
          </button>

          <button className="w-full bg-black/40 border border-gray-700 rounded-full py-4 text-white font-medium hover:border-gray-500 transition-all flex items-center justify-center gap-3">
            <GoogleIcon />
            Continue with Google
          </button>
        </div>

        <button
          className="w-full bg-[#4A01D8] text-white font-bold py-4 rounded-full mb-4 shadow-lg hover:shadow-xl transition-all text-lg"
        >
          Log In
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full border-2 border-gray-700 text-white font-bold py-4 rounded-full hover:border-gray-600 hover:bg-white/5 transition-all text-lg"
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default LoginForm;
