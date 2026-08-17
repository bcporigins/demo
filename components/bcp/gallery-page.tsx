import { Youtube } from 'lucide-react'
import { BcpHero, BrutalButton, JoinCommunity, BcpFooter } from '@/components/bcp/ui'
import { VideoHighlights } from '@/components/bcp/video-highlights'
import { RecapCard } from '@/components/bcp/recap-card'
import { GalleryCollage } from '@/components/bcp/gallery-collage'
import { getGalleryEditions, getVideos } from '@/lib/notion'
import { YOUTUBE_CHANNEL } from '@/lib/site'

/* ------------------------------------------------------------------ */
/* Video Highlights                                                    */
/* ------------------------------------------------------------------ */

async function VideoHighlightsSection() {
  const videos = await getVideos('Highlight')
  return (
    <section className="relative overflow-hidden bg-[#fbfbfb] py-[37px]">
      <img
        src="/bcp/wave-2.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-50"
      />
      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-[45px] px-6 lg:px-[73px]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-[36px] font-bold text-[#2b3034] [font-family:var(--font-hepta-slab)]">
            Video Highlights
          </h2>
          <BrutalButton href={YOUTUBE_CHANNEL} variant="beige" className="gap-2.5 text-[16px]">
            <Youtube className="size-5" strokeWidth={1.75} /> Our YouTube channel
          </BrutalButton>
        </div>
        <VideoHighlights videos={videos} />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Event Recaps                                                        */
/* ------------------------------------------------------------------ */

// Card backgrounds cycle through the BCP palette in the order set in Figma
const RECAP_BACKGROUNDS = ['#91bd86', '#a3d0d9', '#d6924d']

async function EventRecaps() {
  const recaps = await getVideos('Recap')
  return (
    <section className="bg-[#fbfbfb] py-[50px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-[45px] px-6 lg:px-[73px]">
        <h2 className="text-[36px] font-bold text-[#2b3034] [font-family:var(--font-hepta-slab)]">
          Event Recaps
        </h2>
        <div className="grid grid-cols-1 gap-9 px-0 md:grid-cols-3 lg:px-[18px]">
          {recaps.map((video, i) => (
            <RecapCard
              key={video.id}
              video={video}
              background={RECAP_BACKGROUNDS[i % RECAP_BACKGROUNDS.length]}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

export async function BcpGalleryPage() {
  const editions = await getGalleryEditions()
  return (
    <main className="min-h-screen bg-[#fbfbfb]">
      <BcpHero
        title="Our Journey in Pixels"
        subtitle="Our annual multi-location event gathers hundreds of young Africans for deep career insights, high-value conversations, and transformative learning."
        subtitleSize="sm"
      />
      <GalleryCollage editions={editions} />
      <VideoHighlightsSection />
      <EventRecaps />
      <JoinCommunity />
      <BcpFooter />
    </main>
  )
}
