import type { Metadata } from 'next'
import { articleMetadata } from '@/lib/seo'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BcpHero, JoinCommunity, BcpFooter } from '@/components/bcp/ui'
import { NotionContent, extractHeadings } from '@/components/bcp/notion-blocks'
import { PostToc } from '@/components/bcp/post-toc'
import { ShareButtons } from '@/components/bcp/share-buttons'
import { getPostBySlug, getPosts } from '@/lib/notion'

// Re-fetch from Notion at most every 60s — publishing in Notion goes
// live without a redeploy, and short-lived Notion image URLs stay fresh.
export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const result = await getPostBySlug(slug)
  if (!result) return { title: 'Blog' }
  return articleMetadata({
    title: result.post.title,
    description: result.post.excerpt,
    path: `/blog/${slug}`,
    image: result.post.cover,
    publishedTime: result.post.date,
  })
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// Rough reading time from all rich_text in the block tree
function readingMinutes(blocks: { [key: string]: any }[]): number {
  let words = 0
  const walk = (list: any[]) => {
    for (const block of list) {
      const rich = block[block.type]?.rich_text
      if (Array.isArray(rich)) {
        words += rich
          .map((t: any) => t.plain_text ?? '')
          .join('')
          .split(/\s+/)
          .filter(Boolean).length
      }
      if (block.children) walk(block.children)
    }
  }
  walk(blocks)
  return Math.max(1, Math.round(words / 200))
}

// First paragraph text, used as hero subtitle when Excerpt is empty
function firstParagraph(blocks: { [key: string]: any }[]): string {
  for (const block of blocks) {
    if (block.type === 'paragraph') {
      const text = (block.paragraph?.rich_text ?? [])
        .map((t: any) => t.plain_text ?? '')
        .join('')
        .trim()
      if (text) return text.length > 160 ? `${text.slice(0, 157)}…` : text
    }
  }
  return ''
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const result = await getPostBySlug(slug)
  if (!result) notFound()
  const { post, blocks } = result
  const morePosts = (await getPosts()).filter((p) => p.slug !== slug).slice(0, 3)

  return (
    <main className="min-h-screen bg-[#fbfbfb]">
      <BcpHero
        title={post.title}
        subtitle={post.excerpt || firstParagraph(blocks) || undefined}
        subtitleSize="sm"
      />
      <article className="relative overflow-hidden py-[80px]">
        <img
          src="/bcp/wave-1.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full object-cover opacity-30"
        />
        <div className="relative mx-auto w-full max-w-[1240px] px-6 xl:grid xl:grid-cols-[minmax(0,860px)_250px] xl:justify-center xl:gap-16">
          <div className="flex min-w-0 flex-col">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="text-[16px] font-semibold uppercase tracking-[0.08em] text-[#5f5f64] [font-family:var(--font-raleway)]">
                {post.type}
                {post.date && (
                  <span className="font-normal normal-case tracking-normal"> &mdash; {formatDate(post.date)}</span>
                )}
                <span className="font-normal normal-case tracking-normal"> &mdash; {readingMinutes(blocks)} min read</span>
              </p>
            </div>
            {post.cover && (
              // Notion cover URLs are short-lived signed links; plain img
              // avoids next/image caching a URL that expires
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.cover}
                alt={post.title}
                className="mt-6 max-h-[480px] w-full border-[6px] border-[#2b3034] object-cover"
              />
            )}
            <div className="mt-10">
              <NotionContent blocks={blocks} />
            </div>
            <div className="mt-12 border-t-[3px] border-[#2b3034] pt-8">
              <ShareButtons title={post.title} label="Share this article" />
            </div>
          </div>
          {/* Sticky table of contents (desktop) */}
          <aside className="hidden xl:block">
            <div className="sticky top-28 flex flex-col gap-10">
              <PostToc headings={extractHeadings(blocks)} />
              <ShareButtons title={post.title} label="Share" />
            </div>
          </aside>
        </div>
      </article>
      {morePosts.length > 0 && (
        <section className="bg-[#fbfbfb] pb-[80px]">
          <div className="mx-auto flex max-w-[1282px] flex-col gap-[25px] px-6">
            <h2 className="text-[28px] font-bold tracking-[0.01em] text-[#2b3034] [font-family:var(--font-hepta-slab)]">
              More from the blog
            </h2>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              {morePosts.map(({ id, slug: s, title, type, excerpt, cover }) => (
                <Link
                  key={id}
                  href={`/blog/${s}`}
                  className="flex flex-col border-[6px] border-[#2b3034] bg-[#fbfbfb] p-5 shadow-[0px_18px_40px_rgba(0,0,0,0.22)] transition-transform hover:-translate-y-1"
                >
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt={title} className="h-[180px] w-full object-cover" />
                  ) : (
                    <div className="h-[180px] w-full bg-[#d9d9d9]" />
                  )}
                  <p className="mt-4 text-[16px] text-black [font-family:var(--font-raleway)]">{type}</p>
                  <h3 className="mt-1 text-[20px] font-semibold capitalize leading-7 text-[#2b3034] [font-family:var(--font-hepta-slab)]">
                    {title}
                  </h3>
                  <p className="mt-2 text-[16px] leading-[27px] text-[#231f20] [font-family:var(--font-raleway)]">
                    {excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <JoinCommunity />
      <BcpFooter />
    </main>
  )
}
