'use client'
import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react'
import { speak, stopSpeaking, type NarrationLang } from '@/lib/tts'

type NarrationContextValue = {
  available: boolean
  playing: boolean
  paused: boolean
  play: () => void
  pause: () => void
  resume: () => void
  stop: () => void
}

const NarrationContext = createContext<NarrationContextValue | null>(null)

type ProviderProps = {
  children: React.ReactNode
  segments: string[] | null
  lang: NarrationLang
  rate: number
  voiceURI: string | null
}

export function NarrationProvider({ children, segments, lang, rate, voiceURI }: ProviderProps) {
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const stopRef = useRef(false)
  const pauseRef = useRef(false)

  const available = !!segments && segments.length > 0

  const runFrom = useCallback(async (startIndex: number) => {
    if (!segments) return
    stopRef.current = false
    setPlaying(true)
    setPaused(false)
    for (let i = startIndex; i < segments.length; i++) {
      if (stopRef.current) break
      while (pauseRef.current && !stopRef.current) {
        await new Promise((resolve) => setTimeout(resolve, 150))
      }
      if (stopRef.current) break
      await speak(segments[i], lang, rate, voiceURI ?? undefined)
    }
    if (!stopRef.current) {
      setPlaying(false)
      setPaused(false)
    }
  }, [segments, lang, rate, voiceURI])

  const play = useCallback(() => {
    runFrom(0)
  }, [runFrom])

  const pause = useCallback(() => {
    pauseRef.current = true
    setPaused(true)
    stopSpeaking()
  }, [])

  const resume = useCallback(() => {
    pauseRef.current = false
    setPaused(false)
  }, [])

  const stop = useCallback(() => {
    stopRef.current = true
    pauseRef.current = false
    setPlaying(false)
    setPaused(false)
    stopSpeaking()
  }, [])

  useEffect(() => () => stop(), [stop])

  return (
    <NarrationContext.Provider value={{ available, playing, paused, play, pause, resume, stop }}>
      {children}
    </NarrationContext.Provider>
  )
}

export function useNarrationPlayer(): NarrationContextValue | null {
  return useContext(NarrationContext)
}
