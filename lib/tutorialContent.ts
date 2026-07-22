// Only one novel type exists in Ranobel today ('md' — plain chapters with
// inline annotated Korean words). The type is kept as a union rather than a
// bare string so this can grow the same way the reference project's did
// (e.g. a future 'graded' or 'parallel' novel type) without a rewrite.
export type NovelType = 'md'

export type TutorialTab = {
  id: string
  label: string
  body: string[]
}

const BOOKMARK_TAB: TutorialTab = {
  id: 'bookmark',
  label: 'Bookmarks',
  body: [
    'Tap the pencil icon in the header to arm bookmark mode.',
    'Then tap any word to save it as your bookmark for this novel.',
    'Tap the pencil again to cancel without picking anything.',
  ],
}

const NARRATION_TAB: TutorialTab = {
  id: 'narration',
  label: 'Narration',
  body: [
    'Tap the speaker icon in the header to arm word narration.',
    'Then tap any word to hear it spoken aloud.',
    'Open Settings and use the Listen controls to play, pause, or stop narration for the whole chapter.',
  ],
}

export const DEVICE_VOICE_CAVEAT = 'If your device has no Korean voice installed, Korean words may sound off or come out in an English accent.'

const ANNOTATION_TAB: TutorialTab = {
  id: 'annotation',
  label: 'Annotation',
  body: [
    'Korean words are colored by grammatical type as you read.',
    'Tap a Korean word to see its meaning, romanization, and an example sentence.',
  ],
}

export function getTutorialTabs(novelType: NovelType): TutorialTab[] {
  return [BOOKMARK_TAB, NARRATION_TAB, ANNOTATION_TAB]
}
