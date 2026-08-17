'use client'

import { useState } from 'react'
import type { BcpVideo } from '@/lib/notion'
import { youTubeVideoId, youTubeEmbedUrl, youTubeThumbnail } from '@/lib/site'

/* ------------------------------------------------------------------ */
/* Event recap card. The play button swaps the still for an inline     */
/* YouTube player, so the recap plays without leaving the gallery.     */
/* Cards whose Notion row has no YouTube URL show the still only.      */
/* ------------------------------------------------------------------ */

export function RecapCard({ video, background }: { video: BcpVideo; background: string }) {
  const [playing, setPlaying] = useState(false)
  const videoId = youTubeVideoId(video.url)
  const thumb = video.thumbnail ?? (videoId ? youTubeThumbnail(videoId) : null)

  return (
    <div
      className="flex flex-col border-[6px] border-[#2b3034] p-[25px]"
      style={{ backgroundColor: background }}
    >
      <div className="relative h-[416px] w-full bg-[#2b3034]">
        {playing && videoId ? (
          <iframe
            src={`${youTubeEmbedUrl(videoId)}&autoplay=1`}
            title={`${video.title} recap`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="size-full"
          />
        ) : (
          <>
            {thumb && (
              // Notion files and YouTube stills are remote/expiring URLs
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumb} alt={`${video.title} recap`} className="size-full object-cover" />
            )}
            <div className="absolute inset-0 bg-[rgba(43,48,52,0.4)]" />
            {/* Corner location tag */}
            {video.location && (
              <span className="absolute right-0 top-0 flex h-[41px] w-[116px] items-center justify-center rounded-bl-[20px] bg-[#f5c256] px-2.5 py-[5px] text-[24px] font-medium leading-[30px] text-white [font-family:var(--font-hepta-slab)]">
                {video.location}
              </span>
            )}
            {videoId && (
              <button
                type="button"
                aria-label={`Play ${video.title} recap`}
                onClick={() => setPlaying(true)}
                className="absolute left-1/2 top-1/2 size-[138px] -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-105"
              >
                <img src="/bcp/play-icon.svg" alt="" className="size-full" />
              </button>
            )}
          </>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-1">
        <p className="text-[24px] font-medium leading-[30px] text-[#2b3034] [font-family:var(--font-hepta-slab)]">
          {video.title}
        </p>
        <p className="text-[24px] text-[#2b3034] [font-family:var(--font-raleway)]">
          {video.subtitle || 'Recap'}
        </p>
      </div>
    </div>
  )
}
