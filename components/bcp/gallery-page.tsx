import Image from 'next/image'
import { BcpHero, JoinCommunity, BcpFooter } from '@/components/bcp/ui'
import { VideoHighlights } from '@/components/bcp/video-highlights'
import { GalleryCollage } from '@/components/bcp/gallery-collage'
import { getGalleryEditions } from '@/lib/notion'

/* ------------------------------------------------------------------ */
/* Video Highlights                                                    */
/* ------------------------------------------------------------------ */

function VideoHighlightsSection() {
  return (
    <section className="relative overflow-hidden bg-[#fbfbfb] py-[37px]">
      <img
        src="/bcp/wave-2.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-50"
      />
      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-[45px] px-6 lg:px-[73px]">
        <h2 className="text-[36px] font-bold text-[#2b3034] [font-family:var(--font-hepta-slab)]">
          Video Highlights
        </h2>
        <VideoHighlights />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Event Recaps                                                        */
/* ------------------------------------------------------------------ */

const RECAPS = [
  { title: 'BCP’25 Akure', location: 'Akure', bg: '#91bd86', photo: '/bcp/recap-akure.png' },
  { title: 'BCP’25 Kaduna', location: 'Kaduna', bg: '#a3d0d9', photo: '/bcp/recap-kaduna.png' },
  { title: 'BCP’25 Calabar', location: 'Calabar', bg: '#d6924d', photo: '/bcp/partner-photo-2.png' },
]

function EventRecaps() {
  return (
    <section className="bg-[#fbfbfb] py-[50px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-[45px] px-6 lg:px-[73px]">
        <h2 className="text-[36px] font-bold text-[#2b3034] [font-family:var(--font-hepta-slab)]">
          Event Recaps
        </h2>
        <div className="grid grid-cols-1 gap-9 px-0 md:grid-cols-3 lg:px-[18px]">
          {RECAPS.map(({ title, location, bg, photo }) => (
            <div
              key={title}
              className="flex flex-col border-[6px] border-[#2b3034] p-[25px]"
              style={{ backgroundColor: bg }}
            >
              <div className="relative h-[416px] w-full">
                <Image src={photo} alt={`${title} recap video`} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                <div className="absolute inset-0 bg-[rgba(43,48,52,0.4)]" />
                {/* Corner location tag */}
                <span className="absolute right-0 top-0 flex h-[41px] w-[116px] items-center justify-center rounded-bl-[20px] bg-[#f5c256] px-2.5 py-[5px] text-[24px] font-medium leading-[30px] text-white [font-family:var(--font-hepta-slab)]">
                  {location}
                </span>
                {/* Play icon */}
                <button
                  type="button"
                  aria-label={`Play ${title} recap`}
                  className="absolute left-1/2 top-1/2 size-[138px] -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-105"
                >
                  <img src="/bcp/play-icon.svg" alt="" className="size-full" />
                </button>
              </div>
              <div className="mt-4 flex flex-col gap-1">
                <p className="text-[24px] font-medium leading-[30px] text-[#2b3034] [font-family:var(--font-hepta-slab)]">
                  {title}
                </p>
                <p className="text-[24px] text-[#2b3034] [font-family:var(--font-raleway)]">Recap</p>
              </div>
            </div>
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
