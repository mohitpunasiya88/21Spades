'use client'

import { Modal, message as antdMessage } from 'antd'
import { useRouter } from 'next/navigation'
import { FaLink } from "react-icons/fa6";
import { useState } from 'react'

interface LoginRequiredModalProps {
  open: boolean
  onClose: () => void
  title?: string
  message?: string
}

export default function SharefeedModal({
  open,
  onClose,
  title = 'Share this Feed',
  message = 'You need to be logged in to perform this action. Please login to continue.',
}: LoginRequiredModalProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  const handleLogin = () => {
    onClose()
    router.push('/login')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      antdMessage.success('Link copied to clipboard')
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      antdMessage.error('Failed to copy link')
    }
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
      <div className="flex flex-col items-center gap-5 py-4">
        <div className="text-center">
          <h3 className="text-white text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-exo2)' }}>
            {title}
          </h3>
          <div className="mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-full border border-[rgba(255,215,0,0.6)] bg-transparent">
            <FaLink className="w-7 h-7 text-white" onClick={handleCopy} />
          </div>
          <button
            onClick={handleCopy}
            disabled={copied}
            className={`px-5 py-2 rounded-full border border-[rgba(255,215,0,0.6)] text-white transition-colors ${copied ? 'opacity-70 cursor-default' : 'hover:bg-white/5'}`}
            style={{ fontFamily: 'var(--font-exo2)' }}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

