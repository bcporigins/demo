'use client'

import { useState } from 'react'
import type { GalleryEdition } from '@/lib/notion'

/* ------------------------------------------------------------------ */
/* Edition carousel: the arrows page through past events from the      */
/* Notion Gallery database — title, photos, and pager update together. */
/* Collage slots: [tall, wide, small, small, tall], as in the design.  */
/* ------------------------------------------------------------------ */

export function GalleryCollage({ editions }: { editions: GalleryEdition[] }) {
  const [index, setIndex] = useState(0)
  const [fading, setFading] = useState(false)

  const go = (dir: 1 | -1) => {
    if (editions.length < 2) return
    setFading(true)
    setTimeout(() => {
      setIndex((index + dir + editions.length) % editions.length)
      setFading(false)
    }, 200)
  }

  const edition = editions[index]
  const img = (i: number) => edition.images[i % edition.images.length]

  return (
    <section className="bg-[#fbfbfb] pt-[90px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-[40px] px-6 lg:px-[73px]">
        <div className="flex items-center justify-between gap-4">
          <h2
            className={`text-[36px] font-bold leading-none text-[#2b3034] transition-opacity duration-200 [font-family:var(--font-hepta-slab)] ${
              fading ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {edition.title}
          </h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous edition"
              onClick={() => go(-1)}
              className="size-[64px] transition-transform hover:-translate-x-0.5 lg:size-[79px]"
            >
              <img src="/bcp/gallery-prev.svg" alt="" className="size-full" />
            </button>
            <button
              type="button"
              aria-label="Next edition"
              onClick={() => go(1)}
              className="size-[64px] transition-transform hover:translate-x-0.5 lg:size-[79px]"
            >
              <img src="/bcp/gallery-next.svg" alt="" className="size-full" />
            </button>
          </div>
        </div>
        {/* Collage: tall / (wide + two small) / tall — Notion image URLs are
            short-lived signed links, so plain img tags are used throughout */}
        <div
          className={`grid grid-cols-1 gap-6 transition-opacity duration-200 md:grid-cols-3 ${
            fading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <img src={img(0)} alt={`${edition.title} photo 1`} className="h-[505px] w-full object-cover" />
          <div className="flex h-[505px] flex-col gap-5">
            <img src={img(1)} alt={`${edition.title} photo 2`} className="min-h-0 w-full flex-1 object-cover" />
            <div className="flex min-h-0 flex-1 gap-5">
              <img src={img(2)} alt={`${edition.title} photo 3`} className="h-full w-1/2 object-cover" />
              <img src={img(3)} alt={`${edition.title} photo 4`} className="h-full w-1/2 object-cover" />
            </div>
          </div>
          <img src={img(4)} alt={`${edition.title} photo 5`} className="h-[505px] w-full object-cover" />
        </div>
        {/* Pagination dashes — one per edition */}
        <div className="flex items-center justify-center gap-[5px]">
          {editions.map((e, i) => (
            <button
              key={e.id}
              type="button"
              aria-label={`Go to ${e.title}`}
              onClick={() => i !== index && go(i > index ? 1 : -1)}
              className={`h-[5px] w-[23px] ${i === index ? 'bg-[#2b3034]' : 'bg-[#d6d6d6]'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
