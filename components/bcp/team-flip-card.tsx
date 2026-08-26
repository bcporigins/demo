'use client'

import { useState } from 'react'
import { Linkedin, RotateCcw } from 'lucide-react'
import type { Person } from '@/lib/notion'

/**
 * Portrait on the front, bio on the back.
 *
 * Pointer devices flip it on hover. Touch devices have no hover, so the card
 * is also a button that flips on tap — without this the bio was unreachable on
 * a phone. The hover rule is scoped to `(hover: hover)` so a tap on mobile
 * cannot leave the card stuck mid-state.
 *
 * Portraits come from Notion on short-lived signed URLs, so they use a plain
 * img rather than next/image, which would cache a URL that expires.
 */
export function TeamFlipCard({ member }: { member: Person }) {
  const [flipped, setFlipped] = useState(false)

  const linkedIn = member.linkedin ? (
    <a
      href={member.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${member.name} on LinkedIn`}
      onClick={(event) => event.stopPropagation()}
      className="shrink-0 rounded-[3px] transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fed07b]"
    >
      <Linkedin className="size-5 text-white" />
    </a>
  ) : null

  return (
    <div className="group aspect-square w-full [perspective:1000px]">
      <div
        className={`relative size-full transition-transform duration-700 [transform-style:preserve-3d] ${
          flipped
            ? '[transform:rotateY(180deg)]'
            : '[@media(hover:hover)]:group-hover:[transform:rotateY(180deg)]'
        }`}
      >
        {/* Front */}
        <button
          type="button"
          onClick={() => setFlipped(true)}
          aria-hidden={flipped}
          tabIndex={flipped ? -1 : 0}
          aria-label={`Read ${member.name}'s bio`}
          className="absolute inset-0 block overflow-hidden border-[6px] border-[#2b3034] text-left [backface-visibility:hidden] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#fed07b]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={member.photo} alt={member.name} className="size-full object-cover" />
          {/* A scrim rather than a blur: the name is white, and over a light
              portrait backdrop-blur alone left it unreadable. */}
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/45 to-transparent"
          />
          {/* Only shown where there is no hover, as the cue to tap. */}
          <span
            aria-hidden
            className="absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-[2px] [@media(hover:hover)]:hidden"
          >
            <RotateCcw className="size-4" strokeWidth={2} />
          </span>
          <span className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-3">
            <span className="text-[17px] font-semibold leading-tight text-white [font-family:var(--font-raleway)] sm:text-[19px]">
              {member.name}
            </span>
            {member.role && (
              <span className="text-[12px] leading-tight text-[#fed07b] [font-family:var(--font-raleway)] sm:text-[13px]">
                {member.role}
              </span>
            )}
          </span>
        </button>

        {/* Back */}
        <div
          onClick={() => setFlipped(false)}
          className="absolute inset-0 flex flex-col justify-between gap-2 border-[6px] border-[#2b3034] bg-[#2b3034] p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="flex flex-col">
              <span className="text-[17px] font-medium leading-tight text-white [font-family:var(--font-raleway)] sm:text-[19px]">
                {member.name}
              </span>
              {member.role && (
                <span className="mt-1 text-[13px] leading-tight text-[#fed07b] [font-family:var(--font-raleway)]">
                  {member.role}
                </span>
              )}
            </span>
            {linkedIn}
          </div>
          <p className="line-clamp-[9] text-[13px] leading-[1.45] text-[#d6d6d6] [font-family:var(--font-raleway)]">
            {member.bio}
          </p>
          <button
            type="button"
            onClick={() => setFlipped(false)}
            aria-hidden={!flipped}
            tabIndex={flipped ? 0 : -1}
            className="self-start text-[12px] font-semibold uppercase tracking-[0.1em] text-[#9aa1a7] transition-colors [font-family:var(--font-raleway)] hover:text-[#fed07b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fed07b] [@media(hover:hover)]:hidden"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  )
}
