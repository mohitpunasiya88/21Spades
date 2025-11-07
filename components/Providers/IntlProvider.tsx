'use client'

import { NextIntlClientProvider } from 'next-intl'
import { useLocaleStore } from '@/lib/store/localeStore'
import { useEffect, useState } from 'react'

// Import default English messages synchronously for initial render
import enMessages from '@/messages/en.json'

export default function IntlProvider({ children }: { children: React.ReactNode }) {
  const { locale } = useLocaleStore()
  const [messages, setMessages] = useState<Record<string, any>>(enMessages)
  const [isMounted, setIsMounted] = useState(false)

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Load messages when locale changes (only after mount)
  useEffect(() => {
    if (!isMounted) return

    const loadMessages = async () => {
      try {
        // Dynamically import the locale-specific messages
        const localeMessages = await import(`@/messages/${locale}.json`)
        setMessages(localeMessages.default)
      } catch (error) {
        console.error(`Failed to load messages for locale: ${locale}`, error)
        // Fallback to English if locale-specific messages fail
        setMessages(enMessages)
      }
    }

    // Load messages based on locale
    if (locale === 'en') {
      setMessages(enMessages)
    } else {
      loadMessages()
    }
  }, [locale, isMounted])

  // Always provide the context, even during initial load
  // Key prop forces re-render when locale changes
  return (
    <NextIntlClientProvider key={locale} locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}

