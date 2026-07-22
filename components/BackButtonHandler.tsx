'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Handles Android's hardware back button AND the edge-swipe back gesture.
// Without this, Capacitor's default behavior is to close the whole app
// the moment there's no more browser history to go back through on the
// current page load (which happens easily since chapters are separate
// static pages). Instead: navigate back within the app's history first,
// and only minimize (not kill) the app once there's truly nowhere left
// to go.
export function BackButtonHandler() {
  const router = useRouter()

  useEffect(() => {
    let removeListener: (() => void) | undefined

    // Dynamically import so this has zero effect / bundle cost on the
    // web deployment, only runs inside the native Capacitor app.
    import('@capacitor/core').then(({ Capacitor }) => {
      if (!Capacitor.isNativePlatform()) return

      import('@capacitor/app').then(({ App }) => {
        const listenerPromise = App.addListener('backButton', () => {
          if (window.history.length > 1) {
            router.back()
          } else {
            // Nothing left to go back to - minimize the app instead of
            // killing it, matching normal Android app behavior.
            App.minimizeApp()
          }
        })

        removeListener = () => {
          listenerPromise.then((l) => l.remove())
        }
      })
    })

    return () => {
      removeListener?.()
    }
  }, [router])

  return null
}
