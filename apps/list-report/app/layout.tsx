import { Geist, Geist_Mono } from 'next/font/google'

import '@workspace/ui/globals.css'
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
          `overflow-visible w-full h-full ${fontSans.variable} ${fontMono.variable} font-sans antialiased `,
          {
            'h-[600px]': !environments.isProduction,
          }
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
