'use client'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { IconX } from '@tabler/icons-react'
import { DEVICE_VOICE_CAVEAT } from '@/lib/tutorialContent'

type Props = {
  onDismiss: () => void
}

export function VoiceCaveatToast({ onDismiss }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, 6000)
    return () => window.clearTimeout(timer)
  }, [onDismiss])

  if (!mounted) return null

  return createPortal(
    <div className="fixed top-14 inset-x-0 z-[250] flex justify-center px-4">
      <div className="flex items-start gap-2 max-w-md w-full rounded-xl border border-neutral-600 bg-neutral-800 p-3 shadow-lg">
        <p className="text-xs text-neutral-300 leading-relaxed flex-1">{DEVICE_VOICE_CAVEAT}</p>
        <button onClick={onDismiss} aria-label="Dismiss" className="p-1 rounded-md hover:bg-neutral-600 shrink-0">
          <IconX size={14} className="text-neutral-400" />
        </button>
      </div>
    </div>,
    document.body,
  )
}
