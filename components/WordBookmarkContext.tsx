'use client'
import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { getWordBookmark, setWordBookmark, clearWordBookmark, type WordBookmark } from '@/lib/storage'

type SelectParams = {
  wordIndex: number
  wordText: string
  novelId: string
  novelTitle: string
  chapter: number
}

type WordBookmarkContextValue = {
  // Whether "pick a word" mode is armed (pencil cursor / pencil icon).
  active: boolean
  toggle: () => void
  deactivate: () => void
  // The single, app-wide bookmarked word, or null if none set yet.
  bookmark: WordBookmark | null
  // Called by the click-delegation layer when a word is tapped while active.
  // Tapping the already-bookmarked word again clears it instead of re-saving it.
  selectWord: (params: SelectParams) => void
}

const WordBookmarkContext = createContext<WordBookmarkContextValue | null>(null)

type ProviderProps = {
  children: React.ReactNode
  // Pass something that changes on navigation (e.g. chapter number), so
  // select mode doesn't stay armed after clicking Next/Prev.
  resetKey?: string | number
}

export function WordBookmarkProvider({ children, resetKey }: ProviderProps) {
  // Select mode intentionally does NOT persist across refresh — it always
  // starts off. Only the underlying bookmarked word persists.
  const [active, setActive] = useState(false)
  const [bookmark, setBookmark] = useState<WordBookmark | null>(() => getWordBookmark())
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    setActive(false)
  }, [resetKey])

  const toggle = useCallback(() => setActive((a) => !a), [])
  const deactivate = useCallback(() => setActive(false), [])

  const selectWord = useCallback((params: SelectParams) => {
    setBookmark((prev) => {
      const isSameWord =
        !!prev &&
        prev.novelId === params.novelId &&
        prev.chapter === params.chapter &&
        prev.wordIndex === params.wordIndex
      if (isSameWord) {
        clearWordBookmark()
        return null
      }
      const next: WordBookmark = { ...params, savedAt: Date.now() }
      setWordBookmark(next)
      return next
    })
    setActive(false)
  }, [])

  return (
    <WordBookmarkContext.Provider value={{ active, toggle, deactivate, bookmark, selectWord }}>
      {children}
    </WordBookmarkContext.Provider>
  )
}

export function useWordBookmark(): WordBookmarkContextValue {
  const ctx = useContext(WordBookmarkContext)
  if (!ctx) throw new Error('useWordBookmark must be used within a WordBookmarkProvider')
  return ctx
}
