import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { BcpHero, JoinCommunity, BcpFooter, isExternal } from '@/components/bcp/ui'
import { PartnerMarquee } from '@/components/bcp/partner-marquee'
import { PartnershipForm } from '@/components/bcp/partnership-form'
import { getPartners, getPartnershipTypes, getPostsByType } from '@/lib/notion'

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

async function OurPartners() {
  const partners = await getPartners()
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
        <PartnerMarquee
          partners={partners}
          className="relative bg-white py-2 shadow-[inset_0px_0px_50px_0px_rgba(255,255,255,0.81)]"
        />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Find the right partnership                                          */
/* ------------------------------------------------------------------ */

async function FindPartnership() {
  const partnerships = await getPartnershipTypes()
  return (
    <section className="bg-[#fbfbfb] py-[55px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-[75px]">
        <h2 className="px-6 text-center text-[36px] font-bold tracking-[0.01em] text-[#2b3034] [font-family:var(--font-hepta-slab)]">
          Find the right partnership for you
        </h2>
        {/* The 5th card runs off-canvas in the design — horizontal scroll row */}
        <div className="flex gap-10 overflow-x-auto px-6 pb-4 lg:px-[87px]">
          {partnerships.map(({ id, title, body, url }) => (
            <div
              key={id}
              className="flex min-h-[265px] w-[290px] shrink-0 flex-col justify-center gap-3.5 border-[6px] border-[#2b3034] bg-[#fbfbfb] px-[33px] py-6"
            >
              <h3 className="text-[20px] font-semibold leading-7 text-[#2b3034] [font-family:var(--font-hepta-slab)]">
                {title}
              </h3>
              <p className="text-[18px] leading-7 text-[#2b3034] [font-family:var(--font-raleway)]">
                {body}
              </p>
              {/* "URL" in the Notion Partnerships table — usually the public
                  Notion page describing that tier. With none set, the card
                  points at the enquiry form rather than a dead anchor. */}
              {url ? (
                <a
                  href={url}
                  {...(isExternal(url) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="flex items-center gap-1 text-[18px] text-[#1c75bc] [font-family:var(--font-raleway)] hover:underline"
                >
                  Read More <ArrowRight className="size-4" />
                </a>
              ) : (
                <Link
                  href="#partnership-inquiry"
                  className="flex items-center gap-1 text-[18px] text-[#1c75bc] [font-family:var(--font-raleway)] hover:underline"
                >
                  Enquire <ArrowRight className="size-4" />
                </Link>
              )}
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

/** Shown until the Notion blog has posts of type "Impact Story". The photos
 *  are existing event shots so the section never renders empty grey boxes. */
const FALLBACK_IMPACT = [
  {
    slug: null,
    cover: '/bcp/partner-photo-1.png',
    title: 'BCP Akure — Talent Pipeline Success',
    body: 'How we connected a leading fintech with 15 top-tier software engineers.',
  },
  {
    slug: null,
    cover: '/bcp/partner-photo-2.png',
    title: 'BCP Lagos — Corporate Collaboration Impact',
    body: 'A deep dive into our innovation workshop series with a multinational corporation.',
  },
  {
    slug: null,
    cover: '/bcp/what-is-bcp.png',
    title: 'AI in the Modern Workspace',
    body: 'Showcasing our first international chapter launch and its success stories.',
  },
]

async function ImpactInAction() {
  const posts = await getPostsByType('Impact Story')
  const cards =
    posts.length > 0
      ? posts.map((post) => ({
          slug: post.slug,
          cover: post.cover,
          title: post.title,
          body: post.excerpt,
        }))
      : FALLBACK_IMPACT

  return (
    <section className="relative overflow-hidden bg-[#fbfbfb] py-[55px]">
      <img
        src="/bcp/wave-1.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-50"
      />
      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-[65px] px-6 lg:px-[110px]">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="text-[36px] font-bold tracking-[0.01em] text-[#2b3034] [font-family:var(--font-hepta-slab)]">
            Our impact in action
          </h2>
          <p className="max-w-[760px] text-[18px] leading-7 text-[#414141] [font-family:var(--font-raleway)]">
            What partnering with BCP actually produces — the hires made, the programmes run, and
            the chapters opened with the organisations backing us.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {cards.map(({ slug, cover, title, body }) => {
            const card = (
              <>
                {cover ? (
                  // Notion covers are short-lived signed URLs; plain img avoids
                  // next/image caching a link that expires
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cover} alt={title} className="h-[215px] w-full object-cover" />
                ) : (
                  <div className="h-[215px] w-full bg-[#d9d9d9]" />
                )}
                <h3 className="mt-4 text-[20px] font-semibold leading-7 text-[#2b3034] [font-family:var(--font-hepta-slab)]">
                  {title}
                </h3>
                <p className="mt-2 text-[16px] leading-[27px] text-[#231f20] [font-family:var(--font-raleway)]">
                  {body}
                </p>
                {slug && (
                  <span className="mt-4 flex items-center gap-1 text-[18px] text-[#1c75bc] [font-family:var(--font-raleway)] group-hover:underline">
                    Read the case study <ArrowRight className="size-4" />
                  </span>
                )}
              </>
            )
            const shell =
              'group flex flex-col border-[6px] border-[#2b3034] bg-[#fbfbfb] p-5 shadow-[0px_18px_40px_rgba(0,0,0,0.22)]'
            return slug ? (
              <Link key={title} href={`/blog/${slug}`} className={shell}>
                {card}
              </Link>
            ) : (
              <article key={title} className={shell}>
                {card}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Let's Build Together — inquiry form                                 */
/* ------------------------------------------------------------------ */

async function BuildTogether() {
  const partnerships = await getPartnershipTypes()
  return (
    <section id="partnership-inquiry" className="scroll-mt-24 bg-[#fbfbfb] pb-[89px]">
      <div className="mx-auto flex max-w-[859px] flex-col items-center gap-10 p-6 shadow-[0px_1px_1px_rgba(0,0,0,0.3),0px_2px_3px_rgba(0,0,0,0.15)] md:p-10">
        <div className="flex flex-col text-center">
          <h2 className="text-[36px] font-semibold leading-[48px] text-[#121212] [font-family:var(--font-hepta-slab)]">
            Let&rsquo;s Build Together
          </h2>
          <p className="text-[18px] leading-[27px] text-[#2b3034] [font-family:var(--font-raleway)]">
            Have a question or want to discuss a partnership? Fill out the form below
          </p>
        </div>
        <PartnershipForm partnershipTypes={partnerships.map(({ title }) => title)} />
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
