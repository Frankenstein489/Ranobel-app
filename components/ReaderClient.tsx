'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ChapterRenderer } from './ChapterRenderer'
import { BookmarkButton } from './BookmarkButton'
import { ProgressTracker } from './ProgressTracker'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import type { ParsedLine } from '@/lib/parseChapter'

type Props = {
  novelId: string
  novelTitle: string
  chapterNum: number
  totalChapters: number
  availableChapters: number
  lines: ParsedLine[]
  isDemo?: boolean
}

export function ReaderClient({ novelId, novelTitle, chapterNum, availableChapters, lines }: Props) {
  const [fontSize, setFontSize] = useState(15)
  useEffect(() => { setFontSize(window.innerWidth < 768 ? 13 : 15) }, [])

  const prevNum = chapterNum > 1 ? chapterNum - 1 : null
  const nextNum = chapterNum < availableChapters ? chapterNum + 1 : null

  return (
    <div className="min-h-screen flex flex-col">
      <ProgressTracker novelId={novelId} chapter={chapterNum} />

      <header className="sticky top-0 z-40 bg-neutral-750 backdrop-blur border-b border-neutral-600">
        <div className="flex items-center justify-between px-[calc(1.25rem+8px)] md:px-[calc(2.5rem+16px)] py-2">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
            <Link href={`/${novelId}`} className="flex items-center gap-1.5 text-xs text-neutral-100 font-medium hover:text-white transition-colors">
              <IconArrowLeft size={14} />
              <span className="truncate max-w-[160px]">{novelTitle}</span>
            </Link>
          </motion.div>
          <BookmarkButton novelId={novelId} chapter={chapterNum} />
        </div>
      </header>

      <main className="flex-1 px-[calc(1.25rem+8px)] md:px-[calc(2.5rem+16px)] py-8">
        <ChapterRenderer lines={lines} fontSize={fontSize} />
      </main>

      <nav className="sticky bottom-0 z-40 bg-neutral-750 backdrop-blur border-t border-neutral-600">
        <div className="flex items-center justify-between px-[calc(1.25rem+8px)] md:px-[calc(2.5rem+16px)] py-3">
          {prevNum ? (
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
              <Link href={`/${novelId}/${prevNum}`} className="flex items-center gap-1.5 text-xs text-neutral-100 font-medium hover:text-white transition-colors">
                <IconArrowLeft size={13} /> Prev
              </Link>
            </motion.div>
          ) : <span />}
          <span className="text-[11px] text-neutral-400 tabular-nums">Ch. {chapterNum}</span>
          {nextNum ? (
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
              <Link href={`/${novelId}/${nextNum}`} className="flex items-center gap-1.5 text-xs text-neutral-100 font-medium hover:text-white transition-colors">
                Next <IconArrowRight size={13} />
              </Link>
            </motion.div>
          ) : <span />}
        </div>
      </nav>
    </div>
  )
}