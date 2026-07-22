'use client'
import { useEffect, useCallback, useRef } from 'react'
import { useWordBookmark } from './WordBookmarkContext'
import { useWordNarration } from './WordNarrationContext'
import type { NarrationLang } from '@/lib/tts'

// Wraps rendered chapter content to (1) delegate clicks on any
// [data-word-index] element to the bookmark context while select mode is
// active, (2) delegate the same clicks to word narration while that mode is
// active instead, and (3) scroll to the bookmarked word if it lives in this
// chapter and the URL says to (#bookmark).
//
// The bookmark highlight itself is NOT applied here — each renderer (plain
// text spans in ChapterRenderer, KoreanWord) applies `word-bookmarked`
// itself, driven directly by the bookmark context via React state. An
// earlier version tried to apply it imperatively here via a DOM query +
// classList, which never removed the *previous* highlight and didn't
// survive re-renders — always keep highlighting state-driven per element
// instead of reaching into the DOM for it.
export function ChapterBookmarkLayer({
  novelId, novelTitle, chapterNum, children,
}: {
  novelId: string
  novelTitle: string
  chapterNum: number
  children: React.ReactNode
}) {
  const { active, selectWord, bookmark } = useWordBookmark()
  const { active: narrateActive, speakWord } = useWordNarration()
  const containerRef = useRef<HTMLDivElement>(null)

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!active && !narrateActive) return
    const target = (e.target as HTMLElement).closest('[data-word-index]') as HTMLElement | null
    if (!target) return

    if (narrateActive) {
      const narrateText = target.dataset.wordText ?? ''
      const lang = (target.dataset.wordLang as NarrationLang) ?? 'en-GB'
      speakWord(narrateText, lang)
      return
    }

    const wordIndex = Number(target.dataset.wordIndex)
    const wordText = target.dataset.wordText ?? ''
    if (Number.isNaN(wordIndex)) return
    selectWord({ wordIndex, wordText, novelId, novelTitle, chapter: chapterNum })
  }, [active, narrateActive, selectWord, speakWord, novelId, novelTitle, chapterNum])

  useEffect(() => {
    if (!bookmark || bookmark.novelId !== novelId || bookmark.chapter !== chapterNum) return
    if (window.location.hash !== '#bookmark') return
    const el = containerRef.current?.querySelector(`[data-word-index="${bookmark.wordIndex}"]`)
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [bookmark, novelId, chapterNum])

  return (
    <div ref={containerRef} onClick={handleClick} className={active || narrateActive ? 'word-select-mode' : undefined}>
      {children}
    </div>
  )
}
