export type WordType = 'verb' | 'conj' | 'adv' | 'adj' | 'noun' | 'pron' | 'particle'

export type AnnotatedWord = {
  romanization: string
  word: string
  type: WordType
  translation: string
  example: string
}

export type Token =
  | { kind: 'text'; value: string }
  | { kind: 'annotated'; data: AnnotatedWord }

export type ParsedLine =
  | { kind: 'heading'; level: number; tokens: Token[] }
  | { kind: 'paragraph'; tokens: Token[] }
  | { kind: 'blank' }
  | { kind: 'table'; headers: string[]; rows: string[][] }

// Matches: romanization{한국어|type|translation|example}
// romanization is any non-{ non-whitespace characters immediately before the {
const ANNOTATION_RE = /([^\s{]+)\{([^|{}]+)\|([^|{}]+)\|([^|{}]+)(?:\|([^}]+))?\}/g

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = []
  let lastIndex = 0
  ANNOTATION_RE.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = ANNOTATION_RE.exec(line)) !== null) {
    // Everything before the romanization prefix is plain text
    if (match.index > lastIndex) {
      tokens.push({ kind: 'text', value: line.slice(lastIndex, match.index) })
    }
    tokens.push({
      kind: 'annotated',
      data: {
        romanization: match[1].trim(),
        word: match[2].trim(),
        type: match[3].trim() as WordType,
        translation: match[4].trim(),
        example: match[5]?.trim() ?? '',
      },
    })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < line.length) {
    tokens.push({ kind: 'text', value: line.slice(lastIndex) })
  }
  return tokens
}

function parseTableSection(lines: string[]): { kind: 'table'; headers: string[]; rows: string[][] } {
  const parseRow = (line: string) =>
    line
      .split('|')
      .map((c) => c.trim())
      .filter((c) => c !== '')

  const headers = parseRow(lines[0])
  const rows: string[][] = []
  for (let i = 2; i < lines.length; i++) {
    const row = parseRow(lines[i])
    if (row.length > 0) rows.push(row)
  }
  return { kind: 'table', headers, rows }
}

export function parseChapter(raw: string): ParsedLine[] {
  const lines = raw.replace(/\r\n/g, '\n').split('\n')
  const result: ParsedLine[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.trim() === '' || line.trim() === '---') {
      if (line.trim() === '') result.push({ kind: 'blank' })
      i++
      continue
    }

    if (/^\*\*Chapter\s+\d+.*Target:.*\*\*$/i.test(line.trim())) {
      i++
      continue
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      result.push({
        kind: 'heading',
        level: headingMatch[1].length,
        tokens: tokenizeLine(headingMatch[2]),
      })
      i++
      continue
    }

    if (line.startsWith('|') && i + 1 < lines.length && lines[i + 1].match(/^\|[-| :]+\|/)) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      result.push(parseTableSection(tableLines))
      continue
    }

    result.push({ kind: 'paragraph', tokens: tokenizeLine(line) })
    i++
  }

  return result
}
