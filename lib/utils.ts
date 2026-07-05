import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns the story note for public display, or empty string when it is
 * blank or leftover placeholder copy that must never appear on the live site.
 */
export function publicStoryNote(note: string | null | undefined): string {
  if (!note) return ''
  if (/placeholder/i.test(note)) return ''
  return note.trim()
}
