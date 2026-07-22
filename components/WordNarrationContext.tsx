'use client'
import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import type { NarrationLang } from '@/lib/tts'
import { useSettings } from './SettingsContext'

type WordNarrationContextValue = {
  active: boolean
  toggle: () => void
  deactivate: () => void
  speakWord: (text: string, lang: NarrationLang) => void
}

const WordNarrationContext = createContext<WordNarrationContextValue | null>(null)

type ProviderProps = {
  children: React.ReactNode
  resetKey?: string | number
}

export function WordNarrationProvider({ children, resetKey }: ProviderProps) {
  const [active, setActive] = useState(false)
  const mounted = useRef(false)
  const { narrationRate, narrationVoiceURI } = useSettings()

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    setActive(false)
  }, [resetKey])

  const toggle = useCallback(() => setActive((a) => !a), [])
  const deactivate = useCallback(() => setActive(false), [])

  const speakWord = useCallback((text: string, lang: NarrationLang) => {
    import('@/lib/tts').then(({ speak }) => speak(text, lang, narrationRate, narrationVoiceURI ?? undefined))
  }, [narrationRate, narrationVoiceURI])

  return (
    <WordNarrationContext.Provider value={{ active, toggle, deactivate, speakWord }}>
      {children}
    </WordNarrationContext.Provider>
  )
}

export function useWordNarration(): WordNarrationContextValue {
  const ctx = useContext(WordNarrationContext)
  if (!ctx) throw new Error('useWordNarration must be used within a WordNarrationProvider')
  return ctx
}
