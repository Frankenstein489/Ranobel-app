'use client'

const PREFIX = 'geurimja-ilgi'
const KEY = `${PREFIX}:settings`

export type ReaderTheme = 'dark' | 'light' | 'system'
export type ReaderFontFamily = 'mono' | 'sans' | 'serif'

export type ReaderSettings = {
  theme: ReaderTheme
  fontSize: number
  fontFamily: ReaderFontFamily
  brightness: number
  // 1.0 = normal device speed. Default is slightly slower than the plugin's
  // own default (1.0) since chapter narration is easier to follow slowed down.
  narrationRate: number
  // voiceURI of the selected system voice, or null to use the device default.
  narrationVoiceURI: string | null
}

export const DEFAULT_SETTINGS: ReaderSettings = {
  theme: 'dark',
  fontSize: 15,
  fontFamily: 'mono',
  brightness: 100,
  narrationRate: 0.85,
  narrationVoiceURI: null,
}

export const NARRATION_RATE_MIN = 0.5
export const NARRATION_RATE_MAX = 1.5
export const NARRATION_RATE_STEP = 0.05

export const FONT_SIZE_MIN = 12
export const FONT_SIZE_MAX = 24

export const FONT_STACKS: Record<ReaderFontFamily, string> = {
  mono: 'var(--font-mono), ui-monospace, monospace',
  sans: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
  serif: "Georgia, Cambria, 'Times New Roman', Times, serif",
}

export const BRIGHTNESS_MIN = 50
export const BRIGHTNESS_MAX = 100

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function sanitize(raw: Partial<ReaderSettings>): ReaderSettings {
  const theme: ReaderTheme = raw.theme === 'light' || raw.theme === 'system' ? raw.theme : 'dark'
  const fontFamily: ReaderFontFamily = raw.fontFamily === 'sans' || raw.fontFamily === 'serif' ? raw.fontFamily : 'mono'
  const fontSize = typeof raw.fontSize === 'number' && !Number.isNaN(raw.fontSize)
    ? clamp(raw.fontSize, FONT_SIZE_MIN, FONT_SIZE_MAX)
    : DEFAULT_SETTINGS.fontSize
  const brightness = typeof raw.brightness === 'number' && !Number.isNaN(raw.brightness)
    ? clamp(raw.brightness, BRIGHTNESS_MIN, BRIGHTNESS_MAX)
    : DEFAULT_SETTINGS.brightness
  const narrationRate = typeof raw.narrationRate === 'number' && !Number.isNaN(raw.narrationRate)
    ? clamp(raw.narrationRate, NARRATION_RATE_MIN, NARRATION_RATE_MAX)
    : DEFAULT_SETTINGS.narrationRate
  const narrationVoiceURI = typeof raw.narrationVoiceURI === 'string' ? raw.narrationVoiceURI : null
  return { theme, fontFamily, fontSize, brightness, narrationRate, narrationVoiceURI }
}

export function getReaderSettings(): ReaderSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS
  const raw = localStorage.getItem(KEY)
  if (!raw) return DEFAULT_SETTINGS
  try {
    return sanitize({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) })
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function setReaderSettings(patch: Partial<ReaderSettings>): ReaderSettings {
  const next = sanitize({ ...getReaderSettings(), ...patch })
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEY, JSON.stringify(next))
  }
  return next
}

export function resolveIsLight(theme: ReaderTheme): boolean {
  if (theme === 'light') return true
  if (theme === 'dark') return false
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: light)').matches
}
