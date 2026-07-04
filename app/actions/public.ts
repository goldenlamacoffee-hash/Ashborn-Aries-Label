'use server'

import { z } from 'zod'
import { db } from '@/lib/db'
import { contactMessages, newsletterSubscribers } from '@/lib/db/schema'

const emailSchema = z.string().trim().email().max(320)

export async function subscribeToNewsletter(
  email: string,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = emailSchema.safeParse(email)
  if (!parsed.success) return { ok: false, error: 'Enter a valid email address.' }
  try {
    await db
      .insert(newsletterSubscribers)
      .values({ email: parsed.data.toLowerCase() })
      .onConflictDoNothing()
    return { ok: true }
  } catch {
    return { ok: false, error: 'Something went wrong. Try again.' }
  }
}

const contactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: emailSchema,
  subject: z.string().trim().max(300).default(''),
  message: z.string().trim().min(1).max(5000),
})

export async function sendContactMessage(input: {
  name: string
  email: string
  subject?: string
  message: string
}): Promise<{ ok: boolean; error?: string }> {
  const parsed = contactSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Fill in your name, a valid email, and a message.' }
  try {
    await db.insert(contactMessages).values(parsed.data)
    return { ok: true }
  } catch {
    return { ok: false, error: 'Something went wrong. Try again.' }
  }
}
