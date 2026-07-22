'use client'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ChapterRenderer } from './ChapterRenderer'
import { BookmarkButton } from './BookmarkButton'
import { WordBookmarkToggle } from './WordBookmarkToggle'
import { WordNarrationToggle } from './WordNarrationToggle'
import { TutorialToggle } from './TutorialToggle'
import { TutorialSheet } from './TutorialSheet'
import { TutorialProvider } from './TutorialContext'
import { ChapterBookmarkLayer } from './ChapterBookmarkLayer'
import { SettingsPanel } from './SettingsPanel'
import { ProgressTracker } from './ProgressTracker'
import { WordBookmarkProvider } from './WordBookmarkContext'
import { WordNarrationProvider } from './WordNarrationContext'
import { NarrationProvider } from './NarrationProvider'
import { useSettings } from './SettingsContext'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import { FONT_STACKS } from '@/lib/settings'
import { extractMdNarration } from '@/lib/narration'
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
  const { fontSize, fontFamily, narrationRate, narrationVoiceURI } = useSettings()

  const prevNum = chapterNum > 1 ? chapterNum - 1 : null
  const nextNum = chapterNum < availableChapters ? chapterNum + 1 : null
  const narrationSegments = extractMdNarration(lines)

  return (
    <WordBookmarkProvider resetKey={chapterNum}>
      <WordNarrationProvider resetKey={chapterNum}>
        <NarrationProvider segments={narrationSegments} lang="en-GB" rate={narrationRate} voiceURI={narrationVoiceURI}>
          <TutorialProvider novelType="md">
            <div className="min-h-screen flex flex-col">
              <ProgressTracker novelId={novelId} chapter={chapterNum} />

              <header className="sticky top-0 z-40 bg-neutral-750 backdrop-blur border-b border-neutral-600">
                <div className="flex items-center justify-between gap-2 px-[calc(1.25rem+8px)] md:px-[calc(2.5rem+16px)] py-2">
                  <motion.div className="min-w-0 flex-1" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                    <Link href={`/${novelId}`} title={novelTitle} className="flex items-center gap-1.5 min-w-0 text-xs text-neutral-100 font-medium hover:text-white transition-colors">
                      <IconArrowLeft size={14} className="shrink-0" />
                      <span className="truncate max-w-[120px]">{novelTitle}</span>
                    </Link>
                  </motion.div>
                  <div className="flex items-center gap-1 shrink-0">
                    <TutorialToggle />
                    <WordNarrationToggle />
                    <BookmarkButton novelId={novelId} chapter={chapterNum} />
                    <WordBookmarkToggle novelId={novelId} chapter={chapterNum} />
                    <SettingsPanel showNarration />
                  </div>
                </div>
              </header>

              <main className="flex-1 px-[calc(1.25rem+8px)] md:px-[calc(2.5rem+16px)] py-8">
                <ChapterBookmarkLayer novelId={novelId} novelTitle={novelTitle} chapterNum={chapterNum}>
                  <ChapterRenderer
                    lines={lines}
                    fontSize={fontSize}
                    fontFamily={FONT_STACKS[fontFamily]}
                    novelId={novelId}
                    novelTitle={novelTitle}
                    chapter={chapterNum}
                    plainTextLang="en-GB"
                  />
                </ChapterBookmarkLayer>
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
            <TutorialSheet novelType="md" />
          </TutorialProvider>
        </NarrationProvider>
      </WordNarrationProvider>
    </WordBookmarkProvider>
  )
}
