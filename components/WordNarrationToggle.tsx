'use client'
import { useState } from 'react'
import { IconVolume2 } from '@tabler/icons-react'
import { useWordNarration } from './WordNarrationContext'
import { useWordBookmark } from './WordBookmarkContext'
import { VoiceCaveatToast } from './VoiceCaveatToast'

const CAVEAT_STORAGE_KEY = 'voice-caveat-seen'

type Props = {
  hasKoreanVoice?: boolean
}

export function WordNarrationToggle({ hasKoreanVoice = true }: Props) {
  const { active, toggle } = useWordNarration()
  const { deactivate: deactivateBookmark } = useWordBookmark()
  const [showCaveat, setShowCaveat] = useState(false)

  const handleClick = () => {
    if (!active) {
      deactivateBookmark()
      if (hasKoreanVoice && !window.localStorage.getItem(CAVEAT_STORAGE_KEY)) {
        window.localStorage.setItem(CAVEAT_STORAGE_KEY, '1')
        setShowCaveat(true)
      }
    }
    toggle()
  }

  return (
    <>
      <button
        onClick={handleClick}
        aria-label={active ? 'Cancel word narration selection' : 'Hear a word spoken aloud'}
        title={active ? 'Tap a word to hear it' : 'Narrate a word'}
        className={`py-2 px-3 rounded-md transition-colors border ${
          active ? 'bg-neutral-600 border-neutral-500' : 'border-transparent hover:bg-neutral-600 hover:border-neutral-500'
        }`}
      >
        <IconVolume2 size={16} className={active ? 'text-amber-400' : 'text-neutral-300'} />
      </button>
      {showCaveat && <VoiceCaveatToast onDismiss={() => setShowCaveat(false)} />}
    </>
  )
}
