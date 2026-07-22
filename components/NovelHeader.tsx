'use client'
import Link from 'next/link'
import { motion } from 'motion/react'
import { IconArrowLeft } from '@tabler/icons-react'
import { SettingsPanel } from './SettingsPanel'

export function NovelHeader() {
  return (
    <header className="sticky top-0 z-40 bg-neutral-750 backdrop-blur border-b border-neutral-600">
      <div className="flex items-center justify-between px-8 py-2">
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
          <Link href="/" className="flex items-center gap-1.5 text-xs text-neutral-100 font-medium hover:text-white transition-colors">
            <IconArrowLeft size={14} /> Library
          </Link>
        </motion.div>
        <SettingsPanel />
      </div>
    </header>
  )
}
