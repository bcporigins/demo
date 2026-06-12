import Image from 'next/image'
import { MapPin, Calendar, BadgeCheck, ArrowRight } from 'lucide-react'
import { BrutalButton, JoinCommunity, BcpFooter } from '@/components/bcp/ui'
import { EventsCalendar } from '@/components/bcp/events-calendar'
import { HostApplyForm } from '@/components/bcp/host-apply-form'

/* ------------------------------------------------------------------ */
/* Header + hero photo with floating register bar                      */
/* ------------------------------------------------------------------ */

function EventsHero() {
  return (
    <section className="bg-[#fbfbfb] pb-[110px]">
      <div className="mx-auto flex max-w-[1345px] flex-col gap-6 px-6 pt-[42px] lg:flex-row lg:items-start lg:justify-between lg:gap-0">
        <h1 className="max-w-[704px] text-[44px] font-bold leading-[1.25] tracking-[0.01em] text-[#1b2021] [font-family:var(--font-hepta-slab)] md:text-[68px]">
          BCP Origins 2026-
          <br />
          Lagos Edition
        </h1>
        <div className="flex items-start gap-3 lg:mt-[114px]">
          <span aria-hidden className="mt-[14px] h-[3px] w-[30px] shrink-0 bg-[#e0a46e]" />
          <p className="max-w-[533px] text-[18px] leading-7 text-[#2b3034] [font-family:var(--font-raleway)]">
            Stakeholders Meeting, The Beginning of Tomorrow. Join us in Lagos in October 2026 for
            an inspiring gathering of minds.
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
                Lagos, Nigeria
              </span>
            </span>
            <span className="flex items-center gap-2.5 p-2.5">
              <Calendar className="size-6 text-[#2b3034]" strokeWidth={1.75} />
              <span className="text-[18px] font-semibold leading-7 text-[#2b3034] [font-family:var(--font-raleway)]">
                October, 2026
              </span>
            </span>
          </div>
          <BrutalButton className="h-[48px] w-[220px]">Register</BrutalButton>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Past Events                                                         */
/* ------------------------------------------------------------------ */

// Card copy is placeholder text in the design, kept verbatim
const PAST_EVENTS = Array.from({ length: 4 }).map(() => ({
  date: '20 March 0000',
  meta: '3 Contant',
  title: 'Contrary to popular belief Lorem Ipsum is not simply random',
  body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
}))

function PastEvents() {
  return (
    <section className="relative overflow-hidden bg-[#fbfbfb] pb-[64px]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[92px]">
        <h2 className="text-[36px] font-bold leading-[48px] text-[#121212] [font-family:var(--font-hepta-slab)]">
          Past Events
        </h2>
      </div>
      <div className="mt-[62px] flex gap-[48px] overflow-x-auto px-6 pb-8 lg:px-[84px]">
        {PAST_EVENTS.map((event, i) => (
          <article
            key={i}
            className="flex w-[351px] shrink-0 flex-col border-[6px] border-[#2b3034] bg-[#fbfbfb] p-5 shadow-[0px_18px_40px_rgba(0,0,0,0.22)]"
          >
            <div className="h-[216px] w-full bg-[#d9d9d9]" />
            <p className="mt-3.5 flex items-center gap-2.5 text-[15px] text-black [font-family:var(--font-raleway)]">
              {event.date} <span>|</span> {event.meta}
            </p>
            <h3 className="mt-3 max-w-[300px] text-[20px] font-semibold capitalize leading-7 text-black [font-family:var(--font-hepta-slab)]">
              {event.title}
            </h3>
            <p className="mt-3 text-[16px] leading-[27px] text-[#231f20] [font-family:var(--font-raleway)]">
              {event.body}
            </p>
            <a
              href="#"
              className="mt-5 flex items-center gap-2.5 text-[18px] text-[#1c75bc] [font-family:var(--font-raleway)] hover:underline"
            >
              View More <ArrowRight className="size-4" />
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Mini Experiences + calendar                                         */
/* ------------------------------------------------------------------ */

function MiniExperiences() {
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
        <EventsCalendar />
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
          <BrutalButton className="h-[60px] w-[232px]">Apply to Speak</BrutalButton>
        </div>
        <div className="relative h-[420px] w-full max-w-[522px] border-[6px] border-[#2b3034] lg:h-[583px] lg:w-[522px] lg:shrink-0">
          <Image
            src="/bcp/speaker.png"
            alt="Speaker on stage at a BCP event"
            fill
            sizes="(min-width: 1024px) 522px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Host a BCP Regional Event                                           */
/* ------------------------------------------------------------------ */

function FieldShell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex w-full flex-col gap-1">
      <span className="text-[20px] font-semibold leading-[27px] text-[#2b3034] [font-family:var(--font-raleway)]">
        {label}
      </span>
      {children}
    </label>
  )
}

const FIELD_CLASSES =
  'w-full rounded-[3px] border-2 border-[#1f1f1f] bg-[#fefefe] px-[35px] text-[14px] leading-5 text-[#2f363d] shadow-[4px_4px_0px_0px_#1f1f1f] [font-family:var(--font-raleway)] placeholder:text-[#9aa1a7] focus:outline-none focus:ring-2 focus:ring-[#fed07b]'

function HostEvent() {
  return (
    <section className="relative overflow-hidden bg-[#fbfbfb] pb-[17px]">
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
        <HostApplyForm source="Events page" submitLabel="Apply Now" />
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
