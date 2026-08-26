import Image from 'next/image'
import {
  Users,
  Globe,
  BriefcaseBusiness,
  Speech,
  Award,
  Building2,
  CalendarDays,
  MapPin,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { JoinCommunity, BcpFooter, BrutalButton } from '@/components/bcp/ui'
import { PartnerMarquee } from '@/components/bcp/partner-marquee'
import { FaqAccordion } from '@/components/bcp/faq'
import {
  getFaqs,
  getStats,
  getTestimonials,
  getPartners,
  getUpcomingFlagship,
  type Stat,
} from '@/lib/notion'
import { WHATSAPP_COMMUNITY, REGISTER_MAILTO } from '@/lib/site'

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function HomeHero() {
  return (
    <section className="relative min-h-[770px] overflow-hidden bg-[#2b3034]">
      <Image
        src="/bcp/hero-photo.png"
        alt="Crowd at a BCP event"
        fill
        priority
        sizes="100vw"
        className="object-cover object-bottom"
      />
      <div aria-hidden className="absolute inset-0 bg-black/30" />
      <div className="relative mx-auto flex min-h-[770px] w-full max-w-[1253px] flex-col justify-center gap-6 px-6 py-24 lg:px-0">
        <div className="flex max-w-[680px] flex-col gap-2.5 bg-[rgba(128,113,86,0.04)] backdrop-blur-[2px] md:max-w-[780px]">
          {/* Three fixed lines from md up, where the longest one fits on one
              row; below that the phrases wrap naturally to stay readable. */}
          <h1 className="text-[40px] font-bold leading-[1.25] tracking-[0.01em] text-[#fbfbfb] [font-family:var(--font-hepta-slab)] sm:text-[52px] md:text-[62px]">
            <span className="block md:whitespace-nowrap">
              <span className="text-[#fed07b]">Building</span> the
            </span>
            <span className="block md:whitespace-nowrap">Next Generation</span>
            <span className="block md:whitespace-nowrap">Of African Talents</span>
          </h1>
          <p className="max-w-[553px] text-[20px] font-medium leading-7 text-[#ebe8e3] [font-family:var(--font-raleway)] md:text-[24px]">
            A global community empowering young Africans with the knowledge, network, and
            opportunities to build exceptional careers.
          </p>
        </div>
        <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center">
          <BrutalButton href="/events" className="h-[64px]">
            Register for Upcoming Events
          </BrutalButton>
          <BrutalButton href={WHATSAPP_COMMUNITY} variant="white" className="h-[64px]">
            Join Our Community
          </BrutalButton>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* BCP events across the world — staggered collage of stats + photos   */
/* ------------------------------------------------------------------ */

type Tile = { kind: 'stat'; statIndex: number } | { kind: 'photo'; src: string }

// Six columns of two tiles; offsets recreate the checkerboard stagger in
// Figma. The four stat slots are filled, in order, from the Notion Stats
// table so the numbers can be refreshed each year without a code change.
const COLLAGE: { offset: number; tiles: [Tile, Tile] }[] = [
  {
    offset: 32,
    tiles: [
      { kind: 'stat', statIndex: 0 },
      { kind: 'photo', src: '/bcp/collage-2.png' },
    ],
  },
  {
    offset: 56,
    tiles: [
      { kind: 'photo', src: '/bcp/collage-1.png' },
      { kind: 'photo', src: '/bcp/collage-3.png' },
    ],
  },
  {
    offset: 0,
    tiles: [
      { kind: 'photo', src: '/bcp/collage-4.png' },
      { kind: 'stat', statIndex: 1 },
    ],
  },
  {
    offset: 24,
    tiles: [
      { kind: 'stat', statIndex: 2 },
      { kind: 'photo', src: '/bcp/collage-5.png' },
    ],
  },
  {
    offset: 32,
    tiles: [
      { kind: 'photo', src: '/bcp/collage-6.png' },
      { kind: 'photo', src: '/bcp/collage-8.png' },
    ],
  },
  {
    offset: 56,
    tiles: [
      { kind: 'photo', src: '/bcp/collage-7.png' },
      { kind: 'stat', statIndex: 3 },
    ],
  },
]

// Icon names authors can choose from the Notion "Icon" select column
const STAT_ICONS: Record<string, LucideIcon> = {
  users: Users,
  globe: Globe,
  briefcase: BriefcaseBusiness,
  speech: Speech,
  award: Award,
  building: Building2,
  calendar: CalendarDays,
  location: MapPin,
  sparkles: Sparkles,
}

const TILE_SHADOW =
  'shadow-[0px_8px_8px_rgba(96,106,92,0.09),0px_2px_4px_rgba(96,106,92,0.1)]'

function CollageTile({ tile, stats }: { tile: Tile; stats: Stat[] }) {
  if (tile.kind === 'photo') {
    return (
      <div className={`relative h-[207px] w-full border-[6px] border-[#2b3034] ${TILE_SHADOW}`}>
        <Image src={tile.src} alt="BCP event" fill sizes="207px" className="object-cover" />
      </div>
    )
  }
  const stat = stats[tile.statIndex]
  // Fewer stats in Notion than slots in the collage: show a photo instead
  if (!stat) {
    return (
      <div className={`relative h-[207px] w-full border-[6px] border-[#2b3034] ${TILE_SHADOW}`}>
        <Image src="/bcp/collage-3.png" alt="BCP event" fill sizes="207px" className="object-cover" />
      </div>
    )
  }
  const Icon = STAT_ICONS[stat.icon] ?? Users
  return (
    // min-h rather than a fixed height: a long label like "Countries reached
    // (Nigeria, UK, Canada, Cyprus)" wraps to five lines on a phone and used
    // to spill out through the bottom border.
    <div
      className={`flex min-h-[212px] w-full flex-col items-center justify-center gap-2 border-[6px] border-black bg-[#fbfbfb] p-5 ${TILE_SHADOW}`}
    >
      <Icon className="size-[44px] shrink-0 text-[#2b3034]" strokeWidth={1.5} />
      <p className="text-center text-[32px] font-semibold leading-tight tracking-[0.01em] text-[#2b3034] [font-family:var(--font-hepta-slab)]">
        {stat.value}
      </p>
      <p className="text-balance text-center text-[16px] leading-[22px] tracking-[0.01em] text-[#828282] [font-family:var(--font-raleway)] md:text-[18px] md:leading-6">
        {stat.label}
      </p>
    </div>
  )
}

async function EventsCollage() {
  const stats = await getStats()
  return (
    <section className="relative overflow-hidden bg-[#fbfbfb] py-[54px]">
      <img
        src="/bcp/wave-1.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-60"
      />
      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-12 px-6 lg:px-10">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-[32px] font-bold text-[#121212] [font-family:var(--font-hepta-slab)]">
            BCP events across the world
          </h2>
          <p className="text-[22px] text-[#414141] [font-family:var(--font-raleway)]">
            Diverse young people, energy, conversations.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 pb-[56px] sm:grid-cols-3 lg:grid-cols-6">
          {COLLAGE.map(({ offset, tiles }, i) => (
            <div key={i} className="flex flex-col gap-6" style={{ transform: `translateY(${offset}px)` }}>
              <CollageTile tile={tiles[0]} stats={stats} />
              <CollageTile tile={tiles[1]} stats={stats} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* What is BCP Origins?                                                */
/* ------------------------------------------------------------------ */

function WhatIsBcp() {
  return (
    <section className="relative overflow-hidden bg-[#fbfbfb] py-[46px]">
      <img
        src="/bcp/wave-2.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-60"
      />
      <div className="relative mx-auto flex max-w-[1253px] flex-col items-center gap-10 px-6 lg:flex-row lg:items-center lg:gap-0 lg:px-0">
        <div className="z-10 flex flex-col justify-center gap-10 border-[6px] border-[#2b3034] bg-[#fbfbfb] p-6 shadow-[0px_43px_21.5px_rgba(181,203,174,0.09),0px_11px_12px_rgba(181,203,174,0.1)] lg:-mr-24 lg:min-h-[452px] lg:max-w-[720px]">
          <h2 className="text-[36px] font-bold leading-[48px] text-[#121212] [font-family:var(--font-hepta-slab)]">
            What is BCP Origins?
          </h2>
          <div className="max-w-[672px] space-y-4 text-justify text-[20px] leading-9 text-[#414141] [font-family:var(--font-raleway)] md:text-[24px]">
            <p>
              BCP Origins is a social impact organization building a community of young people
              equipped with the skills, network, and opportunities to thrive in today&rsquo;s
              economy and shape the future.
            </p>
            <p>
              We started in Akure, Nigeria, in 2022 with 120 attendees, and today, BCP spans
              multiple cities and countries, bridging the talent gap across Africa.
            </p>
          </div>
        </div>
        <div className="relative h-[420px] w-full max-w-[423px] border-[6px] border-[#2b3034] lg:h-[609px] lg:w-[423px] lg:shrink-0">
          <Image
            src="/bcp/what-is-bcp.png"
            alt="BCP attendees holding an Accessing Global Opportunities banner"
            fill
            sizes="(min-width: 1024px) 423px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Upcoming Event                                                      */
/* ------------------------------------------------------------------ */

/** "Lagos Edition  || October 2026" from a city and an ISO date. */
export function formatEditionLine(city: string, date: string | null) {
  const when = date
    ? new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : ''
  return [city && `${city} Edition`, when].filter(Boolean).join(' || ')
}

async function UpcomingEvent() {
  const event = await getUpcomingFlagship()
  return (
    <section className="bg-[#fbfbfb] px-6 py-[18px] lg:px-[46px]">
      <div className="mx-auto flex max-w-[1348px] flex-col items-center gap-4 border-[6px] border-[#2b3034] px-6 py-10 text-center">
        <h2 className="text-[36px] font-bold leading-[48px] text-[#2b3034] [font-family:var(--font-hepta-slab)]">
          Upcoming Event
        </h2>
        <p className="text-[32px] font-bold leading-[44.6px] text-[#80bfcf] [font-family:var(--font-hepta-slab)]">
          {event.title}
        </p>
        <p className="text-[52px] font-bold leading-[1.1] tracking-[0.01em] text-[#2b3034] [font-family:var(--font-hepta-slab)] md:text-[96px]">
          {event.tagline}
        </p>
        <p className="text-[20px] font-medium text-[#2b3034] [font-family:var(--font-raleway)] md:text-[24px]">
          {formatEditionLine(event.city, event.date)}
        </p>
        <BrutalButton href={event.url || REGISTER_MAILTO} className="mt-4 h-[64px] text-[24px]">
          Register
        </BrutalButton>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

// Repeated words alternate teal/gold along each arc, as in the Figma text-paths
function WatermarkText({ pathId, count = 6 }: { pathId: string; count?: number }) {
  return (
    <text
      className="[font-family:var(--font-hepta-slab)]"
      fontSize="44"
      fontWeight="700"
      letterSpacing="2"
      opacity="0.5"
    >
      <textPath href={`#${pathId}`}>
        {Array.from({ length: count }).map((_, i) => (
          <tspan key={i} fill={i % 2 === 0 ? '#8fc2ce' : '#ecd09b'}>
            {'TESTIMONIALS '}
          </tspan>
        ))}
      </textPath>
    </text>
  )
}

function TestimonialWatermark() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full"
      viewBox="0 0 1440 513"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Left ellipse: steep limb climbing from bottom-left, cresting top-left */}
        <path
          id="bcp-wm-left"
          d="M 150 640 C 230 380 320 150 560 45 C 800 -55 1040 -25 1300 90"
          fill="none"
        />
        {/* Right ellipse: steep limb beside the middle card, cresting top-right */}
        <path
          id="bcp-wm-right"
          d="M 900 660 C 950 420 1010 160 1230 55 C 1450 -45 1680 -5 1900 120"
          fill="none"
        />
        {/* Bottom arc grazing the lower edge */}
        <path id="bcp-wm-bottom" d="M 480 600 C 680 470 920 470 1140 600" fill="none" />
      </defs>
      <WatermarkText pathId="bcp-wm-left" />
      <WatermarkText pathId="bcp-wm-right" />
      <WatermarkText pathId="bcp-wm-bottom" count={4} />
    </svg>
  )
}

async function Testimonials() {
  const testimonials = await getTestimonials()
  if (testimonials.length === 0) return null
  return (
    <section className="relative overflow-hidden bg-[#fbfbfb] py-[90px]">
      <TestimonialWatermark />
      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-[68px] px-6 lg:px-[110px]">
        <h2 className="text-[32px] font-bold uppercase text-[#121212] [font-family:var(--font-hepta-slab)]">
          Testimonials
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="flex flex-col gap-2.5 border-4 border-[#2b3034] bg-[#fbfbfb] p-5 shadow-[0px_8px_4px_rgba(96,106,92,0.09),0px_2px_2px_rgba(96,106,92,0.1)]"
            >
              <Image src="/bcp/quote.png" alt="" width={48} height={48} aria-hidden />
              <p className="text-[22px] tracking-[0.01em] text-[#828282] [font-family:var(--font-raleway)] md:text-[24px]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-2 flex items-start gap-1.5">
                {/* Notion file URLs are short-lived signed links, so these
                    portraits use a plain img rather than next/image */}
                <span className="relative size-[48px] shrink-0 overflow-hidden rounded-full border-2 border-black bg-[#e5e7eb]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.photo} alt={t.name} className="size-full object-cover" />
                </span>
                <span className="flex flex-col gap-[7px] text-[18px] tracking-[0.01em] text-[#828282] [font-family:var(--font-raleway)]">
                  <span className="font-semibold">{t.name}</span>
                  <span>{t.role}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Partners — marquee rows                                             */
/* ------------------------------------------------------------------ */

async function Partners() {
  const partners = await getPartners()
  return (
    <section className="relative overflow-hidden bg-[#fbfbfb] py-[60px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-14 px-6 lg:flex-row lg:items-start lg:gap-0 lg:px-[110px]">
        <div className="flex flex-col gap-5 lg:w-[55%] lg:pr-12">
          <p className="text-[16px] leading-[34.6px] text-[#2b3034] [font-family:var(--font-raleway)]">
            Our Partners
          </p>
          <h2 className="text-[36px] font-bold leading-[1.2] text-[#2b3034] [font-family:var(--font-hepta-slab)]">
            Trusted By
            <br />
            Industry Leaders
          </h2>
          <p className="max-w-[708px] text-[20px] leading-9 text-[#414141] [font-family:var(--font-raleway)] md:text-[23px]">
            BCP Origins is a social impact organization building a community of young people
            equipped with the skills, network, and opportunities to thrive in today&rsquo;s economy
            and shape the future.
            <br />
            We started in Akure, Nigeria, in 2022 with 120 attendees, and today, BCP spans multiple
            cities and countries, bridging the talent gap across Africa.
          </p>
          <BrutalButton
            href="/partners#partnership-inquiry"
            className="mt-6 h-[76px] w-[206px] text-[16.4px] tracking-[0.01em]"
          >
            Partner with Us
          </BrutalButton>
        </div>
        <div className="relative lg:w-[45%]">
          <PartnerMarquee partners={partners} />
          {/* White fade so logos appear to emerge from the text side, as in Figma */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden lg:block"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgb(255,255,255) 0%, rgba(255,255,255,0) 35%)',
            }}
          />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* FAQs                                                                */
/* ------------------------------------------------------------------ */


async function Faqs() {
  const faqs = await getFaqs()
  return (
    <section id="faqs" className="relative overflow-hidden bg-[#fbfbfb] py-[60px]">
      <img
        src="/bcp/wave-1.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-40"
      />
      <div className="relative mx-auto flex max-w-[787px] flex-col gap-[48px] px-6">
        <h2 className="text-center text-[28px] font-bold text-[#121212] [font-family:var(--font-hepta-slab)]">
          Frequently Asked Questions (FAQs)
        </h2>
        <FaqAccordion items={faqs} defaultOpen={1} />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

export function BcpHomePage() {
  return (
    <main className="min-h-screen bg-[#fbfbfb]">
      <HomeHero />
      <EventsCollage />
      <WhatIsBcp />
      <UpcomingEvent />
      <Testimonials />
      <Partners />
      <Faqs />
      <JoinCommunity />
      <BcpFooter />
    </main>
  )
}
