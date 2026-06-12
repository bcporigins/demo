import Link from 'next/link'
import {
  Users,
  Megaphone,
  Palette,
  Briefcase,
  Camera,
  Package,
  HeartHandshake,
  Rocket,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'
import { BcpHero, BrutalButton, JoinCommunity, BcpFooter } from '@/components/bcp/ui'
import { getRoles } from '@/lib/notion'

export const DEPARTMENT_ICONS: Record<string, LucideIcon> = {
  Volunteers: Users,
  Events: Briefcase,
  Community: Megaphone,
  Media: Camera,
  Design: Palette,
  Logistics: Package,
}

/* ------------------------------------------------------------------ */
/* Why join — colored value cards in the Community-page chip style     */
/* ------------------------------------------------------------------ */

const WHY_JOIN: { icon: LucideIcon; title: string; body: string; bg: string; iconBg: string }[] = [
  {
    icon: HeartHandshake,
    title: 'Impact you can see',
    body: 'Help shape programs that move thousands of young Africans into exceptional careers.',
    bg: '#91bd86',
    iconBg: '#b0c8a9',
  },
  {
    icon: Rocket,
    title: 'Learn by doing',
    body: 'Run real events, campaigns, and communities — operating experience no classroom teaches.',
    bg: '#80bfcf',
    iconBg: '#a3d0d9',
  },
  {
    icon: Users,
    title: 'Mentorship & network',
    body: 'Work beside operators, founders, and BCP alumni across Nigeria, the UK, and beyond.',
    bg: '#e0a46e',
    iconBg: '#d6924d',
  },
  {
    icon: TrendingUp,
    title: 'Room to grow',
    body: 'Standout contributors step up into regional leadership and core team roles.',
    bg: '#b0c8a9',
    iconBg: '#91bd86',
  },
]

function WhyJoin() {
  return (
    <section className="bg-[#fbfbfb] pt-[75px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-6 lg:px-20">
        <h2 className="text-[36px] font-bold tracking-[0.01em] text-[#2b3034] [font-family:var(--font-hepta-slab)]">
          Why join the team
        </h2>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_JOIN.map(({ icon: Icon, title, body, bg, iconBg }) => (
            <div
              key={title}
              className="flex flex-col gap-3.5 border-[6px] border-[#2b3034] px-[33px] py-6"
              style={{ backgroundColor: bg }}
            >
              <span className="flex size-[44px] items-center justify-center" style={{ backgroundColor: iconBg }}>
                <Icon className="size-6 text-[#2b3034]" strokeWidth={1.75} />
              </span>
              <h3 className="text-[22px] font-semibold leading-7 text-[#2b3034] [font-family:var(--font-hepta-slab)]">
                {title}
              </h3>
              <p className="text-[17px] leading-[27px] text-[#2b3034] [font-family:var(--font-raleway)]">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Open Roles — Notion-driven listing                                  */
/* ------------------------------------------------------------------ */

function MetaTag({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[14px] font-semibold text-[#5f5f64] [font-family:var(--font-raleway)]">
      <Icon className="size-3.5" strokeWidth={2} />
      {label}
    </span>
  )
}

async function OpenRoles() {
  const roles = await getRoles()
  return (
    <section className="relative overflow-hidden bg-[#fbfbfb] py-[90px]">
      <img
        src="/bcp/wave-2.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-50"
      />
      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-[50px] px-6 lg:px-20">
        <div id="open-roles" className="flex scroll-mt-28 items-baseline gap-3">
          <h2 className="text-[36px] font-bold tracking-[0.01em] text-[#2b3034] [font-family:var(--font-hepta-slab)]">
            Open Roles
          </h2>
          <span className="text-[20px] font-medium text-[#5f5f64] [font-family:var(--font-raleway)]">
            ({roles.length})
          </span>
        </div>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {roles.map(({ id, slug, title, department, summary, location, commitment }) => {
            const Icon = DEPARTMENT_ICONS[department] ?? Users
            return (
              <Link
                key={id}
                href={`/careers/${slug}`}
                className="group flex items-center gap-4 border-[6px] border-[#2b3034] bg-[#fbfbfb] px-[33px] py-6 transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#1f1f1f]"
              >
                <span className="flex size-[52px] shrink-0 items-center justify-center bg-[#ebe8e3]">
                  <Icon className="size-7 text-[#2b3034]" strokeWidth={1.5} />
                </span>
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-[20px] font-medium leading-7 text-[#2b3034] [font-family:var(--font-raleway)] md:text-[24px]">
                    {title}
                  </span>
                  {summary && (
                    <span className="truncate text-[16px] leading-6 text-[#414141] [font-family:var(--font-raleway)]">
                      {summary}
                    </span>
                  )}
                  <span className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                    <MetaTag icon={MapPin} label={location} />
                    <MetaTag icon={Clock} label={commitment} />
                  </span>
                </span>
                <ArrowRight
                  aria-hidden
                  className="ml-auto size-6 shrink-0 text-[#2b3034] opacity-0 transition-opacity group-hover:opacity-100"
                />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* How to apply — numbered steps + CTA                                 */
/* ------------------------------------------------------------------ */

const STEPS = [
  { title: 'Pick a role', body: 'Browse the open roles above and find your fit.' },
  { title: 'Apply on its page', body: 'Each role has its own application form — takes two minutes.' },
  { title: 'Hear from us', body: 'The team reviews every application and gets back to you.' },
]

function HowToApply() {
  return (
    <section className="bg-[#fbfbfb] pb-[105px]">
      <div className="mx-auto flex w-full max-w-[1000px] flex-col items-center gap-[52px] bg-[#fbfbfb] px-6 py-14 shadow-[0px_0px_4px_rgba(176,200,169,0.2)]">
        <h3 className="text-[24px] font-semibold leading-7 text-[#2b3034] [font-family:var(--font-raleway)]">
          How to apply
        </h3>
        <div className="grid w-full grid-cols-1 gap-10 sm:grid-cols-3">
          {STEPS.map(({ title, body }, i) => (
            <div key={title} className="flex flex-col items-center gap-4 text-center">
              <span className="flex size-[50px] items-center justify-center rounded-full border border-[#133834] bg-white text-[28px] font-bold text-black shadow-[3px_4px_0px_#0e2624] [font-family:var(--font-hepta-slab)]">
                {i + 1}
              </span>
              <p className="text-[19px] font-semibold text-[#2b3034] [font-family:var(--font-raleway)]">
                {title}
              </p>
              <p className="max-w-[260px] text-[16px] leading-[26px] text-[#414141] [font-family:var(--font-raleway)]">
                {body}
              </p>
            </div>
          ))}
        </div>
        <a href="#open-roles">
          <BrutalButton className="h-[64px] w-[296px]">Apply Now</BrutalButton>
        </a>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

export function BcpCareersPage() {
  return (
    <main className="min-h-screen bg-[#fbfbfb]">
      <BcpHero
        title="Join The BCP Team"
        subtitle="Be part of something meaningful. We're looking for passionate individuals to join our team and make a difference in the community."
        subtitleSize="sm"
      />
      <WhyJoin />
      <OpenRoles />
      <HowToApply />
      <JoinCommunity />
      <BcpFooter />
    </main>
  )
}
