'use client'

import { ConfigProvider } from 'antd'
import { ReactNode } from 'react'

export default function AntdConfigProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4F01E6',
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

