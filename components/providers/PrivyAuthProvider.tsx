'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import { ReactNode } from 'react'

type PrivyAuthProviderProps = {
  children: ReactNode
}

const PRIVY_LOGIN_METHODS: Array<'google' | 'twitter'> = ['google', 'twitter']

export function PrivyAuthProvider({ children }: PrivyAuthProviderProps) {
  const appId = "cmhqh940s0053l10c93z3rr9c"

  if (!appId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Privy configuration missing: NEXT_PUBLIC_PRIVY_APP_ID is not set.')
    }
    return <>{children}</>
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: PRIVY_LOGIN_METHODS,
        appearance: {
          theme: 'dark',
          accentColor: '#FFCC00',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets'
        }
      }}
    >
      {children}
    </PrivyProvider>
  )
}

