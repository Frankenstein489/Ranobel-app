'use client'

import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'

// Vercel Analytics is only meaningful when this app is actually deployed to
// Vercel and viewed as a website. Inside the Capacitor Android/iOS shell
// there's no Vercel edge network to report to, so we skip mounting it there.
export function WebOnlyAnalytics() {
  const [isNative, setIsNative] = useState<boolean | null>(null)

  useEffect(() => {
    import('@capacitor/core')
      .then(({ Capacitor }) => setIsNative(Capacitor.isNativePlatform()))
      .catch(() => setIsNative(false))
  }, [])

  if (isNative !== false) return null
  return <Analytics />
}
