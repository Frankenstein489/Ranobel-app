import { notFound } from 'next/navigation'
import { getNovel } from '@/novels.config'
import { getChapterRaw, getChapterList } from '@/lib/getChapters'
import { parseChapter } from '@/lib/parseChapter'
import { ReaderClient } from '@/components/ReaderClient'

type Props = { params: Promise<{ novelId: string; chapterId: string }> }

export default async function ReaderPage({ params }: Props) {
  const { novelId, chapterId } = await params
  const novel = getNovel(novelId)
  if (!novel || novel.type !== 'md') notFound()
  const chapterNum = parseInt(chapterId, 10)
  if (isNaN(chapterNum)) notFound()
  const raw = getChapterRaw(novel.contentFolder, chapterNum)
  if (!raw) notFound()
  const chapters = getChapterList(novel.contentFolder)
  const lines = parseChapter(raw)
  return (
    <ReaderClient
      novelId={novelId}
      novelTitle={novel.title}
      chapterNum={chapterNum}
      totalChapters={novel.totalChapters}
      availableChapters={chapters.length}
      lines={lines}
      isDemo={false}
    />
  )
}
