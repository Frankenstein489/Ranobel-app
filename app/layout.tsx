import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Scales } from '@/components/Scales'
import { SettingsProvider } from '@/components/SettingsContext'
import { WebOnlyAnalytics } from '@/components/WebOnlyAnalytics'
import { BackButtonHandler } from '@/components/BackButtonHandler'

const mono = JetBrains_Mono({ subsets: ['latin', 'latin-ext'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  title: 'Ranobel',
  description: 'Read light novels. Learn Korean.',
  icons: {
    icon: '/davicon.ico',
  },
}

// Applies the saved theme/font settings before first paint, so there's no
// flash of default styling on load (native app or web).
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var raw = localStorage.getItem('geurimja-ilgi:settings');
    var s = raw ? JSON.parse(raw) : {};
    var theme = s.theme || 'dark';
    var isLight = theme === 'light' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches);
    if (isLight) document.documentElement.classList.add('light');
    var fontSize = typeof s.fontSize === 'number' ? s.fontSize : 15;
    document.documentElement.style.setProperty('--reading-font-size', fontSize + 'px');
    var stacks = {
      mono: 'var(--font-mono), ui-monospace, monospace',
      sans: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
      serif: "Georgia, Cambria, 'Times New Roman', Times, serif"
    };
    document.documentElement.style.setProperty('--reading-font-family', stacks[s.fontFamily] || stacks.mono);
  } catch (e) {}
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${mono.variable} dark`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="bg-neutral-900 font-mono antialiased">
        <SettingsProvider>
          <div className="max-w-3xl md:max-w-[80%] mx-auto min-h-screen relative bg-neutral-800">
            <Scales />
            <BackButtonHandler />
            <WebOnlyAnalytics />
            {children}
          </div>
        </SettingsProvider>
      </body>
    </html>
  )
}
