'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getLastChapter } from '@/lib/storage'
import type { ChapterMeta } from '@/lib/getChapters'

export function NovelPageClient({ novelId, chapters }: { novelId: string; chapters: ChapterMeta[] }) {
  const [lastChapter, setLastChapter] = useState<number | null>(null)
  useEffect(() => { setLastChapter(getLastChapter(novelId)) }, [novelId])
  if (!chapters.length) return null
  const first = chapters[0].id
  const isStarted = lastChapter !== null && lastChapter > 1
  return (
    <div className="flex gap-2 mb-6">
      {isStarted ? (
        <>
          <Link href={`/${novelId}/${lastChapter}`} className="flex-1 py-2 text-center text-xs font-bold bg-neutral-100 text-neutral-900 rounded-full hover:opacity-90 transition-opacity">
            Continue Ch. {lastChapter}
          </Link>
          <Link href={`/${novelId}/${first}`} className="px-4 py-2 text-center text-xs border border-neutral-600 text-neutral-300 rounded-full hover:bg-neutral-600 transition-colors">
            From start
          </Link>
        </>
      ) : (
        <Link href={`/${novelId}/${first}`} className="flex-1 py-2 text-center text-xs font-bold bg-neutral-100 text-neutral-900 rounded-full hover:opacity-90 transition-opacity">
          Start reading
        </Link>
      )}
    </div>
  )
}
