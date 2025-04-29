import { Geist, Geist_Mono } from 'next/font/google'

import '@workspace/ui/globals.css'
import { Toaster } from '@workspace/ui/components/toast'
import { cn } from '@workspace/ui/lib/utils'

import { Providers } from '@/lib/components/providers'
import { environments } from '@/lib/environments'

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      className={cn({ 'w-dvw h-dvh p-4 flex items-center justify-center': !environments.isProduction })}
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={cn(
          `overflow-visible w-full h-[700px] ${fontSans.variable} ${fontMono.variable} font-sans antialiased `
        )}
      >
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
