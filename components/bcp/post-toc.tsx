'use client'

import { useEffect, useState } from 'react'
import type { TocHeading } from '@/components/bcp/notion-blocks'

/* ------------------------------------------------------------------ */
/* Sticky "On this page" sidebar with scroll-spy highlighting.         */
/* ------------------------------------------------------------------ */

export function PostToc({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null)

  useEffect(() => {
    if (headings.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        // Highlight the topmost heading currently in the reading zone
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0 }
    )
    for (const h of headings) {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav aria-label="Table of contents" className="border-l-[3px] border-[#2b3034] pl-5">
      <p className="text-[14px] font-bold uppercase tracking-[0.1em] text-[#2b3034] [font-family:var(--font-raleway)]">
        On this page
      </p>
      <ul className="mt-4 flex flex-col gap-2.5">
        {headings.map(({ id, text, level }) => (
          <li key={id} style={{ paddingLeft: (level - 1) * 14 }}>
            <a
              href={`#${id}`}
              className={`block text-[15px] leading-6 transition-colors [font-family:var(--font-raleway)] ${
                activeId === id
                  ? '-ml-5 border-l-[3px] border-[#fed07b] pl-[17px] font-bold text-[#2b3034]'
                  : 'text-[#5f5f64] hover:text-[#2b3034]'
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
