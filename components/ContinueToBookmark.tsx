'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getWordBookmark, type WordBookmark } from '@/lib/storage'
import { IconBookmarkFilled } from '@tabler/icons-react'

export function ContinueToBookmark() {
  const pathname = usePathname()
  const [bookmark, setBookmark] = useState<WordBookmark | null>(null)

  useEffect(() => {
    setBookmark(getWordBookmark())
  }, [pathname])

  if (!bookmark) return null

  return (
    <section className="mb-8">
      <div className="text-[0.625rem] uppercase tracking-[0.12em] text-neutral-400 mb-2 px-1">Your Bookmark</div>
      <Link
        href={`/${bookmark.novelId}/${bookmark.chapter}#bookmark`}
        className="flex items-center gap-3 p-3 border border-neutral-600 rounded-xl hover:bg-neutral-600 transition-colors group"
      >
        <div className="w-8 h-10 bg-amber-400/15 rounded flex items-center justify-center flex-shrink-0 text-amber-400">
          <IconBookmarkFilled size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-neutral-100 truncate">Continue to bookmark</div>
          <div className="text-[0.6875rem] text-neutral-400 mt-0.5 truncate">
            &ldquo;{bookmark.wordText}&rdquo; — {bookmark.novelTitle}, Ch. {bookmark.chapter}
          </div>
        </div>
      </Link>
    </section>
  )
}
