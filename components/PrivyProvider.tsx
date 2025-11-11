'use client'

import { PrivyProvider as PrivyProviderBase } from '@privy-io/react-auth'

export default function PrivyProvider({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "cmhqh940s0053l10c93z3rr9c"
  
  return (
    <PrivyProviderBase
      appId={appId}
      config={{
        loginMethods: ['google'],
        appearance: {
          theme: 'dark',
          accentColor: '#8B5CF6',
        },
      }}
    >
      {children}
    </PrivyProviderBase>
  )
}

