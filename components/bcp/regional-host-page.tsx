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
  Presentation,
  Video,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react'
import { BcpHero, BcpFooter, isExternal } from '@/components/bcp/ui'
import { HostApplication } from '@/components/bcp/host-application'
import { getResourceLinks } from '@/lib/notion'

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

function ApplicationForm() {
  return (
    <section id="host-application" className="bg-[#fbfbfb] pt-[100px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-[50px] px-6 lg:px-[79px]">
        <h2 className="text-[36px] font-semibold leading-[48px] text-[#121212] [font-family:var(--font-hepta-slab)]">
          Host Application Form
        </h2>
        <div className="flex flex-col items-center gap-10 border-[6px] border-[#2b3034] bg-[#91bd86] p-6 md:p-10">
          <p className="text-center text-[18px] leading-[27px] text-[#2b3034] [font-family:var(--font-raleway)]">
            Please fill out the form below to apply. We&rsquo;re excited to learn more about you.
          </p>
          <HostApplication source="Regional Host page" submitLabel="Submit" />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Resource Library                                                    */
/*                                                                     */
/* Rows come from the Notion Resources table (Group = "Host Library"), */
/* so hosts get new material by adding a row with a link, not a build. */
/* ------------------------------------------------------------------ */

// Icon names selectable in the Notion "Icon" column
const RESOURCE_ICONS: Record<string, LucideIcon> = {
  book: BookOpenText,
  checklist: ListChecks,
  palette: Palette,
  file: FileText,
  download: Download,
  deck: Presentation,
  video: Video,
}

async function ResourceLibrary() {
  const resources = await getResourceLinks('Host Library')
  if (resources.length === 0) return null
  return (
    <section className="bg-[#fbfbfb] py-[115px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-[50px] px-6 lg:px-20">
        <h2 className="text-[36px] font-semibold leading-[48px] text-[#121212] [font-family:var(--font-hepta-slab)]">
          Resource Library
        </h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {resources.map(({ id, label, description, icon, url }) => {
            const Icon = RESOURCE_ICONS[icon] ?? FileText
            const inner = (
              <>
                <Icon className="size-[30px] shrink-0 text-[#2b3034]" strokeWidth={1.75} />
                <span className="flex flex-col">
                  <span className="text-[20px] font-medium leading-7 text-[#2b3034] [font-family:var(--font-raleway)] md:text-[24px]">
                    {label}
                  </span>
                  {description && (
                    <span className="mt-1 text-[16px] leading-6 text-[#5f5f64] [font-family:var(--font-raleway)]">
                      {description}
                    </span>
                  )}
                </span>
                {url && (
                  <ExternalLink
                    className="ml-auto size-5 shrink-0 text-[#5f5f64]"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                )}
              </>
            )
            const shell =
              'flex min-h-[110px] items-center gap-3.5 border-[6px] border-[#2b3034] bg-[#fbfbfb] px-[33px] py-6'
            // A row with no URL yet still renders, just not as a dead link
            return url ? (
              <a
                key={id}
                href={url}
                {...(isExternal(url) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className={`${shell} transition-transform hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1f1f1f]`}
              >
                {inner}
              </a>
            ) : (
              <div key={id} className={shell}>
                {inner}
              </div>
            )
          })}
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
