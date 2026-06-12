import {
  Users,
  Globe,
  MessagesSquare,
  Target,
  Rocket,
  GraduationCap,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { BcpHero, BrutalButton, JoinCommunity, BcpFooter } from '@/components/bcp/ui'

type Program = {
  title: string
  status: 'Active' | 'Coming Soon'
  description: string
  icon: LucideIcon
  target: string
  benefits: string
  cta: string
}

const PROGRAMS: Program[] = [
  {
    title: 'BCP Origins Flagship Event',
    status: 'Active',
    description:
      'Our annual multi-location event gathers hundreds of young Africans for deep career insights, high-value conversations, and transformative learning.',
    icon: Users,
    target: 'Innovators, Leaders',
    benefits: 'Networking, Insight',
    cta: 'Learn More',
  },
  {
    title: 'Regional Host Program',
    status: 'Active',
    description:
      'Our annual multi-location event gathers hundreds of young Africans for deep career insights, high-value conversations, and transformative learning.',
    icon: Globe,
    target: 'Community Builders',
    benefits: 'Leadership, Impact',
    cta: 'Apply Now',
  },
  {
    title: 'BCP Community',
    status: 'Active',
    description:
      'Our annual multi-location event gathers hundreds of young Africans for deep career insights, high-value conversations, and transformative learning.',
    icon: MessagesSquare,
    target: 'All members',
    benefits: 'Connections, Resources',
    cta: 'Join Community',
  },
  {
    title: 'Workshops & Learning',
    status: 'Active',
    description:
      'Our annual multi-location event gathers hundreds of young Africans for deep career insights, high-value conversations, and transformative learning.',
    icon: Target,
    target: 'Skill seekers',
    benefits: 'Upskilling, Certification',
    cta: 'View Workshops',
  },
  {
    title: 'Career Launchpad (2026)',
    status: 'Coming Soon',
    description:
      'Our annual multi-location event gathers hundreds of young Africans for deep career insights, high-value conversations, and transformative learning.',
    icon: Rocket,
    target: 'Ambitious graduates',
    benefits: 'Mentorship, Placement',
    cta: 'Notify Me',
  },
  {
    title: 'BCP Ambassadors',
    status: 'Active',
    description:
      'Our annual multi-location event gathers hundreds of young Africans for deep career insights, high-value conversations, and transformative learning.',
    icon: GraduationCap,
    target: 'Student leaders',
    benefits: 'Advocacy, Growth',
    cta: 'Become an Ambassador',
  },
]

function StatusBadge({ status }: { status: Program['status'] }) {
  const active = status === 'Active'
  return (
    <span
      className={`flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-3xl px-2.5 text-[14px] font-semibold [font-family:var(--font-raleway)] ${
        active ? 'bg-[rgba(52,199,89,0.12)] text-[#34c759]' : 'bg-[rgba(255,204,0,0.12)] text-[#d4a017]'
      }`}
    >
      {status}
    </span>
  )
}

function ProgramCard({ program }: { program: Program }) {
  const Icon = program.icon
  return (
    <article className="flex flex-col gap-[30px] border-4 border-[#2b3034] bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[18px] font-medium text-[#121212] [font-family:var(--font-hepta-slab)]">
          {program.title}
        </h3>
        <StatusBadge status={program.status} />
      </div>
      <p className="text-[18px] leading-9 text-[#2b3034] [font-family:var(--font-raleway)]">
        {program.description}
      </p>
      <div className="flex items-center gap-1">
        <Icon className="size-6 shrink-0 text-[#2b3034]" strokeWidth={1.5} />
        <p className="text-[18px] font-medium text-[#2b3034] [font-family:var(--font-raleway)]">
          Target: {program.target}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Sparkles className="size-5 shrink-0 text-[#2b3034]" strokeWidth={1.5} />
        <p className="text-[18px] font-medium text-[#2b3034] [font-family:var(--font-raleway)]">
          Benefits: {program.benefits}
        </p>
      </div>
      <BrutalButton className="mt-auto w-full">{program.cta}</BrutalButton>
    </article>
  )
}

function ProgramsGrid() {
  return (
    <section className="bg-white py-[59px]">
      <div className="mx-auto grid max-w-[1376px] grid-cols-1 gap-5 px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {PROGRAMS.map((program) => (
          <ProgramCard key={program.title} program={program} />
        ))}
      </div>
    </section>
  )
}

export function BcpProgramsPage() {
  return (
    <main className="min-h-screen bg-white">
      <BcpHero
        title="Our Programs"
        subtitle="A global community empowering young Africans with the knowledge, network, and opportunities to build exceptional careers."
      />
      <ProgramsGrid />
      <JoinCommunity />
      <BcpFooter />
    </main>
  )
}
