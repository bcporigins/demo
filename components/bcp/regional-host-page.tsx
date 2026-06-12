import {
  Download,
  Megaphone,
  Signpost,
  Users,
  Eye,
  BadgeCheck,
  BookOpenText,
  ListChecks,
  Palette,
  FileText,
  type LucideIcon,
} from 'lucide-react'
import { BcpHero, BcpFooter } from '@/components/bcp/ui'
import { HostApplyForm } from '@/components/bcp/host-apply-form'

/* ------------------------------------------------------------------ */
/* Host Benefits                                                       */
/* ------------------------------------------------------------------ */

const BENEFITS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Download,
    title: 'Access to BCP event toolkit',
    body: 'All the materials you need to run a successful event.',
  },
  {
    icon: Megaphone,
    title: 'Branding support',
    body: 'Official BCP branding to promote your events.',
  },
  {
    icon: Signpost,
    title: 'Training',
    body: 'Comprehensive training on event management and leadership.',
  },
  {
    icon: Users,
    title: 'Mentorship',
    body: 'Guidance from experienced hosts and BCP staff.',
  },
]

function HostBenefits() {
  return (
    <section className="bg-[#fbfbfb] pt-[85px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-[68px] px-6 lg:px-20">
        <h2 className="text-[36px] font-semibold leading-[48px] text-[#121212] [font-family:var(--font-hepta-slab)]">
          Host Benefits
        </h2>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="flex min-h-[292px] flex-col justify-center gap-3.5 border-[6px] border-[#2b3034] bg-[#fbfbfb] px-[33px] py-6"
            >
              <Icon className="size-[30px] text-[#2b3034]" strokeWidth={1.75} />
              <h3 className="text-[20px] font-semibold leading-7 text-[#2b3034] [font-family:var(--font-hepta-slab)]">
                {title}
              </h3>
              <p className="text-[20px] leading-7 text-[#2b3034] [font-family:var(--font-raleway)]">
                {body}
              </p>
            </div>
          ))}
        </div>
        {/* Fifth benefit on its own row, narrower, as in the design */}
        <div className="-mt-7 flex w-full max-w-[299px] flex-col justify-center gap-3.5 border-[6px] border-[#2b3034] bg-[#fbfbfb] px-[33px] py-6 lg:min-h-[244px]">
          <Eye className="size-[30px] text-[#2b3034]" strokeWidth={1.75} />
          <h3 className="text-[20px] font-semibold leading-7 text-[#2b3034] [font-family:var(--font-hepta-slab)]">
            Visibility
          </h3>
          <p className="text-[20px] leading-7 text-[#2b3034] [font-family:var(--font-raleway)]">
            Showcase your leadership on a regional and national level.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Requirements                                                        */
/* ------------------------------------------------------------------ */

const REQUIREMENTS = [
  {
    title: 'Demonstrated leadership',
    body: 'Proven ability to lead projects or teams effectively.',
  },
  {
    title: 'Experience organizing events',
    body: 'Previous experience in planning and executing events of any scale.',
  },
  {
    title: 'Strong community orientation',
    body: 'A passion for building and engaging with local communities.',
  },
  {
    title: 'Basic logistics skills',
    body: 'Competence in managing schedules, budgets, and resources.',
  },
]

function Requirements() {
  return (
    <section className="bg-[#fbfbfb] pt-[53px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-6 lg:px-[89px]">
        <h2 className="text-[36px] font-semibold leading-[48px] text-[#121212] [font-family:var(--font-hepta-slab)]">
          Requirements
        </h2>
        <div className="flex max-w-[621px] flex-col gap-6">
          {REQUIREMENTS.map(({ title, body }) => (
            <div key={title} className="flex items-center gap-2.5">
              <BadgeCheck className="size-[30px] shrink-0 text-[#2b3034]" strokeWidth={1.75} />
              <div className="flex flex-col">
                <h3 className="text-[20px] font-semibold leading-[48px] text-[#121212] [font-family:var(--font-raleway)]">
                  {title}
                </h3>
                <p className="text-[18px] leading-[27px] text-[#2b3034] [font-family:var(--font-raleway)]">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Host Application Form                                               */
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

function ApplicationForm() {
  return (
    <section className="bg-[#fbfbfb] pt-[100px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-[50px] px-6 lg:px-[79px]">
        <h2 className="text-[36px] font-semibold leading-[48px] text-[#121212] [font-family:var(--font-hepta-slab)]">
          Host Application Form
        </h2>
        <div className="flex flex-col items-center gap-10 border-[6px] border-[#2b3034] bg-[#91bd86] p-6 md:p-10">
          <p className="text-center text-[18px] leading-[27px] text-[#2b3034] [font-family:var(--font-raleway)]">
            Please fill out the form below to apply. We&rsquo;re excited to learn more about you.
          </p>
          <HostApplyForm source="Regional Host page" submitLabel="Submit" />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Resource Library                                                    */
/* ------------------------------------------------------------------ */

const RESOURCES: { icon: LucideIcon; label: string }[] = [
  { icon: BookOpenText, label: 'Host guide' },
  { icon: ListChecks, label: 'Event planning checklist' },
  { icon: Palette, label: 'Branding assets' },
  { icon: FileText, label: 'Templates' },
]

function ResourceLibrary() {
  return (
    <section className="bg-[#fbfbfb] py-[115px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-[50px] px-6 lg:px-20">
        <h2 className="text-[36px] font-semibold leading-[48px] text-[#121212] [font-family:var(--font-hepta-slab)]">
          Resource Library
        </h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {RESOURCES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex min-h-[110px] items-center gap-3.5 border-[6px] border-[#2b3034] bg-[#fbfbfb] px-[33px] py-6"
            >
              <Icon className="size-[30px] shrink-0 text-[#2b3034]" strokeWidth={1.75} />
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

// Note: this page intentionally has no Join-the-Community band or footer —
// the Figma design for the RHP page ends after the Resource Library.
export function BcpRegionalHostPage() {
  return (
    <main className="min-h-screen bg-[#fbfbfb]">
      <BcpHero
        title="Become a BCP Regional Host"
        subtitle="Empower young leaders and host impactful events in your city with the full support of BCP."
        subtitleSize="sm"
      />
      <HostBenefits />
      <Requirements />
      <ApplicationForm />
      <ResourceLibrary />
      <BcpFooter />
    </main>
  )
}
