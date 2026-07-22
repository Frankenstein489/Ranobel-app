'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getBookmarks } from '@/lib/storage'
import { IconBookmarkFilled } from '@tabler/icons-react'
import type { Novel } from '@/novels.config'

type BookmarkEntry = { novel: Novel; chapter: number }

// Home page section listing every chapter-bookmarked across all novels.
// Distinct from ContinueToBookmark, which surfaces the single word-level
// bookmark rather than the full list of chapter-level bookmarks.
export function BookmarksSection({ novels }: { novels: Novel[] }) {
  const pathname = usePathname()
  const [entries, setEntries] = useState<BookmarkEntry[]>([])

  useEffect(() => {
    const all: BookmarkEntry[] = []
    novels.forEach((novel) => {
      getBookmarks(novel.id).forEach((chapter) => all.push({ novel, chapter }))
    })
    all.sort((a, b) => a.novel.title.localeCompare(b.novel.title) || a.chapter - b.chapter)
    setEntries(all)
  }, [novels, pathname])

  if (!entries.length) return null

  return (
    <section className="mb-8">
      <div className="text-[10px] uppercase tracking-[0.12em] text-neutral-400 mb-2 px-1">Bookmarks</div>
      <div className="flex flex-col gap-2">
        {entries.map(({ novel, chapter }) => (
          <Link
            key={`${novel.id}-${chapter}`}
            href={`/${novel.id}/${chapter}`}
            className="flex items-center gap-3 p-3 border border-neutral-600 rounded-xl hover:bg-neutral-600 transition-colors group"
          >
            <div className="w-8 h-10 bg-amber-400/15 rounded flex items-center justify-center flex-shrink-0 text-amber-400">
              <IconBookmarkFilled size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-neutral-100 truncate">{novel.title}</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">Chapter {chapter}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
