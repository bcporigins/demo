import Link from 'next/link'
import {
  ArrowRight,
  Youtube,
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
import { getPostsByType } from '@/lib/notion'
import { WHATSAPP_COMMUNITY, YOUTUBE_CHANNEL } from '@/lib/site'

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
    // The section carries the same gutter as every other one on this page.
    // Without it the bordered box below — max-w-[1280px] with no outer
    // padding — ran flush to both screen edges under 1280px, and its 6px
    // border read as a stray full-bleed rule across the page.
    <section className="bg-[#fbfbfb] px-6 py-[60px] lg:px-20">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-center gap-[52px] border-[6px] border-[#2b3034] bg-[#fbfbfb] px-6 py-14 shadow-[0px_0px_4px_rgba(176,200,169,0.2)]">
        <div className="flex flex-col items-center gap-2.5 text-center">
          {/* Matches the other section headings on this page — it was the only
              one set in Raleway at 24px, which read as body copy. */}
          <h2 className="text-[30px] font-bold tracking-[0.01em] text-[#2b3034] [font-family:var(--font-hepta-slab)] md:text-[36px]">
            How to join
          </h2>
          <p className="max-w-[560px] text-[20px] leading-7 text-[#2b3034] [font-family:var(--font-raleway)]">
            Ready to connect with ambitious young Africans and unlock opportunities?
          </p>
        </div>
        <BrutalButton href={WHATSAPP_COMMUNITY} className="h-[64px] w-[296px]">
          Join the BCP Community
        </BrutalButton>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Origin stories                                                      */
/* ------------------------------------------------------------------ */

// Shown until the Notion blog has posts of type "Origin Story". These link to
// the blog index rather than a specific post, since none exists yet.
const FALLBACK_STORIES = [
  {
    href: '/resources#blog',
    title: 'Alumni who secured jobs',
    body: 'From job searching to landing dream roles at top companies across Africa and beyond.',
  },
  {
    href: '/resources#blog',
    title: 'Founders who raised funds',
    body: 'Turned ideas into funded startups with community support and mentorship.',
  },
  {
    href: '/resources#blog',
    title: 'Students who gained clarity',
    body: 'Discovered their path and built skills that set them apart from their peers.',
  },
  {
    href: '/resources#blog',
    title: 'Regional hosts who built networks',
    body: 'Created thriving local communities and became leaders in their regions.',
  },
]

async function OriginStories() {
  const posts = await getPostsByType('Origin Story')
  const cards =
    posts.length > 0
      ? posts.map((post) => ({
          href: `/blog/${post.slug}`,
          title: post.title,
          body: post.excerpt,
        }))
      : FALLBACK_STORIES

  return (
    <section className="bg-[#fbfbfb] pb-[40px] pt-[55px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-6 lg:px-20">
        <h2 className="text-center text-[36px] font-bold tracking-[0.01em] text-[#2b3034] [font-family:var(--font-hepta-slab)]">
          Origin stories
        </h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {cards.map(({ href, title, body }) => (
            <Link
              key={title}
              href={href}
              className="group flex flex-col justify-center gap-3.5 border-[6px] border-[#2b3034] bg-[#fbfbfb] px-[33px] py-6 transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_#2b3034]"
            >
              <h3 className="text-[20px] font-medium leading-7 text-[#2b3034] [font-family:var(--font-raleway)]">
                {title}
              </h3>
              <p className="text-[20px] leading-7 text-[#2b3034] [font-family:var(--font-raleway)]">
                {body}
              </p>
              <span className="flex items-center gap-1.5 text-[18px] text-[#1c75bc] [font-family:var(--font-raleway)] group-hover:underline">
                Read the story <ArrowRight className="size-4" />
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <BrutalButton href={YOUTUBE_CHANNEL} variant="beige" className="h-[60px] gap-2.5">
            <Youtube className="size-6" strokeWidth={1.75} /> Watch more on YouTube
          </BrutalButton>
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
