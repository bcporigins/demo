import Image from 'next/image'
import Link from 'next/link'
import {
  Users,
  Globe,
  BriefcaseBusiness,
  Speech,
  type LucideIcon,
} from 'lucide-react'
import { JoinCommunity, BcpFooter } from '@/components/bcp/ui'
import { FaqAccordion } from '@/components/bcp/faq'
import { getFaqs } from '@/lib/notion'

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function HeroButton({
  children,
  variant = 'yellow',
}: {
  children: React.ReactNode
  variant?: 'yellow' | 'white'
}) {
  return (
    <button
      className={`flex h-[64px] items-center justify-center rounded-[3px] border-2 border-[#1f1f1f] px-5 text-[18px] font-bold leading-7 text-[#2b3034] shadow-[4px_4px_0px_#1f1f1f] transition-transform [font-family:var(--font-raleway)] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1f1f1f] ${
        variant === 'yellow' ? 'bg-[#fed07b]' : 'bg-[#fbfbfb]'
      }`}
    >
      {children}
    </button>
  )
}

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
        <div className="flex max-w-[680px] flex-col gap-2.5 bg-[rgba(128,113,86,0.04)] backdrop-blur-[2px]">
          <h1 className="text-[44px] font-bold leading-[1.25] tracking-[0.01em] text-[#fbfbfb] [font-family:var(--font-hepta-slab)] md:text-[68px]">
            <span className="text-[#fed07b]">Building</span> the Next Generation of African
            Talent.
          </h1>
          <p className="max-w-[553px] text-[20px] font-medium leading-7 text-[#ebe8e3] [font-family:var(--font-raleway)] md:text-[24px]">
            A global community empowering young Africans with the knowledge, network, and
            opportunities to build exceptional careers.
          </p>
        </div>
        <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center">
          <HeroButton variant="yellow">Register for Upcoming Events</HeroButton>
          <HeroButton variant="white">Join Our Community</HeroButton>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* BCP events across the world — staggered collage of stats + photos   */
/* ------------------------------------------------------------------ */

type Tile =
  | { kind: 'stat'; icon: LucideIcon; value: string; label: string }
  | { kind: 'photo'; src: string }

// Six columns of two tiles; offsets recreate the checkerboard stagger in Figma
const COLLAGE: { offset: number; tiles: [Tile, Tile] }[] = [
  {
    offset: 32,
    tiles: [
      { kind: 'stat', icon: Users, value: '6000+', label: 'Young Africans impacted' },
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
      { kind: 'stat', icon: BriefcaseBusiness, value: '80%+', label: 'BCP alumni now work in leading organizations' },
    ],
  },
  {
    offset: 24,
    tiles: [
      { kind: 'stat', icon: Globe, value: '4', label: 'Countries reached (Nigeria, UK & more)' },
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
      { kind: 'stat', icon: Speech, value: '60+', label: 'Speakers hosted since 2022' },
    ],
  },
]

const TILE_SHADOW =
  'shadow-[0px_8px_8px_rgba(96,106,92,0.09),0px_2px_4px_rgba(96,106,92,0.1)]'

function CollageTile({ tile }: { tile: Tile }) {
  if (tile.kind === 'photo') {
    return (
      <div className={`relative h-[207px] w-full border-[6px] border-[#2b3034] ${TILE_SHADOW}`}>
        <Image src={tile.src} alt="BCP event" fill sizes="207px" className="object-cover" />
      </div>
    )
  }
  const Icon = tile.icon
  return (
    <div
      className={`flex h-[212px] w-full flex-col items-center gap-2.5 border-[6px] border-black bg-[#fbfbfb] p-5 ${TILE_SHADOW}`}
    >
      <Icon className="size-[44px] text-[#2b3034]" strokeWidth={1.5} />
      <p className="text-center text-[32px] font-semibold tracking-[0.01em] text-[#2b3034] [font-family:var(--font-hepta-slab)]">
        {tile.value}
      </p>
      <p className="text-center text-[18px] tracking-[0.01em] text-[#828282] [font-family:var(--font-raleway)]">
        {tile.label}
      </p>
    </div>
  )
}

function EventsCollage() {
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
              <CollageTile tile={tiles[0]} />
              <CollageTile tile={tiles[1]} />
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

function UpcomingEvent() {
  return (
    <section className="bg-[#fbfbfb] px-6 py-[18px] lg:px-[46px]">
      <div className="mx-auto flex max-w-[1348px] flex-col items-center gap-4 border-[6px] border-[#2b3034] px-6 py-10 text-center">
        <h2 className="text-[36px] font-bold leading-[48px] text-[#2b3034] [font-family:var(--font-hepta-slab)]">
          Upcoming Event
        </h2>
        <p className="text-[32px] font-bold leading-[44.6px] text-[#80bfcf] [font-family:var(--font-hepta-slab)]">
          BCP&rsquo;26
        </p>
        <p className="text-[52px] font-bold leading-[1.1] tracking-[0.01em] text-[#2b3034] [font-family:var(--font-hepta-slab)] md:text-[96px]">
          The Beginning of Tomorrow
        </p>
        <p className="text-[20px] font-medium text-[#2b3034] [font-family:var(--font-raleway)] md:text-[24px]">
          Lagos Edition&ensp;|| October 2026
        </p>
        <button className="mt-4 flex h-[64px] items-center justify-center rounded-[3px] border-2 border-[#1f1f1f] bg-[#fed07b] px-5 text-[24px] font-bold leading-7 text-[#2b3034] shadow-[4px_4px_0px_#1f1f1f] transition-transform [font-family:var(--font-raleway)] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1f1f1f]">
          Register
        </button>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

const TESTIMONIALS = [
  {
    quote: '“BCP changed how I think about career growth and gave me the clarity I needed.',
    name: 'Toluwase Olugbemiro',
    role: 'BCP Alumni',
  },
  {
    quote: '“BCP changed how I think about career growth and gave me the clarity I needed.',
    name: 'Toluwase Olugbemiro',
    role: 'BCP Alumni',
  },
  {
    quote: '“BCP changed how I think about career growth and gave me the clarity I needed.',
    name: 'Toluwase Olugbemiro',
    role: 'BCP Alumni',
  },
]

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

function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-[#fbfbfb] py-[90px]">
      <TestimonialWatermark />
      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-[68px] px-6 lg:px-[110px]">
        <h2 className="text-[32px] font-bold uppercase text-[#121212] [font-family:var(--font-hepta-slab)]">
          Testimonials
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="flex flex-col gap-2.5 border-4 border-[#2b3034] bg-[#fbfbfb] p-5 shadow-[0px_8px_4px_rgba(96,106,92,0.09),0px_2px_2px_rgba(96,106,92,0.1)]"
            >
              <Image src="/bcp/quote.png" alt="" width={48} height={48} aria-hidden />
              <p className="text-[22px] tracking-[0.01em] text-[#828282] [font-family:var(--font-raleway)] md:text-[24px]">
                {t.quote}
              </p>
              <div className="mt-2 flex items-start gap-1.5">
                <span className="relative size-[48px] overflow-hidden rounded-full border-2 border-black bg-[#e5e7eb]">
                  <Image src="/bcp/testimonial-avatar.png" alt={t.name} fill sizes="48px" className="object-contain" />
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

const PARTNER_LOGOS = [
  '/bcp/partner-1.png',
  '/bcp/partner-2.png',
  '/bcp/partner-3.png',
  '/bcp/partner-4.png',
  '/bcp/partner-5.png',
  '/bcp/partner-6.png',
]

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  // Content duplicated so the -50% translate loops seamlessly
  const logos = [...PARTNER_LOGOS, ...PARTNER_LOGOS]
  return (
    <div className="bcp-marquee-row overflow-hidden">
      <div className={`bcp-marquee flex w-max gap-[27px] ${reverse ? 'bcp-marquee-reverse' : ''}`}>
        {logos.map((src, i) => (
          <div key={i} className="flex h-[129px] w-[180px] items-center justify-center bg-[#ebe8e3]">
            <Image src={src} alt="Partner logo" width={120} height={86} className="object-contain" />
          </div>
        ))}
      </div>
    </div>
  )
}

function Partners() {
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
          <button className="mt-6 flex h-[76px] w-[206px] items-center justify-center rounded-[3px] border-2 border-[#1f1f1f] bg-[#fed07b] px-5 text-[16.4px] font-bold tracking-[0.01em] text-[#2b3034] shadow-[4px_4px_0px_#1f1f1f] transition-transform [font-family:var(--font-raleway)] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1f1f1f]">
            Partner with Us
          </button>
        </div>
        <div className="relative flex flex-col gap-[25px] lg:w-[45%]">
          <MarqueeRow />
          <MarqueeRow reverse />
          <MarqueeRow />
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
