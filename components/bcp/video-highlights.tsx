'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import type { BcpVideo } from '@/lib/notion'
import { youTubeVideoId, youTubeThumbnail } from '@/lib/site'

/* ------------------------------------------------------------------ */
/* Highlight carousel. Each card opens its YouTube video in a new tab; */
/* rows without a URL yet stay as plain, non-clickable cards.          */
/* ------------------------------------------------------------------ */

function HighlightCard({ video }: { video: BcpVideo }) {
  const videoId = youTubeVideoId(video.url)
  const thumb = video.thumbnail ?? (videoId ? youTubeThumbnail(videoId) : null)

  const body = (
    <>
      <div className="relative h-[160px] w-full overflow-hidden border-2 border-[#1f1f1f] bg-[#d9d9d9]">
        {thumb && (
          // Notion thumbnails are short-lived signed URLs, and YouTube's own
          // thumbnails are remote — both bypass next/image
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt={video.title} className="size-full object-cover" />
        )}
        {video.url && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity group-hover:opacity-100">
            <Play className="size-12 fill-white text-white" />
          </span>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <h3 className="text-[16px] font-semibold text-[#2b3034] [font-family:var(--font-hepta-slab)]">
          {video.title}
        </h3>
        {video.url && (
          <span className="whitespace-nowrap text-[11px] text-[#2b3034] [font-family:var(--font-raleway)]">
            Watch Replay
          </span>
        )}
      </div>
      <p className="mt-1 text-[13px] text-[#5f5f64] [font-family:var(--font-raleway)]">
        {video.subtitle}
      </p>
    </>
  )

  const shell =
    'group block w-[300px] shrink-0 border-4 border-[#1f1f1f] bg-white p-2.5 shadow-[4px_4px_0px_#1f1f1f]'

  if (!video.url) return <article className={shell}>{body}</article>
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${shell} transition-transform hover:-translate-y-0.5`}
    >
      {body}
    </a>
  )
}

export function VideoHighlights({ videos }: { videos: BcpVideo[] }) {
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
        {videos.map((video) => (
          <HighlightCard key={video.id} video={video} />
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
