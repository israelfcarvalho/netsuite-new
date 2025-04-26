'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { Suspense } from 'react'

import { ApiProvider } from '@workspace/core/api'

import { environments } from '@/lib/environments'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <ApiProvider baseUrl={environments.api.baseUrl}>{children}</ApiProvider>
      </NextThemesProvider>
    </Suspense>
  )
}
