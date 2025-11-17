'use client'

import { App } from 'antd'
import { useCallback } from 'react'

/**
 * Custom hook to use Ant Design message API with App context
 * This fixes the issue: "Static function can not consume context like dynamic theme"
 */
export function useMessage() {
  const { message } = App.useApp()

  const showSuccess = useCallback((content: string, duration?: number) => {
    message.success(content, duration)
  }, [message])

  const showError = useCallback((content: string, duration?: number) => {
    message.error(content, duration)
  }, [message])

  const showInfo = useCallback((content: string, duration?: number) => {
    message.info(content, duration)
  }, [message])

  const showWarning = useCallback((content: string, duration?: number) => {
    message.warning(content, duration)
  }, [message])

  const showLoading = useCallback((content: string, duration?: number) => {
    return message.loading(content, duration || 0)
  }, [message])

  return {
    message,
    success: showSuccess,
    error: showError,
    info: showInfo,
    warning: showWarning,
    loading: showLoading,
  }
}

