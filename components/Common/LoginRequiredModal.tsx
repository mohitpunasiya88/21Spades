'use client'

import { Modal } from 'antd'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'

interface LoginRequiredModalProps {
  open: boolean
  onClose: () => void
  title?: string
  message?: string
}

export default function LoginRequiredModal({
  open,
  onClose,
  title = 'Login Required',
  message = 'You need to be logged in to perform this action. Please login to continue.',
}: LoginRequiredModalProps) {
  const router = useRouter()

  const handleLogin = () => {
    onClose()
    router.push('/login')
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      className="login-required-modal"
      styles={{
        content: {
          background: '#1a1a2e',
          borderRadius: '16px',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        },
        header: {
          background: 'transparent',
          borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
        },
      }}
    >
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        
        <div className="text-center">
          <h3 className="text-white text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-exo2)' }}>
            {title}
          </h3>
          <p className="text-gray-400 text-sm" style={{ fontFamily: 'var(--font-exo2)' }}>
            {message}
          </p>
        </div>

        <div className="flex gap-3 w-full mt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-600 text-white hover:bg-gray-700/50 transition-colors"
            style={{ fontFamily: 'var(--font-exo2)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleLogin}
            className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transition-all font-semibold"
            style={{ fontFamily: 'var(--font-exo2)' }}
          >
            Go to Login
          </button>
        </div>
      </div>
    </Modal>
  )
}

