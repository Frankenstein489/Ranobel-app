'use client'

const PREFIX = 'geurimja-ilgi'

export function getLastChapter(novelId: string): number {
  if (typeof window === 'undefined') return 1
  const val = localStorage.getItem(`${PREFIX}:progress:${novelId}`)
  return val ? parseInt(val, 10) : 1
}

export function setLastChapter(novelId: string, chapter: number): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(`${PREFIX}:progress:${novelId}`, String(chapter))
}

export function getBookmarks(novelId: string): number[] {
  if (typeof window === 'undefined') return []
  const val = localStorage.getItem(`${PREFIX}:bookmarks:${novelId}`)
  return val ? (JSON.parse(val) as number[]) : []
}

export function toggleBookmark(novelId: string, chapter: number): boolean {
  const current = getBookmarks(novelId)
  const exists = current.includes(chapter)
  const updated = exists ? current.filter((c) => c !== chapter) : [...current, chapter]
  localStorage.setItem(`${PREFIX}:bookmarks:${novelId}`, JSON.stringify(updated))
  return !exists
}

export function isBookmarked(novelId: string, chapter: number): boolean {
  return getBookmarks(novelId).includes(chapter)
}
