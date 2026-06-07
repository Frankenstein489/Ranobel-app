import { KoreanWord } from './KoreanWord'
import type { ParsedLine, Token } from '@/lib/parseChapter'

// Korean particles to highlight in table cells
// Sorted longest-first to avoid partial matches
const PARTICLE_LIST = [
  '에서는', '에게서', '로부터', '한테서',
  '에서', '에게', '한테', '에도', '로는', '으로',
  '은/는', '이/가', '을/를',
  '은', '는', '이', '가', '을', '를',
  '에', '도', '만', '로', '과', '와', '의',
  '부터', '까지', '마다', '밖에', '처럼', '보다',
]

type ParticleStyle = { color: string; label: string }

const PARTICLE_COLORS: Record<string, ParticleStyle> = {
  // Subject markers
  '은': { color: '#60a5fa', label: 'topic' },
  '는': { color: '#60a5fa', label: 'topic' },
  '이': { color: '#f472b6', label: 'subject' },
  '가': { color: '#f472b6', label: 'subject' },
  '은/는': { color: '#60a5fa', label: 'topic' },
  '이/가': { color: '#f472b6', label: 'subject' },
  // Object markers
  '을': { color: '#4ade80', label: 'object' },
  '를': { color: '#4ade80', label: 'object' },
  '을/를': { color: '#4ade80', label: 'object' },
  // Location / direction
  '에': { color: '#fcd34d', label: 'loc/time' },
  '에서': { color: '#fb923c', label: 'location (action)' },
  '에게': { color: '#fb923c', label: 'to (person)' },
  '한테': { color: '#fb923c', label: 'to (person, spoken)' },
  '에서는': { color: '#fb923c', label: 'location (contrast)' },
  '에게서': { color: '#fb923c', label: 'from (person)' },
  '한테서': { color: '#fb923c', label: 'from (person, spoken)' },
  '로부터': { color: '#fb923c', label: 'from' },
  // Other common
  '도': { color: '#c084fc', label: 'also/too' },
  '만': { color: '#c084fc', label: 'only' },
  '의': { color: '#94a3b8', label: 'possessive' },
  '과': { color: '#94a3b8', label: 'and (formal)' },
  '와': { color: '#94a3b8', label: 'and (informal)' },
  '로': { color: '#fcd34d', label: 'direction/means' },
  '으로': { color: '#fcd34d', label: 'direction/means' },
  '로는': { color: '#fcd34d', label: 'direction (contrast)' },
  '부터': { color: '#a78bfa', label: 'from (time)' },
  '까지': { color: '#a78bfa', label: 'until/up to' },
  '마다': { color: '#a78bfa', label: 'every' },
  '밖에': { color: '#a78bfa', label: 'nothing but' },
  '처럼': { color: '#a78bfa', label: 'like/as' },
  '보다': { color: '#a78bfa', label: 'more than' },
  '에도': { color: '#fcd34d', label: 'even at/in' },
}

const STYLE_CSS = `
  .kp-topic     { color: #60a5fa }
  .kp-subject   { color: #f472b6 }
  .kp-object    { color: #4ade80 }
  .kp-loctime   { color: #fcd34d }
  .kp-action    { color: #fb923c }
  .kp-other     { color: #c084fc }
  .kp-poss      { color: #94a3b8 }
  .kp-dir       { color: #fcd34d }
  .kp-range     { color: #a78bfa }
`

function getParticleMatch(text: string): { style: ParticleStyle; len: number } | null {
  for (const p of PARTICLE_LIST) {
    if (text === p || text.startsWith(p + ' ') || text.endsWith(p) || text.includes(p)) {
      // Only highlight if the cell text IS the particle or starts/ends with it
      if (text === p) {
        const style = PARTICLE_COLORS[p]
        if (style) return { style, len: p.length }
      }
    }
  }
  // Check if text starts with a known particle
  for (const p of PARTICLE_LIST) {
    if (text.startsWith(p)) {
      const style = PARTICLE_COLORS[p]
      if (style) return { style, len: p.length }
    }
  }
  return null
}

function ParticleCell({ text }: { text: string }) {
  const match = getParticleMatch(text)
  if (!match) return <>{text}</>
  const particle = text.slice(0, match.len)
  const rest = text.slice(match.len)
  return (
    <>
      <span className="font-semibold" style={{ color: match.style.color }} title={match.style.label}>
        {particle}
      </span>
      {rest}
    </>
  )
}

function Tokens({ tokens }: { tokens: Token[] }) {
  return (
    <>
      {tokens.map((t, i) =>
        t.kind === 'text'
          ? <span key={i}>{t.value}</span>
          : <KoreanWord key={i} data={t.data} />
      )}
    </>
  )
}

export function ChapterRenderer({ lines, fontSize }: { lines: ParsedLine[]; fontSize: number }) {
  return (
    <div style={{ fontSize }} className="font-mono">
      <style>{STYLE_CSS}</style>

      {lines.map((line, i) => {
        if (line.kind === 'blank') return <div key={i} className="h-3" />

        if (line.kind === 'heading') {
          if (line.level === 1) return (
            <h1 key={i} className="text-xl font-bold text-neutral-100 mb-5 mt-2">
              <Tokens tokens={line.tokens} />
            </h1>
          )
          if (line.level === 2) return (
            <h2 key={i} className="text-base font-semibold text-neutral-200 mb-3 mt-8 pb-2 border-b border-neutral-600">
              <Tokens tokens={line.tokens} />
            </h2>
          )
          return (
            <h3 key={i} className="text-sm font-semibold text-neutral-200 mb-2 mt-4">
              <Tokens tokens={line.tokens} />
            </h3>
          )
        }

        if (line.kind === 'table') return (
          <div key={i} className="my-6 overflow-x-auto rounded-xl border border-neutral-600">
            <table className="w-full text-xs border-collapse">
              <thead className="bg-neutral-750">
                <tr>
                  {line.headers.map((h, j) => (
                    <th key={j} className="text-left py-2 px-3 font-semibold text-neutral-300 uppercase tracking-wider text-[10px]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {line.rows.map((row, j) => (
                  <tr key={j} className="border-t border-neutral-600 even:bg-neutral-750">
                    {row.map((cell, k) => (
                      <td key={k} className="py-2 px-3 text-neutral-200">
                        <ParticleCell text={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )

        return (
          <p key={i} className="leading-[1.95] text-neutral-200 mb-4 text-[15px]">
            <Tokens tokens={line.tokens} />
          </p>
        )
      })}
    </div>
  )
}
