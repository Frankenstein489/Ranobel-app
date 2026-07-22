'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useWordBookmark } from './WordBookmarkContext'
import type { AnnotatedWord, WordType } from '@/lib/parseChapter'

const TYPE_STYLES: Record<WordType, { color: string; label: string }> = {
  verb:     { color: '#fcd34d', label: 'Verb (동사)' },
  conj:     { color: '#c084fc', label: 'Conjunction (접속사)' },
  adv:      { color: '#c084fc', label: 'Adverb (부사)' },
  adj:      { color: '#c084fc', label: 'Adjective (형용사)' },
  noun:     { color: '#60a5fa', label: 'Noun (명사)' },
  pron:     { color: '#4ade80', label: 'Pronoun (대명사)' },
  particle: { color: '#f472b6', label: 'Particle (조사)' },
}

type Props = {
  data: AnnotatedWord
  novelId: string
  novelTitle: string
  chapter: number
  wordIndex: number
}

export function KoreanWord({ data, novelId, novelTitle, chapter, wordIndex }: Props) {
  const { bookmark } = useWordBookmark()
  const isBookmarked = !!bookmark
    && bookmark.novelId === novelId
    && bookmark.chapter === chapter
    && bookmark.wordIndex === wordIndex
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [isTouch, setIsTouch] = useState(false)
  const [mounted, setMounted] = useState(false)
  const spanRef = useRef<HTMLSpanElement>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setMounted(true)
    setIsTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  useEffect(() => {
    if (!isTouch || !visible) return
    const dismiss = () => setVisible(false)
    document.addEventListener('touchstart', dismiss, { passive: true })
    return () => document.removeEventListener('touchstart', dismiss)
  }, [isTouch, visible])

  const style = TYPE_STYLES[data.type] ?? TYPE_STYLES.adv

  const computePos = useCallback(() => {
    if (!spanRef.current) return
    const rect = spanRef.current.getBoundingClientRect()
    const tw = 260, th = 170, pad = 8
    const vw = window.innerWidth, vh = window.innerHeight
    let x = rect.left
    if (x + tw > vw - pad) x = vw - tw - pad
    if (x < pad) x = pad
    const y = (vh - rect.bottom - pad) >= th ? rect.bottom + 4 : rect.top - th - 4
    setPos({ x, y })
  }, [])

  const show = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    computePos()
    setVisible(true)
  }, [computePos])

  const hide = useCallback((delay = 150) => {
    hideTimer.current = setTimeout(() => setVisible(false), delay)
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation()
    if (visible) setVisible(false)
    else show()
  }, [visible, show])

  const touchHandlers = isTouch
    ? { onTouchStart: handleTouchStart }
    : { onMouseEnter: show, onMouseLeave: () => hide(150) }

  const popup = mounted && visible ? createPortal(
    <div
      className="fixed z-[200] w-[260px] rounded-xl border border-neutral-600 bg-neutral-800 p-3 pointer-events-none"
      style={{ left: pos.x, top: pos.y, boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
    >
      {/* Korean word large */}
      <p className="text-lg font-bold text-neutral-100 mb-0.5 leading-tight">{data.word}</p>
      {/* Romanization */}
      <p className="text-[11px] text-neutral-400 mb-1">{data.romanization}</p>
      {/* Type badge */}
      <p className="text-[10px] uppercase tracking-widest mb-1.5" style={{ color: style.color }}>{style.label}</p>
      {/* Translation */}
      <p className="text-xs text-neutral-300 mb-2">{data.translation}</p>
      {/* Example */}
      {data.example && (
        <p className="text-[11px] text-neutral-400 italic border-l-2 border-neutral-600 pl-2 leading-relaxed">
          {data.example.replace(/\s*—\s*/g, ' — ')}
        </p>
      )}
    </div>,
    document.body
  ) : null

  return (
    <>
      <span
        ref={spanRef}
        data-word-index={wordIndex}
        data-word-text={data.word}
        data-word-lang="ko-KR"
        className={`font-semibold cursor-pointer hover:opacity-70 transition-opacity ${isBookmarked ? 'word-bookmarked' : ''}`}
        style={{ color: style.color }}
        {...touchHandlers}
      >
        {data.romanization}
      </span>
      {popup}
    </>
  )
}
