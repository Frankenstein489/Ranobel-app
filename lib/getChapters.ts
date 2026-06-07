import fs from 'fs'
import path from 'path'

export type ChapterMeta = {
  id: number
  filename: string
  title: string
  koreanPercent: string | null
}

function extractTitle(raw: string): string {
  const firstLine = raw.split('\n').find((l) => l.trim() !== '')
  if (!firstLine) return 'Untitled'
  return firstLine.replace(/^#+\s*/, '').split('|')[0].trim()
}

function extractKoreanPercent(raw: string): string | null {
  const match = raw.match(/Target:\s*(\d+%\s*Korean)/i)
  return match ? match[1] : null
}

export function getChapterList(novelId: string): ChapterMeta[] {
  const dir = path.join(process.cwd(), 'content', novelId)
  if (!fs.existsSync(dir)) return []

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort((a, b) => {
      const na = parseInt(a.match(/\d+/)?.[0] ?? '0', 10)
      const nb = parseInt(b.match(/\d+/)?.[0] ?? '0', 10)
      return na - nb
    })

  return files.map((filename) => {
    const raw = fs.readFileSync(path.join(dir, filename), 'utf-8')
    const numMatch = filename.match(/\d+/)
    const id = numMatch ? parseInt(numMatch[0], 10) : 0
    return {
      id,
      filename,
      title: extractTitle(raw),
      koreanPercent: extractKoreanPercent(raw),
    }
  })
}

export function getChapterRaw(novelId: string, chapterNum: number): string | null {
  const dir = path.join(process.cwd(), 'content', novelId)
  if (!fs.existsSync(dir)) return null

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'))
  const file = files.find((f) => {
    const n = parseInt(f.match(/\d+/)?.[0] ?? '0', 10)
    return n === chapterNum
  })

  if (!file) return null
  return fs.readFileSync(path.join(dir, file), 'utf-8')
}
