'use client'

import { ConfigProvider, App } from 'antd'
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
      <App>
        {children}
      </App>
    </ConfigProvider>
  )
}

