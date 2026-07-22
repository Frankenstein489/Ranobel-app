'use client'
import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import {
  getReaderSettings,
  setReaderSettings,
  resolveIsLight,
  FONT_STACKS,
  type ReaderSettings,
  type ReaderTheme,
  type ReaderFontFamily,
} from '@/lib/settings'

type SettingsContextValue = ReaderSettings & {
  setTheme: (theme: ReaderTheme) => void
  setFontSize: (size: number) => void
  setFontFamily: (family: ReaderFontFamily) => void
  setBrightness: (value: number) => void
  setNarrationRate: (rate: number) => void
  setNarrationVoiceURI: (voiceURI: string | null) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

function applyToDocument(settings: ReaderSettings) {
  const root = document.documentElement
  root.classList.toggle('light', resolveIsLight(settings.theme))
  root.style.setProperty('--reading-font-size', `${settings.fontSize}px`)
  root.style.setProperty('--reading-font-family', FONT_STACKS[settings.fontFamily])
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ReaderSettings>(getReaderSettings)

  useEffect(() => {
    setSettings(getReaderSettings())
  }, [])

  useEffect(() => {
    applyToDocument(settings)
  }, [settings])

  useEffect(() => {
    if (settings.theme !== 'system') return
    const mql = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = () => applyToDocument(settings)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [settings])

  const update = useCallback((patch: Partial<ReaderSettings>) => {
    setSettings(setReaderSettings(patch))
  }, [])

  const setTheme = useCallback((theme: ReaderTheme) => update({ theme }), [update])
  const setFontSize = useCallback((fontSize: number) => update({ fontSize }), [update])
  const setFontFamily = useCallback((fontFamily: ReaderFontFamily) => update({ fontFamily }), [update])
  const setBrightness = useCallback((brightness: number) => update({ brightness }), [update])
  const setNarrationRate = useCallback((narrationRate: number) => update({ narrationRate }), [update])
  const setNarrationVoiceURI = useCallback((narrationVoiceURI: string | null) => update({ narrationVoiceURI }), [update])

  const value = useMemo<SettingsContextValue>(() => ({
    ...settings,
    setTheme,
    setFontSize,
    setFontFamily,
    setBrightness,
    setNarrationRate,
    setNarrationVoiceURI,
  }), [settings, setTheme, setFontSize, setFontFamily, setBrightness, setNarrationRate, setNarrationVoiceURI])

  const dimOpacity = ((100 - settings.brightness) / 100) * 0.55

  return (
    <SettingsContext.Provider value={value}>
      {children}
      <div
        aria-hidden
        className="fixed inset-0 z-[90] pointer-events-none bg-black transition-opacity duration-150"
        style={{ opacity: dimOpacity }}
      />
    </SettingsContext.Provider>
  )
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider')
  return ctx
}
