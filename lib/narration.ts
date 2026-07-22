import type { ParsedLine, Token } from './parseChapter'

function tokensToText(tokens: Token[], substituteAnnotated: boolean): string {
  return tokens
    .map((t) => (t.kind === 'annotated' ? (substituteAnnotated ? t.data.translation : t.data.word) : t.value))
    .join('')
    .trim()
}

function extractNarrationSegments(lines: ParsedLine[], substituteAnnotated: boolean): string[] {
  const segments: string[] = []
  for (const line of lines) {
    if (line.kind !== 'paragraph' && line.kind !== 'heading') continue
    const text = tokensToText(line.tokens, substituteAnnotated)
    if (text) segments.push(text)
  }
  return segments
}

// Whole-chapter "Listen" narration: reads the surrounding English prose,
// substituting each annotated Korean word with its English translation so
// the narration (a single English voice) stays fluent instead of switching
// languages mid-sentence for every annotated word.
export function extractMdNarration(lines: ParsedLine[]): string[] {
  return extractNarrationSegments(lines, true)
}

// Reads the actual Korean word text instead of the translation — not used
// by whole-chapter narration today, kept for parity with word-level
// narration logic and in case a Korean-first reading mode is added later.
export function extractPlainNarration(lines: ParsedLine[]): string[] {
  return extractNarrationSegments(lines, false)
}
