import Image from 'next/image'
import {
  CircleAlert,
  Lightbulb,
  TrendingDown,
  Crosshair,
  BookOpen,
  Globe,
  Trophy,
  KeyRound,
  Users,
  MapPin,
  Mic,
  Wrench,
  Signpost,
  BadgeCheck,
  type LucideIcon,
} from 'lucide-react'
import { BcpHero, JoinCommunity, BcpFooter } from '@/components/bcp/ui'
import { DifferenceStack } from '@/components/bcp/difference-stack'

function Wave({ flip = false }: { flip?: boolean }) {
  return (
    <img
      src={flip ? '/bcp/wave-2.svg' : '/bcp/wave-1.svg'}
      alt=""
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full object-cover opacity-60"
    />
  )
}

function OurStory() {
  return (
    <section className="relative overflow-hidden bg-[#fbfbfb] py-[100px]">
      <Wave />
      <div className="relative mx-auto flex max-w-[1070px] flex-col items-center gap-6 border-[6px] border-[#2b3034] bg-[#91bd86] px-6 py-16 md:px-24">
        <h2 className="text-[36px] font-bold leading-[48px] text-[#121212] [font-family:var(--font-hepta-slab)]">
          Our Story
        </h2>
        <div className="max-w-[820px] space-y-4 text-center text-[20px] leading-9 text-[#414141] [font-family:var(--font-raleway)] md:text-[24px]">
          <p>
            BCP Origins began in 2022 in Akure, Nigeria, with a mission to empower young Africans
            through knowledge and community. The pilot event attracted 120 attendees&mdash;many of
            whom now work in some of Africa&rsquo;s most innovative companies.
          </p>
          <p>
            What started as a small gathering has evolved into a multi-location initiative with
            events across Nigeria and the UK, nurturing thousands of future-ready talents.
          </p>
        </div>
      </div>
    </section>
  )
}

const PROBLEMS: { icon: LucideIcon; text: string }[] = [
  { icon: CircleAlert, text: 'Shortage of job-ready talent' },
  { icon: Lightbulb, text: 'Limited innovation capacity' },
  { icon: TrendingDown, text: 'Slow industry growth' },
  { icon: Crosshair, text: 'Misalignment between education and employability' },
]

function ProblemSection() {
  return (
    <section className="relative bg-[#fbfbfb] py-[55px]">
      <div className="mx-auto flex max-w-[1274px] flex-col items-center gap-9 px-6">
        <div className="flex flex-col gap-[18px] text-center">
          <h2 className="text-[36px] font-bold leading-[48px] text-[#121212] [font-family:var(--font-hepta-slab)]">
            The Problem We&rsquo;re Solving
          </h2>
          <div className="text-[20px] leading-9 text-[#414141] [font-family:var(--font-raleway)] md:text-[24px]">
            <p>
              Across our events in Nigeria and the UK, we discovered a consistent problem: Young
              people lack access to quality knowledge, career exposure, and growth communities.
            </p>
            <p>This results in:</p>
          </div>
        </div>
        <div className="grid w-full max-w-[1018px] grid-cols-1 gap-[30px] sm:grid-cols-2 lg:grid-cols-4">
          {PROBLEMS.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex min-h-[171px] flex-col gap-[18px] border-[6px] border-[#2b3034] bg-[rgba(176,200,169,0.6)] p-5"
            >
              <span className="flex size-[44px] items-center justify-center rounded-full bg-[#ebe8e3]">
                <Icon className="size-[26px] text-[#2b3034]" strokeWidth={1.75} />
              </span>
              <p className="text-[20px] tracking-[0.01em] text-[#2b3034] [font-family:var(--font-raleway)]">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function VisionMission() {
  return (
    <section className="bg-[#fbfbfb] py-[55px]">
      <div className="mx-auto flex max-w-[1376px] flex-col items-stretch gap-10 px-6 md:flex-row md:items-center md:gap-0 lg:px-8">
        <div className="flex min-h-[299px] flex-1 flex-col items-center justify-center gap-6 border-[6px] border-[#2b3034] bg-[#91bd86] p-6 md:mb-[120px]">
          <h2 className="text-[28px] font-bold leading-[48px] text-[#121212] [font-family:var(--font-hepta-slab)]">
            Our Vision
          </h2>
          <p className="text-center text-[20px] leading-9 text-[#414141] [font-family:var(--font-raleway)] md:text-[24px]">
            To build Africa&rsquo;s most influential community of young talents who are equipped to
            lead industries and shape the future.
          </p>
        </div>
        <div className="mx-auto hidden h-[470px] w-[6px] shrink-0 rounded-[10px] bg-[#b0c8a9] md:mx-[51px] md:block" />
        <div className="flex min-h-[299px] flex-1 flex-col items-center justify-center gap-6 border-[6px] border-[#2b3034] bg-[#e0a46e] p-6 md:mt-[120px]">
          <h2 className="text-[28px] font-bold leading-[48px] text-[#121212] [font-family:var(--font-hepta-slab)]">
            Our Mission
          </h2>
          <p className="text-center text-[20px] leading-9 text-[#414141] [font-family:var(--font-raleway)] md:text-[24px]">
            To empower young Africans through career education, storytelling, mentorship, and
            community-driven opportunities.
          </p>
        </div>
      </div>
    </section>
  )
}

const CORE_VALUES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: BookOpen, title: 'Knowledge', text: 'What you know determines how far you go' },
  { icon: Globe, title: 'Impact First', text: 'We prioritise real, measurable transformation.' },
  { icon: Users, title: 'Community', text: 'Growth happens faster together' },
  { icon: Trophy, title: 'Excellence', text: 'Good isn’t enough; we strive for exceptional' },
  { icon: KeyRound, title: 'Access', text: 'Opportunities should be open, not gated' },
]

function ValueTile({
  icon: Icon,
  title,
  text,
  className = '',
}: {
  icon: LucideIcon
  title: string
  text: string
  className?: string
}) {
  return (
    <div
      className={`flex min-h-[228px] flex-col items-center justify-center gap-2.5 border-[6px] border-[#2b3034] bg-[#fbfbfb] p-3.5 text-center ${className}`}
    >
      <Icon className="size-[30px] text-[#2b3034]" strokeWidth={1.5} />
      <h3 className="text-[20px] font-medium text-[#121212] [font-family:var(--font-hepta-slab)]">
        {title}
      </h3>
      <p className="text-[16px] text-[#414141] [font-family:var(--font-raleway)]">{text}</p>
    </div>
  )
}

function CoreValues() {
  const [knowledge, impact, community, excellence, access] = CORE_VALUES
  return (
    <section className="bg-[#b0c8a9] py-[60px]">
      <div className="mx-auto flex max-w-[1376px] flex-col gap-8 px-6 lg:px-8">
        <h2 className="text-[36px] font-bold leading-[48px] text-[#121212] [font-family:var(--font-hepta-slab)]">
          Our Core Values
        </h2>
        {/* Top row: Knowledge / team photo / Impact First */}
        <div className="grid grid-cols-1 gap-7 md:grid-cols-[432fr_303fr_432fr]">
          <ValueTile {...knowledge} />
          <div className="relative min-h-[229px] overflow-hidden border-[6px] border-[#2b3034]">
            <Image
              src="/bcp/core-values-photo.png"
              alt="BCP community members at an event"
              fill
              sizes="(min-width: 768px) 25vw, 100vw"
              className="object-cover"
            />
          </div>
          <ValueTile {...impact} />
        </div>
        {/* Bottom row: Community / Excellence / Access */}
        <div className="grid grid-cols-1 gap-7 md:grid-cols-[322fr_503fr_322fr]">
          <ValueTile {...community} />
          <ValueTile {...excellence} />
          <ValueTile {...access} />
        </div>
      </div>
    </section>
  )
}


function Difference() {
  return (
    <section className="relative overflow-hidden bg-[#fbfbfb] py-[91px]">
      <Wave flip />
      <div className="relative mx-auto flex max-w-[1376px] flex-col gap-12 px-6 lg:flex-row lg:items-center lg:px-8">
        <h2 className="max-w-[595px] shrink-0 text-[36px] font-bold leading-[1.4] text-[#2b3034] [font-family:var(--font-hepta-slab)] lg:w-[42%]">
          What Makes BCP Different
        </h2>
        <DifferenceStack />
      </div>
    </section>
  )
}

export function BcpAboutPage() {
  return (
    <main className="min-h-screen bg-[#fbfbfb]">
      <BcpHero title="About Us" />
      <OurStory />
      <ProblemSection />
      <VisionMission />
      <CoreValues />
      <Difference />
      <JoinCommunity />
      <BcpFooter />
    </main>
  )
}
