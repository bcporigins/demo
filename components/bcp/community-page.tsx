import {
  GraduationCap,
  Rocket,
  Medal,
  TrendingUp,
  Search,
  Users,
  Sparkles,
  Calendar,
  BookOpen,
  MessageCircle,
  Send,
  type LucideIcon,
} from 'lucide-react'
import { BcpHero, BrutalButton, JoinCommunity, BcpFooter } from '@/components/bcp/ui'

/* ------------------------------------------------------------------ */
/* Who it's for — colored audience chips                               */
/* ------------------------------------------------------------------ */

type Chip = {
  label: string
  icon: LucideIcon
  bg: string
  iconBg: string
}

// Reading order is row-major (the Figma columns interleave rows 1 and 2)
const AUDIENCE_CHIPS: Chip[] = [
  { label: 'Students', icon: GraduationCap, bg: '#80bfcf', iconBg: '#a3d0d9' },
  { label: 'Recent graduates', icon: Medal, bg: '#d6924d', iconBg: '#e0a46e' },
  { label: 'Job seekers', icon: Search, bg: '#91bd86', iconBg: '#b0c8a9' },
  { label: 'Young founders', icon: Rocket, bg: '#e0a46e', iconBg: '#d6924d' },
  { label: 'Professional growth seekers', icon: TrendingUp, bg: '#b0c8a9', iconBg: '#91bd86' },
  { label: 'Veterans looking to give back', icon: Users, bg: '#80bfcf', iconBg: '#a3d0d9' },
]

function WhoItsFor() {
  return (
    <section className="bg-[#fbfbfb] pt-[75px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-6 lg:px-20">
        <h2 className="text-[36px] font-bold tracking-[0.01em] text-[#2b3034] [font-family:var(--font-hepta-slab)]">
          Who it&rsquo;s for
        </h2>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {AUDIENCE_CHIPS.map(({ label, icon: Icon, bg, iconBg }) => (
            <div
              key={label}
              className="flex flex-col justify-center gap-3.5 border-[6px] border-[#2b3034] px-[33px] py-6"
              style={{ backgroundColor: bg }}
            >
              <span
                className="flex size-[44px] items-center justify-center"
                style={{ backgroundColor: iconBg }}
              >
                <Icon className="size-6 text-[#2b3034]" strokeWidth={1.75} />
              </span>
              <p className="text-[24px] font-medium leading-7 text-[#2b3034] [font-family:var(--font-raleway)]">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Benefits of joining                                                 */
/* ------------------------------------------------------------------ */

const BENEFITS: { label: string; icon: LucideIcon }[] = [
  { label: 'Access to opportunities', icon: Sparkles },
  { label: 'Learning circles', icon: BookOpen },
  { label: 'Exclusive events', icon: Calendar },
  { label: 'Mentorship windows', icon: MessageCircle },
  { label: 'Community-driven accountability', icon: Users },
  { label: 'Direct updates from BCP', icon: Send },
]

function Benefits() {
  return (
    <section className="relative overflow-hidden bg-[#fbfbfb] py-[55px]">
      <img
        src="/bcp/wave-2.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-60"
      />
      <img
        src="/bcp/idea-doodle.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-[126px] hidden size-[147px] lg:block"
      />
      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-10 px-6 lg:px-20">
        <h2 className="text-[36px] font-bold tracking-[0.01em] text-[#2b3034] [font-family:var(--font-hepta-slab)]">
          Benefits of joining
        </h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {BENEFITS.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex min-h-[110px] items-center gap-3.5 border-[6px] border-[#2b3034] bg-[#fbfbfb] px-[33px] py-6"
            >
              <span className="flex size-[44px] shrink-0 items-center justify-center bg-[#ebe8e3]">
                <Icon className="size-6 text-[#2b3034]" strokeWidth={1.75} />
              </span>
              <p className="text-[20px] font-medium leading-7 text-[#2b3034] [font-family:var(--font-raleway)] md:text-[24px]">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* How to join                                                         */
/* ------------------------------------------------------------------ */

function HowToJoin() {
  return (
    <section className="bg-[#fbfbfb] py-[60px]">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-center gap-[52px] border-[6px] border-[#2b3034] bg-[#fbfbfb] px-6 py-14 shadow-[0px_0px_4px_rgba(176,200,169,0.2)]">
        <div className="flex flex-col items-center gap-2.5 text-center">
          <h2 className="text-[24px] font-semibold leading-7 text-[#2b3034] [font-family:var(--font-raleway)]">
            How to join
          </h2>
          <p className="text-[20px] leading-7 text-[#2b3034] [font-family:var(--font-raleway)]">
            Ready to connect with ambitious young Africans and unlock opportunities?
          </p>
        </div>
        <BrutalButton className="h-[64px] w-[296px]">Join the BCP Community</BrutalButton>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Origin stories                                                      */
/* ------------------------------------------------------------------ */

const ORIGIN_STORIES = [
  {
    title: 'Alumni who secured jobs',
    body: 'From job searching to landing dream roles at top companies across Africa and beyond.',
  },
  {
    title: 'Founders who raised funds',
    body: 'Turned ideas into funded startups with community support and mentorship.',
  },
  {
    title: 'Students who gained clarity',
    body: 'Discovered their path and built skills that set them apart from their peers.',
  },
  {
    title: 'Regional hosts who built networks',
    body: 'Created thriving local communities and became leaders in their regions.',
  },
]

function OriginStories() {
  return (
    <section className="bg-[#fbfbfb] pt-[55px] pb-[40px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-6 lg:px-20">
        <h2 className="text-center text-[36px] font-bold tracking-[0.01em] text-[#2b3034] [font-family:var(--font-hepta-slab)]">
          Origin stories
        </h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {ORIGIN_STORIES.map(({ title, body }) => (
            <div
              key={title}
              className="flex flex-col justify-center gap-3.5 border-[6px] border-[#2b3034] bg-[#fbfbfb] px-[33px] py-6"
            >
              <h3 className="text-[20px] font-medium leading-7 text-[#2b3034] [font-family:var(--font-raleway)]">
                {title}
              </h3>
              <p className="text-[20px] leading-7 text-[#2b3034] [font-family:var(--font-raleway)]">
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
/* Tilted closing banner                                               */
/* ------------------------------------------------------------------ */

function ClosingBanner() {
  return (
    <section className="bg-[#fbfbfb] pb-[60px] pt-[30px]">
      <div className="flex justify-center">
        <div className="rotate-[-6deg] border-[6px] border-[#2b3034] bg-[#f3f2f8] p-3">
          <p className="text-[22px] font-medium text-[#414141] [font-family:var(--font-raleway)] md:text-[26px]">
            Join us. Grow with us. Lead with us.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

export function BcpCommunityPage() {
  return (
    <main className="min-h-screen bg-[#fbfbfb]">
      <BcpHero
        title="What the BCP Community is"
        subtitle="A network of ambitious young Africans across Nigeria, UK, and beyond, united by a desire to grow, build, and lead."
        subtitleSize="sm"
      />
      <WhoItsFor />
      <Benefits />
      <HowToJoin />
      <OriginStories />
      <ClosingBanner />
      <JoinCommunity />
      <BcpFooter />
    </main>
  )
}
