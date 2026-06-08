import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Scales } from '@/components/Scales'
import { Analytics } from "@vercel/analytics/next"

const mono = JetBrains_Mono({ subsets: ['latin', 'latin-ext'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  title: 'Ranobel',
  description: 'Read light novels. Learn Korean.',
  icons: {
    icon: '/davicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${mono.variable} dark`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="bg-neutral-900 font-mono antialiased">
        <div className="max-w-3xl md:max-w-[80%] mx-auto min-h-screen relative bg-neutral-800">
          <Scales />
          <Analytics />
          {children}
        </div>
      </body>
    </html>
  )
}
