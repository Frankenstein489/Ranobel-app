import { notFound } from 'next/navigation'
import { getNovel } from '@/novels.config'
import { getChapterList } from '@/lib/getChapters'
import { NovelPageClient } from '@/components/NovelPageClient'
import { NovelHeader } from '@/components/NovelHeader'
import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'

type Props = { params: Promise<{ novelId: string }> }

export default async function NovelPage({ params }: Props) {
  const { novelId } = await params
  const novel = getNovel(novelId)
  if (!novel) notFound()
  const chapters = getChapterList(novel.contentFolder)

  return (
    <div className="min-h-screen flex flex-col">
      <NovelHeader />

      <main className="flex-1 px-[calc(1.25rem+8px)] md:px-[calc(2.5rem+16px)] py-8">
        <div className="flex gap-4 mb-6">
          <div
            className="w-20 flex-shrink-0 rounded-xl overflow-hidden border border-neutral-700 bg-neutral-800"
            style={{ aspectRatio: '2/3' }}
          >
            {novel.coverImage
              ? <img src={novel.coverImage} alt={novel.title} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-neutral-400">{novel.title.slice(0, 1)}</span>
                </div>
            }
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-neutral-100 mb-0.5 leading-tight">{novel.title}</h1>
            <p className="text-[11px] text-neutral-400 mb-2">{novel.author}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {novel.genre.map(g => (
                <span key={g} className="text-[9px] border border-neutral-600 rounded-md px-1.5 py-0.5 text-neutral-300">
                  {g}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-neutral-300 leading-relaxed">{novel.description}</p>
          </div>
        </div>

        <NovelPageClient novelId={novelId} chapters={chapters} />

        {chapters.length > 0 && (
          <>
            <div className="text-[10px] uppercase tracking-[0.12em] text-neutral-400 mb-2 px-1">Chapters</div>
            <div className="flex flex-col divide-y divide-neutral-600 border border-neutral-600 rounded-xl overflow-hidden">
              {chapters.map(ch => (
                <Link key={ch.id} href={`/${novelId}/${ch.id}`}
                  className="flex items-center gap-3 py-3 px-4 hover:bg-neutral-600 transition-colors group">
                  <span className="text-[10px] text-neutral-400 w-5 text-right flex-shrink-0 tabular-nums">{ch.id}</span>
                  <span className="flex-1 text-xs text-neutral-200 group-hover:text-neutral-100 transition-colors truncate">{ch.title}</span>
                  {ch.koreanPercent && <span className="text-[10px] text-neutral-400 flex-shrink-0">{ch.koreanPercent}</span>}
                  <IconArrowLeft size={11} className="text-neutral-500 rotate-180 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}