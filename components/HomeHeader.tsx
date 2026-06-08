'use client'
import { motion } from 'motion/react'

export function HomeHeader() {
  return (
    <header className="sticky top-0 z-40 bg-neutral-750 backdrop-blur border-b border-neutral-600">
      <div className="flex items-center px-[calc(1.25rem+8px)] md:px-[calc(2.5rem+16px)] py-3">
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
          <span className="text-sm font-bold text-neutral-100 tracking-tight">
            Ranobel
          </span>
        </motion.div>
      </div>
    </header>
  )
}
