"use client"

import { useState } from "react"
import { EmberButton } from "@/components/ember-button"
import { sendContactMessage } from "@/app/actions/public"

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === "sending") return
    const form = e.currentTarget
    const data = new FormData(form)
    setStatus("sending")
    setError(null)
    const result = await sendContactMessage({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      subject: String(data.get("subject") ?? ""),
      message: String(data.get("message") ?? ""),
    })
    if (result.ok) {
      setStatus("sent")
    } else {
      setStatus("idle")
      setError(result.error ?? "Something went wrong. Try again.")
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-accent/40 bg-card p-10 text-center">
        <p className="font-serif text-2xl text-foreground">Message received.</p>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          {"We read everything that comes through the fire. If it's meant to be answered, it will be."}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor="name" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="border border-border bg-secondary px-4 py-3 text-foreground outline-none transition-colors focus:border-accent"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor="email" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="border border-border bg-secondary px-4 py-3 text-foreground outline-none transition-colors focus:border-accent"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="subject" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          className="border border-border bg-secondary px-4 py-3 text-foreground outline-none transition-colors focus:border-accent"
        >
          <option>General inquiry</option>
          <option>Licensing &amp; sync</option>
          <option>Press &amp; media</option>
          <option>Collaboration</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          className="resize-y border border-border bg-secondary px-4 py-3 leading-relaxed text-foreground outline-none transition-colors focus:border-accent"
        />
      </div>

      <div className="flex flex-col gap-3">
        <EmberButton type="submit">
          {status === "sending" ? "Sending…" : "Send Into the Fire"}
        </EmberButton>
        {error && (
          <p role="alert" className="font-sans text-xs text-ember">
            {error}
          </p>
        )}
      </div>
    </form>
  )
}
