"use client"

import { useState } from "react"
import { EmberButton } from "@/components/ember-button"

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle")

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sent")
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

      <div>
        <EmberButton type="submit">Send Into the Fire</EmberButton>
      </div>
    </form>
  )
}
