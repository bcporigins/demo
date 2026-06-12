'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const VIDEOS = [
  { title: 'BCP 24, Akure', tag: 'Watch Replay', sub: 'a Speaker Session, A Pitch session', thumb: '/bcp/collage-1.png' },
  { title: 'BCP 24, Akure', tag: 'Media', sub: 'a Speaker Session, A Pitch session', thumb: '/bcp/collage-2.png' },
  { title: 'BCP 24, Akure', tag: 'Watch Replay', sub: 'a Speaker Session, A Pitch session', thumb: '/bcp/collage-3.png' },
  { title: 'BCP 24, Akure', tag: 'Watch Replay', sub: 'a Speaker Session, A Pitch session', thumb: '/bcp/collage-4.png' },
]

export function VideoHighlights() {
  const track = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: 1 | -1) => {
    track.current?.scrollBy({ left: dir * 330, behavior: 'smooth' })
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label="Previous videos"
        onClick={() => scrollBy(-1)}
        className="shrink-0 text-[#2b3034] transition-transform hover:-translate-x-0.5"
      >
        <ChevronLeft className="size-8" />
      </button>
      <div ref={track} className="flex flex-1 gap-8 overflow-x-auto scroll-smooth pb-2">
        {VIDEOS.map(({ title, tag, sub, thumb }, i) => (
          <article
            key={i}
            className="w-[300px] shrink-0 border-4 border-[#1f1f1f] bg-white p-2.5 shadow-[4px_4px_0px_#1f1f1f]"
          >
            <div className="relative h-[160px] w-full overflow-hidden border-2 border-[#1f1f1f]">
              <Image src={thumb} alt={title} fill sizes="300px" className="object-cover" />
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <h3 className="text-[16px] font-semibold text-[#2b3034] [font-family:var(--font-hepta-slab)]">
                {title}
              </h3>
              <span className="whitespace-nowrap text-[11px] text-[#2b3034] [font-family:var(--font-raleway)]">
                {tag}
              </span>
            </div>
            <p className="mt-1 text-[13px] text-[#5f5f64] [font-family:var(--font-raleway)]">{sub}</p>
          </article>
        ))}
      </div>
      <button
        type="button"
        aria-label="Next videos"
        onClick={() => scrollBy(1)}
        className="shrink-0 text-[#2b3034] transition-transform hover:translate-x-0.5"
      >
        <ChevronRight className="size-8" />
      </button>
    </div>
  )
}
