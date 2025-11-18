'use client'

import { useMemo } from 'react'
import { useMessageContext } from '@/components/providers/MessageProvider'

export function useMessage() {
  const message = useMessageContext()

  return useMemo(
    () => ({
      message,
      success: message.success,
      error: message.error,
      info: message.info,
      warning: message.warning,
      loading: message.loading,
    }),
    [message],
  )
}

