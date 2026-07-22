'use client'
import { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { IconX } from '@tabler/icons-react'
import { useTutorial } from './TutorialContext'
import { getTutorialTabs, type NovelType } from '@/lib/tutorialContent'

type Props = {
  novelType: NovelType
}

export function TutorialSheet({ novelType }: Props) {
  const { open, hide } = useTutorial()
  const tabs = useMemo(
    () => getTutorialTabs(novelType),
    [novelType],
  )
  const [activeTab, setActiveTab] = useState(tabs[0].id)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  useEffect(() => {
    if (open) setActiveTab(tabs[0].id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (!mounted || !open) return null

  const active = tabs.find((t) => t.id === activeTab) ?? tabs[0]

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={hide} />
      <div className="relative w-full max-w-3xl max-h-[75vh] rounded-t-2xl border border-neutral-600 bg-neutral-800 flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-600 shrink-0">
          <span className="text-sm font-semibold text-neutral-100">How this reader works</span>
          <button onClick={hide} aria-label="Close tutorial" className="p-1.5 rounded-md hover:bg-neutral-600">
            <IconX size={16} className="text-neutral-300" />
          </button>
        </div>
        <div className="flex gap-1 px-4 pt-3 overflow-x-auto shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                tab.id === active.id ? 'bg-neutral-600 text-neutral-100' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="px-4 py-4 overflow-y-auto">
          <ul className="space-y-2.5">
            {active.body.map((line, i) => (
              <li key={i} className="text-sm text-neutral-300 leading-relaxed">{line}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>,
    document.body,
  )
}