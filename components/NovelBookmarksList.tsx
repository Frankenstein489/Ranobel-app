'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getBookmarks } from '@/lib/storage'
import { IconBookmarkFilled } from '@tabler/icons-react'
import type { ChapterMeta } from '@/lib/getChapters'

// List of this novel's bookmarked chapters, shown on its own page.
export function NovelBookmarksList({ novelId, chapters }: { novelId: string; chapters: ChapterMeta[] }) {
  const pathname = usePathname()
  const [bookmarks, setBookmarks] = useState<number[]>([])

  useEffect(() => {
    setBookmarks(getBookmarks(novelId))
  }, [novelId, pathname])

  if (!bookmarks.length) return null

  const sorted = [...bookmarks].sort((a, b) => a - b)

  return (
    <div className="mb-6">
      <div className="text-[10px] uppercase tracking-[0.12em] text-neutral-400 mb-2 px-1">Bookmarked Chapters</div>
      <div className="flex flex-col divide-y divide-neutral-600 border border-neutral-600 rounded-xl overflow-hidden">
        {sorted.map((chapterNum) => {
          const meta = chapters.find((c) => c.id === chapterNum)
          return (
            <Link
              key={chapterNum}
              href={`/${novelId}/${chapterNum}`}
              className="flex items-center gap-3 py-3 px-4 hover:bg-neutral-600 transition-colors group"
            >
              <IconBookmarkFilled size={14} className="text-amber-400 flex-shrink-0" />
              <span className="text-[10px] text-neutral-400 w-6 text-right flex-shrink-0 tabular-nums">{chapterNum}</span>
              <span className="flex-1 text-xs text-neutral-200 group-hover:text-neutral-100 transition-colors truncate">
                {meta?.title ?? `Chapter ${chapterNum}`}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
