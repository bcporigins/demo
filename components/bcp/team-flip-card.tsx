'use client'

import { useEffect, useRef, useState } from 'react'
import { Linkedin, X, Maximize2 } from 'lucide-react'
import type { Person } from '@/lib/notion'

/**
 * Portrait on the front, a preview of the bio on the back, and the whole
 * profile in a dialog.
 *
 * Bios run past 1,400 characters. A square tile holds roughly 350, and no
 * amount of expanding fixes that — on a phone the card would have to grow
 * taller than the screen. So the card previews and the dialog carries the
 * full text, scrolling when it has to.
 *
 * Pointer devices flip on hover. Touch devices have no hover, so the front is
 * a button that opens the dialog directly. The hover rule is scoped to
 * `(hover: hover)` so the two cannot fight.
 *
 * Portraits come from Notion on short-lived signed URLs, hence plain img
 * rather than next/image, which would cache a URL that expires.
 */
export function TeamFlipCard({ member }: { member: Person }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)
  const hasBio = member.bio.trim().length > 0

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const linkedIn = (className: string, label?: string) =>
    member.linkedin ? (
      <a
        href={member.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${member.name} on LinkedIn`}
        onClick={(event) => event.stopPropagation()}
        className={className}
      >
        <Linkedin className="size-5" />
        {label}
      </a>
    ) : null

  return (
    <>
      <div className="group aspect-square w-full [perspective:1000px]">
        <div className="relative size-full transition-transform duration-700 [transform-style:preserve-3d] [@media(hover:hover)]:group-hover:[transform:rotateY(180deg)]">
          {/* Front */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-label={
              hasBio ? `Read ${member.name}'s full profile` : `${member.name}, ${member.role}`
            }
            className="absolute inset-0 block overflow-hidden border-[6px] border-[#2b3034] text-left [backface-visibility:hidden] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#fed07b]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={member.photo} alt={member.name} className="size-full object-cover" />
            {/* A scrim, not a blur: the name is white and portraits are often light. */}
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/45 to-transparent"
            />
            <span
              aria-hidden
              className="absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-[2px] [@media(hover:hover)]:hidden"
            >
              <Maximize2 className="size-4" strokeWidth={2} />
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

          {/* Back — preview only, shown on hover */}
          <div
            onClick={() => setOpen(true)}
            className="absolute inset-0 flex cursor-pointer flex-col border-[6px] border-[#2b3034] bg-[#2b3034] p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]"
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
              {linkedIn(
                'shrink-0 rounded-[3px] text-white transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fed07b]'
              )}
            </div>
            {hasBio && (
              <>
                {/* Fades out rather than cutting mid-word, so the clamp reads
                    as deliberate and the prompt below explains it. */}
                <div className="relative mt-3 min-h-0 flex-1 overflow-hidden">
                  <p className="text-[13px] leading-[1.5] text-[#d6d6d6] [font-family:var(--font-raleway)]">
                    {member.bio}
                  </p>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#2b3034] to-transparent"
                  />
                </div>
                <span className="mt-2 shrink-0 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#fed07b] [font-family:var(--font-raleway)]">
                  Read full bio →
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Full profile */}
      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          // Clicking the backdrop closes; the panel stops propagation below.
          if (event.target === dialogRef.current) setOpen(false)
        }}
        className="m-auto w-[min(560px,calc(100vw-32px))] rounded-[3px] border-[6px] border-[#2b3034] bg-[#fbfbfb] p-0 shadow-[8px_8px_0px_#1f1f1f] backdrop:bg-black/60 backdrop:backdrop-blur-[2px]"
      >
        <div className="flex max-h-[82vh] flex-col">
          <div className="flex items-start gap-4 border-b-2 border-[#ebe8e3] p-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={member.photo}
              alt={member.name}
              className="size-16 shrink-0 border-2 border-[#2b3034] object-cover sm:size-20"
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <h3 className="text-[20px] font-bold leading-tight text-[#2b3034] [font-family:var(--font-hepta-slab)] sm:text-[24px]">
                {member.name}
              </h3>
              {member.role && (
                <p className="mt-1 text-[14px] leading-tight text-[#8a6d1f] [font-family:var(--font-raleway)] sm:text-[15px]">
                  {member.role}
                </p>
              )}
              {linkedIn(
                'mt-2 inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold text-[#2b3034] underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fed07b] [font-family:var(--font-raleway)]',
                'Connect on LinkedIn'
              )}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="-mr-1 -mt-1 flex size-9 shrink-0 items-center justify-center rounded-[3px] border-2 border-[#2b3034] bg-[#fbfbfb] text-[#2b3034] transition-colors hover:bg-[#fed07b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fed07b]"
            >
              <X className="size-5" />
            </button>
          </div>
          {hasBio && (
            <div className="space-y-4 overflow-y-auto p-5">
              {/* Notion keeps paragraph breaks as newlines. Rendering them as
                  separate paragraphs gives them real spacing — pre-line alone
                  ran them together. */}
              {member.bio
                .split(/\n+/)
                .map((para) => para.trim())
                .filter(Boolean)
                .map((para, i) => (
                  <p
                    key={i}
                    className="text-[15px] leading-[1.7] text-[#414141] [font-family:var(--font-raleway)] sm:text-[16px]"
                  >
                    {para}
                  </p>
                ))}
            </div>
          )}
        </div>
      </dialog>
    </>
  )
}
