'use client'
import { IconHelp } from '@tabler/icons-react'
import { useTutorial } from './TutorialContext'

export function TutorialToggle() {
  const { show } = useTutorial()

  return (
    <button
      onClick={show}
      aria-label="Show tutorial"
      title="How this reader works"
      className="py-2 px-3 rounded-md transition-colors border border-transparent hover:bg-neutral-600 hover:border-neutral-500"
    >
      <IconHelp size={16} className="text-neutral-300" />
    </button>
  )
}
