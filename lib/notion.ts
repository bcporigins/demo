import { Client } from '@notionhq/client'

/* ------------------------------------------------------------------ */
/* Notion as CMS for the blog. Falls back to the design's placeholder  */
/* posts whenever NOTION_TOKEN / NOTION_DATABASE_ID are not set or a   */
/* request fails, so the site always renders.                          */
/* ------------------------------------------------------------------ */

export type BlogPost = {
  id: string
  slug: string
  title: string
  type: string
  excerpt: string
  cover: string | null
  date: string | null
}

export type NotionBlock = {
  id: string
  type: string
  // Raw Notion block payload for the renderer (rich_text, captions, etc.)
  [key: string]: unknown
  children?: NotionBlock[]
}

const FALLBACK_BODY = (title: string): NotionBlock[] => [
  {
    id: 'fb-1',
    type: 'paragraph',
    paragraph: {
      rich_text: [
        {
          plain_text: `This is a placeholder article for “${title}”. Connect Notion (NOTION_TOKEN and NOTION_DATABASE_ID in .env.local) and this page will render the full post content straight from your Notion workspace.`,
          annotations: {},
          href: null,
        },
      ],
    },
  },
  {
    id: 'fb-2',
    type: 'paragraph',
    paragraph: {
      rich_text: [
        {
          plain_text:
            'Headings, paragraphs, lists, images, quotes, callouts, dividers, and code blocks are all supported and rendered in the BCP design language.',
          annotations: {},
          href: null,
        },
      ],
    },
  },
]

export const FALLBACK_POSTS: BlogPost[] = [
  {
    id: 'fallback-1',
    slug: 'navigating-the-talent-gap',
    title: 'Navigating the talent gap',
    type: 'Article',
    excerpt: 'Explore challenges and opportunities in the African talent market.',
    cover: null,
    date: null,
  },
  {
    id: 'fallback-2',
    slug: 'your-first-90-days',
    title: 'Your first 90 days',
    type: 'Article',
    excerpt: 'A practical guide to making a strong impact in your new role.',
    cover: null,
    date: null,
  },
  {
    id: 'fallback-3',
    slug: 'ai-in-the-modern-workspace',
    title: 'AI In the modern workspace',
    type: 'Article',
    excerpt: 'Understand the transformative role of artificial intelligence.',
    cover: null,
    date: null,
  },
]

export function isNotionConfigured() {
  return Boolean(process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID)
}

export function isRolesConfigured() {
  return Boolean(process.env.NOTION_TOKEN && process.env.NOTION_ROLES_DATABASE_ID)
}

export function isApplicationsConfigured() {
  return Boolean(process.env.NOTION_TOKEN && process.env.NOTION_APPLICATIONS_DATABASE_ID)
}

function notionClient() {
  return new Client({ auth: process.env.NOTION_TOKEN })
}

// A Notion database can hold multiple data sources (API 2025-09); resolve
// the first one per database id and cache for the process lifetime.
const dataSourceCache = new Map<string, string>()

async function getDataSourceId(notion: Client, databaseId: string): Promise<string> {
  const cached = dataSourceCache.get(databaseId)
  if (cached) return cached
  const db = (await notion.databases.retrieve({ database_id: databaseId })) as {
    data_sources?: { id: string }[]
  }
  const id = db.data_sources?.[0]?.id
  if (!id) throw new Error(`No data source found on Notion database ${databaseId}`)
  dataSourceCache.set(databaseId, id)
  return id
}

/* ------------------------- property helpers ------------------------ */

type NotionPage = {
  id: string
  cover?: { type: string; external?: { url: string }; file?: { url: string } } | null
  properties: Record<string, any>
}

function plain(richText: { plain_text: string }[] | undefined): string {
  return (richText ?? []).map((t) => t.plain_text).join('')
}

function pageToPost(page: NotionPage): BlogPost | null {
  const props = page.properties
  const findProp = (type: string, ...names: string[]) => {
    for (const name of names) {
      const match = Object.entries(props).find(
        ([key, value]: [string, any]) => key.toLowerCase() === name && value.type === type
      )
      if (match) return match[1]
    }
    return Object.values(props).find((value: any) => value.type === type)
  }

  const titleProp = findProp('title', 'title', 'name')
  const title = plain(titleProp?.title)
  if (!title) return null

  const slugProp = findProp('rich_text', 'slug')
  const slug =
    plain(slugProp?.rich_text) ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

  const typeProp = findProp('select', 'type', 'category')
  const excerptProp = Object.entries(props).find(
    ([key, value]: [string, any]) => key.toLowerCase() === 'excerpt' && value.type === 'rich_text'
  )?.[1]
  const dateProp = findProp('date', 'date', 'published on')

  const cover =
    page.cover?.type === 'external' ? page.cover.external?.url : page.cover?.file?.url

  return {
    id: page.id,
    slug,
    title,
    type: typeProp?.select?.name ?? 'Article',
    excerpt: plain(excerptProp?.rich_text),
    cover: cover ?? null,
    date: dateProp?.date?.start ?? null,
  }
}

/* ----------------------------- queries ----------------------------- */

export async function getPosts(): Promise<BlogPost[]> {
  if (!isNotionConfigured()) return FALLBACK_POSTS
  try {
    const notion = notionClient()
    const dataSourceId = await getDataSourceId(notion, process.env.NOTION_DATABASE_ID!)
    const res = (await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: 'Published', checkbox: { equals: true } },
      sorts: [{ property: 'Date', direction: 'descending' }],
    })) as { results: NotionPage[] }
    const posts = res.results.map(pageToPost).filter((p): p is BlogPost => p !== null)
    return posts.length > 0 ? posts : FALLBACK_POSTS
  } catch (err) {
    console.error('[notion] getPosts failed, using fallback posts:', err)
    return FALLBACK_POSTS
  }
}

async function getBlocks(notion: Client, blockId: string, depth = 0): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = []
  let cursor: string | undefined
  do {
    const res = (await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    })) as { results: any[]; next_cursor: string | null }
    for (const block of res.results) {
      const entry: NotionBlock = block
      if (block.has_children && depth < 2) {
        entry.children = await getBlocks(notion, block.id, depth + 1)
      }
      blocks.push(entry)
    }
    cursor = res.next_cursor ?? undefined
  } while (cursor)
  return blocks
}

export async function getPostBySlug(
  slug: string
): Promise<{ post: BlogPost; blocks: NotionBlock[] } | null> {
  if (!isNotionConfigured()) {
    const post = FALLBACK_POSTS.find((p) => p.slug === slug)
    return post ? { post, blocks: FALLBACK_BODY(post.title) } : null
  }
  try {
    const notion = notionClient()
    const dataSourceId = await getDataSourceId(notion, process.env.NOTION_DATABASE_ID!)
    const res = (await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        and: [
          { property: 'Published', checkbox: { equals: true } },
          { property: 'Slug', rich_text: { equals: slug } },
        ],
      },
      page_size: 1,
    })) as { results: NotionPage[] }

    let page = res.results[0]
    if (!page) {
      // Slug property may be empty in Notion — fall back to matching the
      // slug derived from the title across all published posts.
      const all = await getPosts()
      const match = all.find((p) => p.slug === slug && !p.id.startsWith('fallback'))
      if (!match) return null
      page = (await notion.pages.retrieve({ page_id: match.id })) as unknown as NotionPage
    }

    const post = pageToPost(page)
    if (!post) return null
    const blocks = await getBlocks(notion, page.id)
    return { post, blocks }
  } catch (err) {
    console.error('[notion] getPostBySlug failed, using fallback:', err)
    const post = FALLBACK_POSTS.find((p) => p.slug === slug)
    return post ? { post, blocks: FALLBACK_BODY(post.title) } : null
  }
}

/* ------------------------------------------------------------------ */
/* Careers — Job Roles + Applications                                  */
/* ------------------------------------------------------------------ */

export type JobRole = {
  id: string
  slug: string
  title: string
  department: string
  location: string
  commitment: string
  summary: string
  date: string | null
}

export const FALLBACK_ROLES: JobRole[] = [
  { id: 'fr-1', slug: 'volunteers', title: 'Volunteers', department: 'Volunteers', location: 'Nigeria / UK · Remote-friendly', commitment: 'Volunteer', summary: 'Help bring BCP events to life on the ground.', date: null },
  { id: 'fr-2', slug: 'event-coordinators', title: 'Event coordinators', department: 'Events', location: 'Nigeria / UK · Remote-friendly', commitment: 'Volunteer', summary: 'Plan and run BCP experiences from idea to wrap-up.', date: null },
  { id: 'fr-3', slug: 'community-advocates', title: 'Community advocates', department: 'Community', location: 'Nigeria / UK · Remote-friendly', commitment: 'Volunteer', summary: 'Grow and energise the BCP community across regions.', date: null },
  { id: 'fr-4', slug: 'media-team', title: 'Media team', department: 'Media', location: 'Nigeria / UK · Remote-friendly', commitment: 'Volunteer', summary: 'Capture and tell the BCP story in photo and video.', date: null },
  { id: 'fr-5', slug: 'design-team', title: 'Design team', department: 'Design', location: 'Nigeria / UK · Remote-friendly', commitment: 'Volunteer', summary: 'Shape how BCP looks and feels everywhere it shows up.', date: null },
  { id: 'fr-6', slug: 'logistics-assistants', title: 'Logistics assistants', department: 'Logistics', location: 'Nigeria / UK · Remote-friendly', commitment: 'Volunteer', summary: 'Keep the moving parts of BCP events running smoothly.', date: null },
]

const FALLBACK_ROLE_BODY = (title: string): NotionBlock[] => [
  {
    id: 'frb-1',
    type: 'paragraph',
    paragraph: {
      rich_text: [
        {
          plain_text: `This is a placeholder listing for “${title}”. Connect the Job Roles database in Notion (NOTION_ROLES_DATABASE_ID) and the full description will render here.`,
          annotations: {},
          href: null,
        },
      ],
    },
  },
]

function pageToRole(page: NotionPage): JobRole | null {
  const props = page.properties
  const get = (name: string) =>
    Object.entries(props).find(([key]) => key.toLowerCase() === name.toLowerCase())?.[1]

  const title = plain(get('Title')?.title)
  if (!title) return null
  const slug =
    plain(get('Slug')?.rich_text) ||
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  return {
    id: page.id,
    slug,
    title,
    department: get('Department')?.select?.name ?? 'Volunteers',
    location: plain(get('Location')?.rich_text) || 'Nigeria / UK',
    commitment: get('Commitment')?.select?.name ?? 'Volunteer',
    summary: plain(get('Summary')?.rich_text),
    date: get('Date')?.date?.start ?? null,
  }
}

export async function getRoles(): Promise<JobRole[]> {
  if (!isRolesConfigured()) return FALLBACK_ROLES
  try {
    const notion = notionClient()
    const dataSourceId = await getDataSourceId(notion, process.env.NOTION_ROLES_DATABASE_ID!)
    const res = (await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: 'Published', checkbox: { equals: true } },
      sorts: [{ property: 'Date', direction: 'descending' }],
    })) as { results: NotionPage[] }
    const roles = res.results.map(pageToRole).filter((r): r is JobRole => r !== null)
    return roles.length > 0 ? roles : FALLBACK_ROLES
  } catch (err) {
    console.error('[notion] getRoles failed, using fallback roles:', err)
    return FALLBACK_ROLES
  }
}

export async function getRoleBySlug(
  slug: string
): Promise<{ role: JobRole; blocks: NotionBlock[] } | null> {
  if (!isRolesConfigured()) {
    const role = FALLBACK_ROLES.find((r) => r.slug === slug)
    return role ? { role, blocks: FALLBACK_ROLE_BODY(role.title) } : null
  }
  try {
    const notion = notionClient()
    const dataSourceId = await getDataSourceId(notion, process.env.NOTION_ROLES_DATABASE_ID!)
    const res = (await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        and: [
          { property: 'Published', checkbox: { equals: true } },
          { property: 'Slug', rich_text: { equals: slug } },
        ],
      },
      page_size: 1,
    })) as { results: NotionPage[] }
    const page = res.results[0]
    if (!page) return null
    const role = pageToRole(page)
    if (!role) return null
    const blocks = await getBlocks(notion, page.id)
    return { role, blocks }
  } catch (err) {
    console.error('[notion] getRoleBySlug failed, using fallback:', err)
    const role = FALLBACK_ROLES.find((r) => r.slug === slug)
    return role ? { role, blocks: FALLBACK_ROLE_BODY(role.title) } : null
  }
}

/* ------------------------- application intake ---------------------- */

export type ApplicationInput = {
  name: string
  email: string
  phone?: string
  link?: string
  motivation?: string
  roleTitle: string
  roleSlug: string
  resume?: { filename: string; contentType: string; data: Buffer } | null
}

const NOTION_VERSION = '2025-09-03'

// Uploads a file to Notion (single-part, <= 20MB) and returns the upload id.
async function uploadResumeToNotion(resume: NonNullable<ApplicationInput['resume']>) {
  const headers = {
    Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
    'Notion-Version': NOTION_VERSION,
  }
  const created = await fetch('https://api.notion.com/v1/file_uploads', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: resume.filename, content_type: resume.contentType }),
  })
  if (!created.ok) throw new Error(`file_uploads create failed: ${await created.text()}`)
  const { id, upload_url } = (await created.json()) as { id: string; upload_url: string }

  const form = new FormData()
  form.append(
    'file',
    new Blob([new Uint8Array(resume.data)], { type: resume.contentType }),
    resume.filename
  )
  const sent = await fetch(upload_url, { method: 'POST', headers, body: form })
  if (!sent.ok) throw new Error(`file_uploads send failed: ${await sent.text()}`)
  return id
}

export async function submitApplication(
  input: ApplicationInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isApplicationsConfigured()) {
    return {
      ok: false,
      error:
        'Applications are not set up yet. Please email your application to help@bcporigins.com.',
    }
  }
  try {
    const notion = notionClient()
    const dataSourceId = await getDataSourceId(
      notion,
      process.env.NOTION_APPLICATIONS_DATABASE_ID!
    )

    let resumeFiles: unknown[] = []
    if (input.resume) {
      const uploadId = await uploadResumeToNotion(input.resume)
      resumeFiles = [
        { type: 'file_upload', file_upload: { id: uploadId }, name: input.resume.filename },
      ]
    }

    const rt = (content: string) => [{ text: { content } }]
    await notion.pages.create({
      parent: { type: 'data_source_id', data_source_id: dataSourceId } as any,
      properties: {
        Name: { title: rt(input.name) },
        Email: { email: input.email },
        ...(input.phone ? { Phone: { phone_number: input.phone } } : {}),
        Role: { rich_text: rt(input.roleTitle) },
        'Role Slug': { rich_text: rt(input.roleSlug) },
        ...(input.link ? { 'LinkedIn / Portfolio': { url: input.link } } : {}),
        ...(input.motivation ? { Motivation: { rich_text: rt(input.motivation.slice(0, 2000)) } } : {}),
        ...(resumeFiles.length ? { Resume: { files: resumeFiles } } : {}),
        Status: { select: { name: 'New' } },
      } as any,
    })
    return { ok: true }
  } catch (err) {
    console.error('[notion] submitApplication failed:', err)
    return {
      ok: false,
      error:
        'Something went wrong submitting your application. Please try again, or email help@bcporigins.com.',
    }
  }
}

/* ------------------------------------------------------------------ */
/* FAQs — questions from Notion with helpful/not-helpful vote counts   */
/* ------------------------------------------------------------------ */

export type Faq = { id: string; question: string; answer: string }

export const FALLBACK_FAQS: Faq[] = [
  { id: 'fallback-faq-1', question: 'What is BCP Origins?', answer: 'BCP Origins is a social impact organization building a community of young Africans equipped with the skills, network, and opportunities to thrive.' },
  { id: 'fallback-faq-2', question: 'Is BCP free to join?', answer: 'Yes, joining the community is free.' },
  { id: 'fallback-faq-3', question: 'Are tickets free?', answer: 'Ticket details are announced per event — many gatherings are free for community members.' },
  { id: 'fallback-faq-4', question: 'Can I volunteer?', answer: 'Yes, we welcome volunteers across all our events and programs.' },
  { id: 'fallback-faq-5', question: 'How can I host a BCP event?', answer: 'Apply through our Regional Host Program and our team will get in touch.' },
  { id: 'fallback-faq-6', question: 'Do you work with organisations?', answer: 'Yes, we partner with organisations that share our mission. Reach out via Partner with Us.' },
]

export function isFaqsConfigured() {
  return Boolean(process.env.NOTION_TOKEN && process.env.NOTION_FAQS_DATABASE_ID)
}

export async function getFaqs(): Promise<Faq[]> {
  if (!isFaqsConfigured()) return FALLBACK_FAQS
  try {
    const notion = notionClient()
    const dataSourceId = await getDataSourceId(notion, process.env.NOTION_FAQS_DATABASE_ID!)
    const res = (await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: 'Published', checkbox: { equals: true } },
      sorts: [{ property: 'Order', direction: 'ascending' }],
    })) as { results: NotionPage[] }
    const faqs = res.results
      .map((page) => ({
        id: page.id,
        question: plain(page.properties.Question?.title),
        answer: plain(page.properties.Answer?.rich_text),
      }))
      .filter((f) => f.question && f.answer)
    return faqs.length > 0 ? faqs : FALLBACK_FAQS
  } catch (err) {
    console.error('[notion] getFaqs failed, using fallback:', err)
    return FALLBACK_FAQS
  }
}

// Increment the Helpful / Not Helpful counter on a FAQ row.
export async function voteFaq(faqId: string, helpful: boolean): Promise<{ ok: boolean }> {
  if (!isFaqsConfigured() || faqId.startsWith('fallback')) return { ok: true }
  try {
    const notion = notionClient()
    const page = (await notion.pages.retrieve({ page_id: faqId })) as unknown as NotionPage
    const prop = helpful ? 'Helpful' : 'Not Helpful'
    const current = page.properties[prop]?.number ?? 0
    await notion.pages.update({
      page_id: faqId,
      properties: { [prop]: { number: current + 1 } } as any,
    })
    return { ok: true }
  } catch (err) {
    console.error('[notion] voteFaq failed:', err)
    return { ok: false }
  }
}

/* ------------------------------------------------------------------ */
/* Host applications (Events + Regional Host pages share one DB)       */
/* ------------------------------------------------------------------ */

export type HostApplicationInput = {
  name: string
  email: string
  city: string
  experience: string
  motivation: string
  source: 'Events page' | 'Regional Host page'
}

export async function submitHostApplication(
  input: HostApplicationInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_HOST_APPS_DATABASE_ID) {
    return { ok: false, error: 'Applications are not set up yet. Please email help@bcporigins.com.' }
  }
  try {
    const notion = notionClient()
    const dataSourceId = await getDataSourceId(notion, process.env.NOTION_HOST_APPS_DATABASE_ID)
    const rt = (content: string) => [{ text: { content } }]
    await notion.pages.create({
      parent: { type: 'data_source_id', data_source_id: dataSourceId } as any,
      properties: {
        Name: { title: rt(input.name) },
        Email: { email: input.email },
        'City & Country': { rich_text: rt(input.city.slice(0, 2000)) },
        Experience: { rich_text: rt(input.experience.slice(0, 2000)) },
        ...(input.motivation ? { Motivation: { rich_text: rt(input.motivation.slice(0, 2000)) } } : {}),
        Source: { select: { name: input.source } },
        Status: { select: { name: 'New' } },
      } as any,
    })
    return { ok: true }
  } catch (err) {
    console.error('[notion] submitHostApplication failed:', err)
    return { ok: false, error: 'Something went wrong. Please try again, or email help@bcporigins.com.' }
  }
}

/* ------------------------------------------------------------------ */
/* Contact messages                                                    */
/* ------------------------------------------------------------------ */

export async function submitContactMessage(input: {
  name: string
  email: string
  message: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_CONTACT_DATABASE_ID) {
    return { ok: false, error: 'The contact form is not set up yet. Please email help@bcporigins.com.' }
  }
  try {
    const notion = notionClient()
    const dataSourceId = await getDataSourceId(notion, process.env.NOTION_CONTACT_DATABASE_ID)
    const rt = (content: string) => [{ text: { content } }]
    await notion.pages.create({
      parent: { type: 'data_source_id', data_source_id: dataSourceId } as any,
      properties: {
        Name: { title: rt(input.name) },
        Email: { email: input.email },
        Message: { rich_text: rt(input.message.slice(0, 2000)) },
        Status: { select: { name: 'New' } },
      } as any,
    })
    return { ok: true }
  } catch (err) {
    console.error('[notion] submitContactMessage failed:', err)
    return { ok: false, error: 'Something went wrong. Please try again, or email help@bcporigins.com.' }
  }
}

/* ------------------------------------------------------------------ */
/* Newsletter subscribers                                              */
/* ------------------------------------------------------------------ */

export async function subscribeEmail(
  email: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_SUBSCRIBERS_DATABASE_ID) {
    return { ok: false, error: 'Subscriptions are not set up yet. Please try again later.' }
  }
  try {
    const notion = notionClient()
    const dataSourceId = await getDataSourceId(notion, process.env.NOTION_SUBSCRIBERS_DATABASE_ID)
    // Dedupe: treat an existing row with the same email as success
    const existing = (await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: 'Email', title: { equals: email } },
      page_size: 1,
    })) as { results: unknown[] }
    if (existing.results.length > 0) return { ok: true }
    await notion.pages.create({
      parent: { type: 'data_source_id', data_source_id: dataSourceId } as any,
      properties: {
        Email: { title: [{ text: { content: email } }] },
        Status: { select: { name: 'Subscribed' } },
      } as any,
    })
    return { ok: true }
  } catch (err) {
    console.error('[notion] subscribeEmail failed:', err)
    return { ok: false, error: 'Something went wrong. Please try again.' }
  }
}

/* ------------------------------------------------------------------ */
/* Gallery — event editions with photo sets                            */
/* ------------------------------------------------------------------ */

export type GalleryEdition = { id: string; title: string; images: string[] }

export const FALLBACK_GALLERY: GalleryEdition[] = [
  {
    id: 'fallback-gallery-1',
    title: 'BCP’25 Calabar Edition',
    images: [
      '/bcp/gallery-1.png',
      '/bcp/gallery-2.png',
      '/bcp/gallery-4.png',
      '/bcp/gallery-3.png',
      '/bcp/gallery-5.png',
    ],
  },
]

export async function getGalleryEditions(): Promise<GalleryEdition[]> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_GALLERY_DATABASE_ID) {
    return FALLBACK_GALLERY
  }
  try {
    const notion = notionClient()
    const dataSourceId = await getDataSourceId(notion, process.env.NOTION_GALLERY_DATABASE_ID)
    const res = (await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: 'Published', checkbox: { equals: true } },
      sorts: [{ property: 'Order', direction: 'ascending' }],
    })) as { results: NotionPage[] }
    const editions = res.results
      .map((page) => ({
        id: page.id,
        title: plain(page.properties.Title?.title),
        images: ((page.properties.Images?.files ?? []) as any[])
          .map((f) => (f.type === 'external' ? f.external?.url : f.file?.url))
          .filter(Boolean) as string[],
      }))
      .filter((e) => e.title && e.images.length > 0)
    return editions.length > 0 ? editions : FALLBACK_GALLERY
  } catch (err) {
    console.error('[notion] getGalleryEditions failed, using fallback:', err)
    return FALLBACK_GALLERY
  }
}
