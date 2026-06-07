'use client'
import { useState, useEffect } from 'react'
import { isBookmarked, toggleBookmark } from '@/lib/storage'
import { IconBookmark, IconBookmarkFilled } from '@tabler/icons-react'

export function BookmarkButton({ novelId, chapter }: { novelId: string; chapter: number }) {
  const [bookmarked, setBookmarked] = useState(false)
  useEffect(() => { setBookmarked(isBookmarked(novelId, chapter)) }, [novelId, chapter])
  return (
    <button
      onClick={() => setBookmarked(toggleBookmark(novelId, chapter))}
      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
      className="py-2 px-3 hover:bg-neutral-600 rounded-md transition-colors border border-transparent hover:border-neutral-500"
    >
      {bookmarked
        ? <IconBookmarkFilled size={16} className="text-neutral-200" />
        : <IconBookmark size={16} className="text-neutral-300" />}
    </button>
  )
}
