'use client'
import { useEffect, useState } from 'react'
import { IconBookmark, IconBookmarkFilled, IconPencil } from '@tabler/icons-react'
import { useWordBookmark } from './WordBookmarkContext'
import { useWordNarration } from './WordNarrationContext'

export function WordBookmarkToggle({ novelId, chapter }: { novelId: string; chapter: number }) {
  const { active, toggle, bookmark } = useWordBookmark()
  const { deactivate: deactivateNarration } = useWordNarration()
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  const hasBookmarkHere = !!bookmark && bookmark.novelId === novelId && bookmark.chapter === chapter

  const handleClick = () => {
    if (!active) deactivateNarration()
    toggle()
  }

  return (
    <button
      onClick={handleClick}
      aria-label={active ? 'Cancel word bookmark selection' : 'Bookmark a word in this chapter'}
      title={active ? 'Tap a word to bookmark it' : 'Bookmark a word'}
      className={`py-2 px-3 rounded-md transition-colors border ${
        active ? 'bg-neutral-600 border-neutral-500' : 'border-transparent hover:bg-neutral-600 hover:border-neutral-500'
      }`}
    >
      {active && isTouch ? (
        // On touch devices there's no cursor to change, so the icon itself
        // becomes a pencil to signal "tap a word now".
        <IconPencil size={16} className="text-amber-400" />
      ) : hasBookmarkHere ? (
        <IconBookmarkFilled size={16} className="text-amber-400" />
      ) : (
        <IconBookmark size={16} className="text-neutral-300" />
      )}
    </button>
  )
}
