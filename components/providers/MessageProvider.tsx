'use client'

import { message } from 'antd'
import type { MessageInstance } from 'antd/es/message/interface'
import { createContext, useContext, type ReactNode } from 'react'

const MessageContext = createContext<MessageInstance>(message)

export function MessageProvider({ children }: { children: ReactNode }) {
  const [api, contextHolder] = message.useMessage()

  return (
    <MessageContext.Provider value={api}>
      {contextHolder}
      {children}
    </MessageContext.Provider>
  )
}

export function useMessageContext() {
  return useContext(MessageContext)
}

