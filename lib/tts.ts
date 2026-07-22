'use client'

export type NarrationLang = 'de-DE' | 'en-GB'

let cachedSupported: boolean | null = null

export async function isTtsSupported(): Promise<boolean> {
  if (cachedSupported !== null) return cachedSupported
  try {
    const { Capacitor } = await import('@capacitor/core')
    if (Capacitor.isNativePlatform()) {
      cachedSupported = true
      return true
    }
  } catch {
    cachedSupported = false
    return false
  }
  cachedSupported = typeof window !== 'undefined' && 'speechSynthesis' in window
  return cachedSupported
}

export type NarrationVoice = {
  voiceURI: string
  name: string
  lang: string
}

// Index into whatever getSupportedVoices() returns is how the plugin expects
// you to pick a voice, so we cache the last list we fetched and resolve the
// stored voiceURI back to an index right before speaking.
let cachedVoices: NarrationVoice[] = []

export async function getVoicesForLang(lang: NarrationLang): Promise<NarrationVoice[]> {
  try {
    const { TextToSpeech } = await import('@capacitor-community/text-to-speech')
    const { voices } = await TextToSpeech.getSupportedVoices()
    const filtered = (voices ?? []).filter((v: NarrationVoice) => v.lang?.toLowerCase().startsWith(lang.slice(0, 2)))
    cachedVoices = filtered.length > 0 ? filtered : (voices ?? [])
    return cachedVoices
  } catch {
    return []
  }
}

export async function speak(text: string, lang: NarrationLang, rate = 0.85, voiceURI?: string): Promise<void> {
  if (!text.trim()) return
  try {
    const { TextToSpeech } = await import('@capacitor-community/text-to-speech')
    const voiceIndex = voiceURI ? cachedVoices.findIndex((v) => v.voiceURI === voiceURI) : -1
    await TextToSpeech.speak({
      text,
      lang,
      rate,
      pitch: 1.0,
      volume: 1.0,
      category: 'ambient',
      ...(voiceIndex >= 0 ? { voice: voiceIndex } : {}),
    })
  } catch {
    return
  }
}

export async function stopSpeaking(): Promise<void> {
  try {
    const { TextToSpeech } = await import('@capacitor-community/text-to-speech')
    await TextToSpeech.stop()
  } catch {
    return
  }
}
