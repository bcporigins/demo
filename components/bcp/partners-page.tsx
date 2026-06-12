import Image from 'next/image'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { BcpHero, BrutalButton, JoinCommunity, BcpFooter } from '@/components/bcp/ui'

/* ------------------------------------------------------------------ */
/* Why partner — numbered benefits + overlapping photos                */
/* ------------------------------------------------------------------ */

const PARTNER_BENEFITS = [
  {
    title: 'Brand exposure',
    body: 'Showcase your brand to a targeted audience of ambitious young professionals.',
  },
  {
    title: 'Talent pipeline access',
    body: 'Connect with a pool of vetted, high-potential talent for your organization.',
  },
  {
    title: 'Community engagement',
    body: 'Engage directly with a vibrant community through events and workshops.',
  },
  {
    title: 'Data-driven insights',
    body: 'Leverage our insights to understand the next generation of African leaders.',
  },
  {
    title: 'Event visibility',
    body: 'Position your brand at the forefront of key industry events and gatherings.',
  },
]

function NumberedBenefits() {
  return (
    <section className="bg-[#fbfbfb] py-[70px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-16 px-6 lg:flex-row lg:items-start lg:justify-between lg:px-[123px]">
        <ol className="relative flex flex-col gap-[34px]">
          {/* Connecting line behind the number circles */}
          <span
            aria-hidden
            className="absolute bottom-[25px] left-[25px] top-[25px] w-px bg-[#133834]"
          />
          {PARTNER_BENEFITS.map(({ title, body }, i) => (
            <li key={title} className="relative flex items-start gap-[49px]">
              <span className="relative z-10 flex size-[50px] shrink-0 items-center justify-center rounded-full border border-[#133834] bg-white text-[36px] font-bold tracking-[0.01em] text-black shadow-[3px_4px_0px_#0e2624] [font-family:var(--font-hepta-slab)]">
                {i + 1}
              </span>
              <div className="max-w-[428px] pt-[-12px] tracking-[0.01em]">
                <h3 className="text-[18px] font-semibold text-[#2b3034] [font-family:var(--font-hepta-slab)]">
                  {title}
                </h3>
                <p className="mt-2 text-[18px] text-[#2b3034] [font-family:var(--font-raleway)]">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ol>
        {/* Overlapping photos */}
        <div className="relative mx-auto h-[420px] w-full max-w-[634px] lg:mx-0 lg:h-[532px] lg:w-[634px] lg:shrink-0">
          <div className="absolute right-0 top-0 h-[244px] w-[86%] overflow-hidden rounded-[3px] border-4 border-[#1f1f1f] shadow-[4px_4px_0px_0px_#1f1f1f] lg:h-[355px] lg:w-[544px]">
            <Image
              src="/bcp/partner-photo-1.png"
              alt="BCP partners and speakers on stage"
              fill
              sizes="(min-width: 1024px) 544px, 86vw"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 h-[244px] w-[86%] overflow-hidden rounded-[3px] border-4 border-[#1f1f1f] shadow-[4px_4px_0px_0px_#1f1f1f] lg:h-[355px] lg:w-[544px]">
            <Image
              src="/bcp/partner-photo-2.png"
              alt="Audience at a BCP event"
              fill
              sizes="(min-width: 1024px) 544px, 86vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Our partners — logo marquee (same treatment as the home page)      */
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

function OurPartners() {
  return (
    <section className="relative overflow-hidden bg-[#fbfbfb] py-[60px]">
      <img
        src="/bcp/wave-2.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-60"
      />
      <div className="relative mx-auto flex max-w-[1140px] flex-col gap-12 px-6">
        <h2 className="text-center text-[36px] font-bold tracking-[0.01em] text-[#2b3034] [font-family:var(--font-hepta-slab)]">
          Our partners
        </h2>
        <div className="relative flex flex-col gap-[25px] bg-white py-2 shadow-[inset_0px_0px_50px_0px_rgba(255,255,255,0.81)]">
          <MarqueeRow />
          <MarqueeRow reverse />
          <MarqueeRow />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Find the right partnership                                          */
/* ------------------------------------------------------------------ */

const PARTNERSHIPS = [
  {
    title: 'Event Sponsorship',
    body: 'Align your brand with our flagship events, conferences, and hackathons.',
  },
  {
    title: 'Community Sponsorship',
    body: 'Gain year round visibility and engagement as a key supporter of the BCP community.',
  },
  {
    title: 'Corporate Talent Development',
    body: 'Custom programs to upskill your team or build a bespoke talent pipeline.',
  },
  {
    title: 'Venue/ logistics Partnerships',
    body: 'Custom programs to upskill your team or build a bespoke talent pipeline.',
  },
  {
    title: 'Corporate Talent Development Programs',
    body: 'Custom programs to upskill your team or build a bespoke talent pipeline.',
  },
]

function FindPartnership() {
  return (
    <section className="bg-[#fbfbfb] py-[55px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-[75px]">
        <h2 className="px-6 text-center text-[36px] font-bold tracking-[0.01em] text-[#2b3034] [font-family:var(--font-hepta-slab)]">
          Find the right partnership for you
        </h2>
        {/* The 5th card runs off-canvas in the design — horizontal scroll row */}
        <div className="flex gap-10 overflow-x-auto px-6 pb-4 lg:px-[87px]">
          {PARTNERSHIPS.map(({ title, body }) => (
            <div
              key={title}
              className="flex min-h-[265px] w-[290px] shrink-0 flex-col justify-center gap-3.5 border-[6px] border-[#2b3034] bg-[#fbfbfb] px-[33px] py-6"
            >
              <h3 className="text-[20px] font-semibold leading-7 text-[#2b3034] [font-family:var(--font-hepta-slab)]">
                {title}
              </h3>
              <p className="text-[18px] leading-7 text-[#2b3034] [font-family:var(--font-raleway)]">
                {body}
              </p>
              <a
                href="#"
                className="flex items-center gap-1 text-[18px] text-[#1c75bc] [font-family:var(--font-raleway)] hover:underline"
              >
                Read More <ArrowRight className="size-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Our impact in action                                                */
/* ------------------------------------------------------------------ */

const IMPACT_CARDS = [
  {
    title: 'BCP Akure- Talent Pipeline Success',
    body: 'How we connected a leading fintech with 15 top-tier software engineers.',
  },
  {
    title: 'BCP Lagos- Corporate Collaboration Impact',
    body: 'A deep dive into our innovation workshop series with a multinational corporation.',
  },
  {
    title: 'AI In the modern workspace',
    body: 'Showcasing our first international chapter launch and it’s success stories.',
  },
]

function ImpactInAction() {
  return (
    <section className="relative overflow-hidden bg-[#fbfbfb] py-[55px]">
      <img
        src="/bcp/wave-1.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-50"
      />
      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-[65px] px-6 lg:px-[110px]">
        <h2 className="text-center text-[36px] font-bold tracking-[0.01em] text-[#2b3034] [font-family:var(--font-hepta-slab)]">
          Our impact in action
        </h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {IMPACT_CARDS.map(({ title, body }) => (
            <article
              key={title}
              className="flex flex-col border-[6px] border-[#2b3034] bg-[#fbfbfb] p-5 shadow-[0px_18px_40px_rgba(0,0,0,0.22)]"
            >
              <div className="h-[215px] w-full bg-[#d9d9d9]" />
              <h3 className="mt-4 text-[20px] font-semibold capitalize leading-7 text-[#2b3034] [font-family:var(--font-hepta-slab)]">
                {title}
              </h3>
              <p className="mt-2 text-[16px] leading-[27px] text-[#231f20] [font-family:var(--font-raleway)]">
                {body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Let's Build Together — inquiry form                                 */
/* ------------------------------------------------------------------ */

const FIELD_CLASSES =
  'w-full rounded-[3px] border-2 border-[#1f1f1f] bg-[#fefefe] px-6 text-[14px] leading-5 text-[#2f363d] shadow-[4px_4px_0px_0px_#1f1f1f] [font-family:var(--font-raleway)] placeholder:text-[#9aa1a7] focus:outline-none focus:ring-2 focus:ring-[#fed07b]'

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[20px] font-semibold leading-[27px] text-[#2b3034] [font-family:var(--font-raleway)]">
      {children}
    </span>
  )
}

function BuildTogether() {
  return (
    <section className="bg-[#fbfbfb] pb-[89px]">
      <div className="mx-auto flex max-w-[859px] flex-col items-center gap-10 p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.3),0px_2px_3px_rgba(0,0,0,0.15)] md:p-10">
        <div className="flex flex-col text-center">
          <h2 className="text-[36px] font-semibold leading-[48px] text-[#121212] [font-family:var(--font-hepta-slab)]">
            Let&rsquo;s Build Together
          </h2>
          <p className="text-[18px] leading-[27px] text-[#2b3034] [font-family:var(--font-raleway)]">
            Have a question or want to discuss a partnership? Fill out the form below
          </p>
        </div>
        <form className="flex w-full flex-col gap-5 px-2.5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <label className="flex flex-1 flex-col gap-1">
                <FieldLabel>Name</FieldLabel>
                <input type="text" placeholder="Your name" className={`h-[50px] ${FIELD_CLASSES}`} />
              </label>
              <label className="flex flex-1 flex-col gap-1">
                <FieldLabel>Organization</FieldLabel>
                <input type="text" placeholder="Your organization" className={`h-[50px] ${FIELD_CLASSES}`} />
              </label>
            </div>
            <label className="flex flex-col gap-1">
              <FieldLabel>Type of partnership</FieldLabel>
              <span className="relative">
                <select className={`h-[50px] appearance-none pr-12 ${FIELD_CLASSES}`} defaultValue="">
                  <option value="" disabled>
                    Select a partnership type
                  </option>
                  {PARTNERSHIPS.slice(0, 4).map(({ title }) => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-5 top-1/2 size-4 -translate-y-1/2 text-[#2f363d]" />
              </span>
            </label>
            <label className="flex flex-col gap-1">
              <FieldLabel>Message</FieldLabel>
              <textarea
                placeholder="Type your message"
                className={`h-[120px] resize-none py-2.5 text-[18px] leading-[27px] ${FIELD_CLASSES}`}
              />
            </label>
          </div>
          <BrutalButton className="h-[60px] w-full">Submit Inquiry</BrutalButton>
        </form>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

export function BcpPartnersPage() {
  return (
    <main className="min-h-screen bg-[#fbfbfb]">
      <BcpHero
        title="Why Partner With BCP?"
        subtitle="Gain access to dynamic, high-growth demographic of young Africans actively building careers and companies."
        subtitleSize="sm"
      />
      <NumberedBenefits />
      <OurPartners />
      <FindPartnership />
      <ImpactInAction />
      <BuildTogether />
      <JoinCommunity />
      <BcpFooter />
    </main>
  )
}
