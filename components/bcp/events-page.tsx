import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Calendar, BadgeCheck, ArrowRight } from 'lucide-react'
import { BrutalButton, JoinCommunity, BcpFooter } from '@/components/bcp/ui'
import { EventsCalendar } from '@/components/bcp/events-calendar'
import { HostApplication } from '@/components/bcp/host-application'
import { getUpcomingFlagship, getMiniEvents, getPastEvents, type BcpEvent } from '@/lib/notion'
import { SPEAKER_MAILTO, REGISTER_MAILTO } from '@/lib/site'

/* ------------------------------------------------------------------ */
/* Header + hero photo with floating register bar                      */
/* ------------------------------------------------------------------ */

function formatMonthYear(date: string | null) {
  if (!date) return 'Date to be announced'
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

async function EventsHero() {
  const event = await getUpcomingFlagship()
  const year = event.date ? event.date.slice(0, 4) : ''
  return (
    <section className="bg-[#fbfbfb] pb-[110px]">
      <div className="mx-auto flex max-w-[1345px] flex-col gap-6 px-6 pt-[42px] lg:flex-row lg:items-start lg:justify-between lg:gap-0">
        <h1 className="max-w-[704px] text-[44px] font-bold leading-[1.25] tracking-[0.01em] text-[#1b2021] [font-family:var(--font-hepta-slab)] md:text-[68px]">
          BCP Origins {year}-
          <br />
          {event.city} Edition
        </h1>
        <div className="flex items-start gap-3 lg:mt-[114px]">
          <span aria-hidden className="mt-[14px] h-[3px] w-[30px] shrink-0 bg-[#e0a46e]" />
          <p className="max-w-[533px] text-[18px] leading-7 text-[#2b3034] [font-family:var(--font-raleway)]">
            {event.summary}
          </p>
        </div>
      </div>
      <div className="relative mx-auto mt-7 max-w-[1392px] px-6 lg:px-0">
        <div className="relative h-[300px] border-[6px] border-[#2b3034] md:h-[523px]">
          <Image
            src="/bcp/events-hero.png"
            alt="Audience at a BCP Origins event"
            fill
            priority
            sizes="(min-width: 1440px) 1392px, 100vw"
            className="object-cover object-bottom"
          />
        </div>
        {/* Floating location / date / register bar */}
        <div className="relative z-10 -mt-14 ml-auto flex w-fit max-w-full flex-col items-start gap-4 border-[6px] border-[#2b3034] bg-white py-[17px] pl-[42px] pr-[17px] shadow-[0px_13px_24px_rgba(86,86,86,0.1)] sm:flex-row sm:items-center sm:gap-[57px] lg:mr-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-[39px]">
            <span className="flex items-center gap-2.5 p-2.5">
              <MapPin className="size-6 text-[#2b3034]" strokeWidth={1.75} />
              <span className="text-[18px] font-semibold leading-7 text-[#2b3034] [font-family:var(--font-raleway)]">
                {event.city}, Nigeria
              </span>
            </span>
            <span className="flex items-center gap-2.5 p-2.5">
              <Calendar className="size-6 text-[#2b3034]" strokeWidth={1.75} />
              <span className="text-[18px] font-semibold leading-7 text-[#2b3034] [font-family:var(--font-raleway)]">
                {formatMonthYear(event.date)}
              </span>
            </span>
          </div>
          <BrutalButton href={event.url || REGISTER_MAILTO} className="h-[48px] w-[220px]">
            Register
          </BrutalButton>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Past Events                                                         */
/* ------------------------------------------------------------------ */

function formatFullDate(date: string | null) {
  if (!date) return ''
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function PastEventCard({ event }: { event: BcpEvent }) {
  return (
    <article className="flex w-[351px] shrink-0 flex-col border-[6px] border-[#2b3034] bg-[#fbfbfb] p-5 shadow-[0px_18px_40px_rgba(0,0,0,0.22)]">
      {event.cover ? (
        // Notion covers are short-lived signed URLs, so plain img is used here
        // eslint-disable-next-line @next/next/no-img-element
        <img src={event.cover} alt={event.title} className="h-[216px] w-full object-cover" />
      ) : (
        <div className="h-[216px] w-full bg-[#d9d9d9]" />
      )}
      <p className="mt-3.5 flex items-center gap-2.5 text-[15px] text-black [font-family:var(--font-raleway)]">
        {formatFullDate(event.date)}
        {event.city && (
          <>
            <span>|</span> {event.city}
          </>
        )}
      </p>
      <h3 className="mt-3 max-w-[300px] text-[20px] font-semibold leading-7 text-black [font-family:var(--font-hepta-slab)]">
        {event.title}
      </h3>
      <p className="mt-3 line-clamp-3 text-[16px] leading-[27px] text-[#231f20] [font-family:var(--font-raleway)]">
        {event.summary}
      </p>
      {event.url && (
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center gap-2.5 text-[18px] text-[#1c75bc] [font-family:var(--font-raleway)] hover:underline"
        >
          View More <ArrowRight className="size-4" />
        </a>
      )}
    </article>
  )
}

async function PastEvents() {
  const events = await getPastEvents()
  return (
    <section className="relative overflow-hidden bg-[#fbfbfb] pb-[64px]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[92px]">
        <h2 className="text-[36px] font-bold leading-[48px] text-[#121212] [font-family:var(--font-hepta-slab)]">
          Past Events
        </h2>
      </div>
      {events.length > 0 ? (
        <div className="mt-[62px] flex gap-[48px] overflow-x-auto px-6 pb-8 lg:px-[84px]">
          {events.map((event) => (
            <PastEventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        // Nothing archived in Notion yet — point at the gallery rather than
        // filling the row with placeholder cards
        <div className="mt-10 px-6 lg:px-[92px]">
          <p className="max-w-[640px] text-[18px] leading-7 text-[#2b3034] [font-family:var(--font-raleway)]">
            Recaps of past editions live in the{' '}
            <Link href="/gallery" className="text-[#1c75bc] hover:underline">
              gallery
            </Link>{' '}
            while this archive is being put together.
          </p>
        </div>
      )}
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Mini Experiences + calendar                                         */
/* ------------------------------------------------------------------ */

async function MiniExperiences() {
  const events = await getMiniEvents()
  // Resolved server-side so the calendar's first client render matches
  const now = new Date()
  const today = now.toISOString().slice(0, 10)
  return (
    <section className="relative overflow-hidden bg-[#fbfbfb] py-[71px]">
      <img
        src="/bcp/wave-2.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-60"
      />
      <div className="relative mx-auto flex max-w-[1140px] flex-col gap-[60px] px-6 lg:px-0">
        <div className="mx-auto flex max-w-[658px] flex-col gap-2.5 text-center">
          <h2 className="text-[36px] font-bold leading-[48px] text-[#121212] [font-family:var(--font-hepta-slab)]">
            BCP Origins Mini Experiences
          </h2>
          <p className="text-[18px] leading-[27px] text-[#2b3034] [font-family:var(--font-raleway)]">
            Explore our smaller, focused community events happening throughout the year. Connect
            with peers, learn new skills, stay engaged with the BCP community
          </p>
        </div>
        <EventsCalendar
          events={events}
          today={today}
          initialYear={now.getUTCFullYear()}
          initialMonth={now.getUTCMonth()}
        />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Become a Speaker                                                    */
/* ------------------------------------------------------------------ */

const SPEAKER_CRITERIA = [
  {
    title: 'Industry Experience',
    body: 'You’re an operator, founder or career professional with valuable experience to share.',
  },
  {
    title: 'Engaging Storyteller',
    body: 'You can deliver practical insights through strong storytelling.',
  },
  {
    title: 'Community Focused',
    body: 'You are passionate about youth development and community building.',
  },
]

function BecomeSpeaker() {
  return (
    <section className="relative overflow-hidden bg-[#fbfbfb] py-[87px]">
      <div className="relative mx-auto flex max-w-[1360px] flex-col gap-12 px-6 lg:flex-row lg:items-start lg:justify-between lg:px-[110px]">
        <div className="flex max-w-[687px] flex-col gap-6">
          <div className="flex flex-col">
            <h2 className="text-[36px] font-semibold leading-[48px] text-[#121212] [font-family:var(--font-hepta-slab)]">
              Become a Speaker
            </h2>
            <p className="text-[18px] leading-[27px] text-[#2b3034] [font-family:var(--font-raleway)]">
              Share your expertise and inspire the next generation of leaders. We&rsquo;re looking
              for passionate individuals to join our lineup of speakers.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            {SPEAKER_CRITERIA.map(({ title, body }) => (
              <div key={title} className="flex items-center gap-2.5">
                <BadgeCheck className="size-[30px] shrink-0 text-[#2b3034]" strokeWidth={1.75} />
                <div className="flex flex-col">
                  <h3 className="text-[20px] font-semibold leading-[48px] text-[#121212] [font-family:var(--font-raleway)]">
                    {title}
                  </h3>
                  <p className="max-w-[600px] text-[18px] leading-[27px] text-[#2b3034] [font-family:var(--font-raleway)]">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <BrutalButton href={SPEAKER_MAILTO} className="h-[60px] w-[232px]">
            Apply to Speak
          </BrutalButton>
        </div>
        {/* To feature a named industry leader here, replace
            public/bcp/speaker.png and update the alt text and caption below. */}
        <figure className="relative w-full max-w-[522px] lg:w-[522px] lg:shrink-0">
          <div className="relative h-[420px] w-full border-[6px] border-[#2b3034] lg:h-[583px]">
            <Image
              src="/bcp/speaker.png"
              alt="Speaker on stage at a BCP Origins event"
              fill
              sizes="(min-width: 1024px) 522px, 100vw"
              className="object-cover"
            />
          </div>
        </figure>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Host a BCP Regional Event                                           */
/* ------------------------------------------------------------------ */

function HostEvent() {
  return (
    <section id="host-application" className="relative overflow-hidden bg-[#fbfbfb] pb-[17px]">
      <img
        src="/bcp/wave-1.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-40"
      />
      <div className="relative mx-auto flex max-w-[643px] flex-col items-center gap-10 border-[6px] border-[#2b3034] bg-[#91bd86] p-6 md:p-10">
        <div className="flex flex-col text-center">
          <h2 className="text-[32px] font-semibold leading-[48px] text-[#121212] [font-family:var(--font-hepta-slab)] md:text-[36px]">
            Host a BCP Regional Event
          </h2>
          <p className="text-[18px] leading-[27px] text-[#2b3034] [font-family:var(--font-raleway)]">
            Bring the BCP Origins experience to your city. We&rsquo;re looking for passionate
            community leaders to help us expand our reach.
          </p>
        </div>
        <HostApplication source="Events page" submitLabel="Apply Now" />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

export function BcpEventsPage() {
  return (
    <main className="min-h-screen bg-[#fbfbfb]">
      <EventsHero />
      <PastEvents />
      <MiniExperiences />
      <BecomeSpeaker />
      <HostEvent />
      <JoinCommunity />
      <BcpFooter />
    </main>
  )
}
