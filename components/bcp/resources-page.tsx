import Link from 'next/link'
import { Download, ArrowRight } from 'lucide-react'
import { BcpHero, BrutalButton, JoinCommunity, BcpFooter } from '@/components/bcp/ui'
import { getPosts, getResourceLinks } from '@/lib/notion'

/* ------------------------------------------------------------------ */
/* Blog                                                                */
/* ------------------------------------------------------------------ */

async function Blog() {
  const posts = await getPosts()
  return (
    <section id="blog" className="scroll-mt-24 bg-[#fbfbfb] pt-[65px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-[25px] px-6 lg:px-[79px]">
        <h2 className="text-[36px] font-bold tracking-[0.01em] text-[#2b3034] [font-family:var(--font-hepta-slab)]">
          Blog
        </h2>
        <div className="grid grid-cols-1 gap-10 px-0 md:grid-cols-3 lg:px-[35px]">
          {posts.map(({ id, slug, title, type, excerpt, cover }) => (
            <article
              key={id}
              className="flex flex-col border-[6px] border-[#2b3034] bg-[#fbfbfb] p-5 shadow-[0px_18px_40px_rgba(0,0,0,0.22)]"
            >
              {cover ? (
                // Notion cover URLs are short-lived signed links; plain img
                // avoids next/image caching a URL that expires
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cover} alt={title} className="h-[216px] w-full object-cover" />
              ) : (
                <div className="h-[216px] w-full bg-[#d9d9d9]" />
              )}
              <p className="mt-4 text-[18px] text-black [font-family:var(--font-raleway)]">{type}</p>
              <h3 className="mt-2 text-[20px] font-semibold capitalize leading-7 text-[#2b3034] [font-family:var(--font-hepta-slab)]">
                {title}
              </h3>
              <p className="mt-2 text-[16px] leading-[27px] text-[#231f20] [font-family:var(--font-raleway)]">
                {excerpt}
              </p>
              <Link
                href={`/blog/${slug}`}
                className="mt-5 flex items-center gap-1 text-[18px] text-[#1c75bc] [font-family:var(--font-raleway)] hover:underline"
              >
                Read More <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Research and insights                                               */
/* ------------------------------------------------------------------ */

type ResearchCard = {
  label: string
  title: string
  body: string
  bg: string
  comingSoon?: boolean
}

// Row-major order; the Figma columns interleave rows 1 and 2
const RESEARCH: ResearchCard[] = [
  {
    label: 'Report',
    title: 'African Talent Gap Report 2025',
    body: 'In depth analysis of the evolving talent landscape across the continent.',
    bg: '#91bd86',
    comingSoon: true,
  },
  {
    label: 'Guide',
    title: 'Career Playbooks',
    body: 'Role-specific guides for Product Managers, Marketers, and more.',
    bg: '#e0a46e',
  },
  {
    label: 'Guide',
    title: 'Student Roadmaps',
    body: 'Step-by-step career planning for university students.',
    bg: '#a3d0d9',
  },
  {
    label: 'Guide',
    title: 'Industry Breakdown Guides',
    body: 'Deep dives into key sectors like Fintech, Healthcare, and Edutech.',
    bg: '#b0c8a9',
  },
]

function ResearchInsights() {
  return (
    <section className="bg-[#fbfbfb] pt-[100px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-[65px] px-6 lg:px-[79px]">
        <h2 className="text-[36px] font-bold tracking-[0.01em] text-[#2b3034] [font-family:var(--font-hepta-slab)]">
          Research and insights
        </h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {RESEARCH.map(({ label, title, body, bg, comingSoon }) => (
            <div
              key={title}
              className="flex min-h-[188px] flex-col justify-center gap-3.5 border-[6px] border-[#2b3034] px-[33px] py-6"
              style={{ backgroundColor: bg }}
            >
              <div className="flex h-[31px] w-full items-center justify-between">
                <p className="text-[18px] leading-7 text-[#2b3034] [font-family:var(--font-raleway)]">
                  {label}
                </p>
                {comingSoon && (
                  <span className="flex h-full items-center justify-center rounded-[82px] bg-[#fed07b] px-2.5 text-[18px] font-medium leading-7 text-[#2b3034] [font-family:var(--font-raleway)]">
                    Coming soon
                  </span>
                )}
              </div>
              <h3 className="text-[20px] font-semibold leading-7 text-[#2b3034] [font-family:var(--font-hepta-slab)]">
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
/* Downloads                                                           */
/* ------------------------------------------------------------------ */

// Shown until the Notion Resources table has rows in the "Download" group.
// Each card advertises what is coming rather than offering a dead button.
const FALLBACK_DOWNLOADS = [
  { id: 'fd-1', description: 'Toolkit', label: 'Event Toolkits', url: '' },
  { id: 'fd-2', description: 'Assets', label: 'Presentation Decks', url: '' },
  { id: 'fd-3', description: 'Guide', label: 'Learning Guides', url: '' },
  { id: 'fd-4', description: 'Templates', label: 'CV & Cover Letters', url: '' },
]

async function Downloads() {
  const fromNotion = await getResourceLinks('Download')
  const downloads = fromNotion.length > 0 ? fromNotion : FALLBACK_DOWNLOADS
  return (
    <section className="bg-[#fbfbfb] pt-[100px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-[65px] px-6 lg:px-[79px]">
        <h2 className="text-[36px] font-bold tracking-[0.01em] text-[#2b3034] [font-family:var(--font-hepta-slab)]">
          Downloads
        </h2>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {downloads.map(({ id, label, description, url }) => (
            <div
              key={id}
              className="flex flex-col justify-center gap-3.5 border-[6px] border-[#2b3034] bg-[#fbfbfb] px-[33px] py-6"
            >
              <p className="text-[18px] leading-7 text-[#2b3034] [font-family:var(--font-raleway)]">
                {description || 'Resource'}
              </p>
              <h3 className="text-[20px] font-semibold leading-7 text-[#2b3034] [font-family:var(--font-hepta-slab)]">
                {label}
              </h3>
              {url ? (
                <BrutalButton href={url} className="h-[60px] w-full max-w-[232px] gap-2.5">
                  <Download className="size-6" strokeWidth={2} /> Download
                </BrutalButton>
              ) : (
                <span className="flex h-[60px] w-full max-w-[232px] items-center justify-center rounded-[3px] border-2 border-dashed border-[#9aa1a7] px-5 text-[16px] font-semibold text-[#5f5f64] [font-family:var(--font-raleway)]">
                  Coming soon
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Media Kit & Press                                                   */
/* ------------------------------------------------------------------ */

// The PNG logo ships with the site; the SVG and brand guidelines appear once
// they are added to the Notion Resources table under the "Media Kit" group.
const FALLBACK_MEDIA_KIT = [
  { id: 'fmk-1', label: 'PNG format', description: '', url: '/bcp/logo.png' },
]

async function MediaKit() {
  const fromNotion = await getResourceLinks('Media Kit')
  const assets = fromNotion.length > 0 ? fromNotion : FALLBACK_MEDIA_KIT
  return (
    <section className="bg-[#fbfbfb] py-[78px]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 lg:px-[79px]">
        <div className="flex flex-col gap-3">
          <h2 className="text-[36px] font-bold leading-[48px] text-[#121212] [font-family:var(--font-hepta-slab)]">
            Media Kit &amp; Press
          </h2>
          <p className="text-[20px] leading-7 text-[#2b3034] [font-family:var(--font-raleway)]">
            Resources for media, journalists, and partners
          </p>
        </div>
        <p className="max-w-[1232px] text-[20px] leading-7 text-[#2b3034] [font-family:var(--font-raleway)]">
          BCP Origins is a multi-location youth development initiative focused on closing the
          African talent gap through comprehensive educational programs, mentorship opportunities,
          and community engagement. We empower young people with the skills, knowledge, and
          networks they need to succeed in today&rsquo;s global economy.
        </p>
        <div className="mt-2 flex min-h-[295px] flex-col justify-center gap-[50px] border-[6px] border-[#2b3034] bg-[#fbfbfb] px-6 py-10 shadow-[0px_0px_4px_rgba(176,200,169,0.2)]">
          <p className="text-[26px] font-medium leading-7 text-[#2b3034] [font-family:var(--font-raleway)]">
            Logo Downloads
          </p>
          <div className="flex flex-col gap-6 md:flex-row md:gap-[52px]">
            {assets.map(({ id, label, url }, i) => (
              <BrutalButton
                key={id}
                href={url}
                variant={i === assets.length - 1 && assets.length > 1 ? 'yellow' : 'beige'}
                className="h-[64px] flex-1 gap-2.5"
              >
                <Download className="size-5" strokeWidth={2} /> {label}
              </BrutalButton>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

export function BcpResourcesPage() {
  return (
    <main className="min-h-screen bg-[#fbfbfb]">
      <BcpHero
        title="Resources"
        subtitle="Our annual multi-location event gathers hundreds of young Africans for deep career insights, high-value conversations, and transformative learning."
        subtitleSize="sm"
      />
      <Blog />
      <ResearchInsights />
      <Downloads />
      <MediaKit />
      <JoinCommunity />
      <BcpFooter />
    </main>
  )
}
