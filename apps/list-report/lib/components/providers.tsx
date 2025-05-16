'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { Suspense } from 'react'

import { ListReportApiProvider } from '@/lib/api/_common'

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
        <ListReportApiProvider>{children}</ListReportApiProvider>
      </NextThemesProvider>
    </Suspense>
  )
}
