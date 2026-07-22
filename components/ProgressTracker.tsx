'use client'
import { useEffect } from 'react'
import { setLastChapter } from '@/lib/storage'

export function ProgressTracker({ novelId, chapter }: { novelId: string; chapter: number }) {
  useEffect(() => { setLastChapter(novelId, chapter) }, [novelId, chapter])
  return null
}
