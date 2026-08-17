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

export type ContactInput = {
  name: string
  email: string
  message: string
  /** Which form the message came from, recorded on the Notion row. */
  source?: 'Contact page' | 'Partnership inquiry'
  organization?: string
  partnershipType?: string
}

export async function submitContactMessage(
  input: ContactInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const isPartnership = input.source === 'Partnership inquiry'
  const contactAddress = isPartnership ? 'brand@bcporigins.com' : 'help@bcporigins.com'
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_CONTACT_DATABASE_ID) {
    return { ok: false, error: `This form is not set up yet. Please email ${contactAddress}.` }
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
        Source: { select: { name: input.source ?? 'Contact page' } },
        ...(input.organization ? { Organization: { rich_text: rt(input.organization) } } : {}),
        ...(input.partnershipType
          ? { 'Partnership Type': { select: { name: input.partnershipType } } }
          : {}),
        Status: { select: { name: 'New' } },
      } as any,
    })
    return { ok: true }
  } catch (err) {
    console.error('[notion] submitContactMessage failed:', err)
    return { ok: false, error: `Something went wrong. Please try again, or email ${contactAddress}.` }
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

/* ================================================================== */
/* Editable site content                                              */
/*                                                                    */
/* Everything below follows one shape: a Notion database whose rows    */
/* have a `Published` checkbox and an `Order` number, mapped into a    */
/* plain object. Each getter falls back to the values baked in here    */
/* when the database is not connected, so the site renders the same    */
/* either way and content can be moved into Notion one table at a      */
/* time. See NOTION-SETUP.md for the column list of each database.     */
/* ================================================================== */

/** Typed readers for a page's properties, matched case-insensitively so a
 *  column renamed from "Bio" to "bio" in Notion does not blank the site. */
function readProps(page: NotionPage) {
  const find = (name: string) =>
    Object.entries(page.properties).find(([key]) => key.toLowerCase() === name.toLowerCase())?.[1]

  const files = (name: string) =>
    ((find(name)?.files ?? []) as any[])
      .map((f) => (f.type === 'external' ? f.external?.url : f.file?.url))
      .filter(Boolean) as string[]

  return {
    title: (name: string) => plain(find(name)?.title),
    text: (name: string) => plain(find(name)?.rich_text),
    select: (name: string) => (find(name)?.select?.name as string | undefined) ?? '',
    url: (name: string) => (find(name)?.url as string | null) ?? '',
    number: (name: string) => (find(name)?.number as number | null) ?? null,
    date: (name: string) => (find(name)?.date?.start as string | null) ?? null,
    checkbox: (name: string) => Boolean(find(name)?.checkbox),
    files,
    file: (name: string) => files(name)[0] ?? null,
    /** The page's own cover image, useful when a row has no Image column. */
    cover: () =>
      (page.cover?.type === 'external' ? page.cover.external?.url : page.cover?.file?.url) ?? null,
  }
}

type Props = ReturnType<typeof readProps>

/**
 * Queries one content database and maps its rows. Returns `null` — rather
 * than an empty array — when the database is unconfigured, unreachable, or
 * empty, which is the signal for the caller to use its fallback content.
 */
async function queryCollection<T>(
  label: string,
  databaseId: string | undefined,
  map: (p: Props, page: NotionPage) => T | null,
  sort: { property: string; direction: 'ascending' | 'descending' } = {
    property: 'Order',
    direction: 'ascending',
  }
): Promise<T[] | null> {
  if (!process.env.NOTION_TOKEN || !databaseId) return null
  try {
    const notion = notionClient()
    const dataSourceId = await getDataSourceId(notion, databaseId)
    const res = (await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: 'Published', checkbox: { equals: true } },
      sorts: [sort],
    })) as { results: NotionPage[] }
    const rows = res.results
      .map((page) => map(readProps(page), page))
      .filter((row): row is T => row !== null)
    return rows.length > 0 ? rows : null
  } catch (err) {
    console.error(`[notion] ${label} failed, using fallback content:`, err)
    return null
  }
}

/* ------------------------------------------------------------------ */
/* People — core team, regional hosts, advisors, community ambassadors */
/* ------------------------------------------------------------------ */

export type PersonGroup = 'Core Team' | 'Regional Host' | 'Advisor' | 'Community Ambassador'

export type Person = {
  id: string
  name: string
  role: string
  bio: string
  photo: string
  linkedin: string
  group: PersonGroup
}

const PLACEHOLDER_PORTRAIT = '/bcp/core-values-photo.png'

const PLACEHOLDER_BIO =
  'Dedicated individuals working to empower the next generation of African Leaders.'

function placeholderPeople(group: PersonGroup, count: number): Person[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: `fallback-${group.toLowerCase().replace(/\s+/g, '-')}-${i}`,
    name: 'Toluwase Olugbemiro',
    role: group === 'Regional Host' ? 'Regional Host' : 'Core Team',
    bio: PLACEHOLDER_BIO,
    photo: PLACEHOLDER_PORTRAIT,
    linkedin: '',
    group,
  }))
}

const PERSON_GROUPS: PersonGroup[] = [
  'Core Team',
  'Regional Host',
  'Advisor',
  'Community Ambassador',
]

/** All published people, grouped. Missing groups fall back to placeholders so
 *  the layout keeps its shape before the Notion table is filled in. */
export async function getPeople(group: PersonGroup): Promise<Person[]> {
  const rows = await queryCollection<Person>(
    'getPeople',
    process.env.NOTION_PEOPLE_DATABASE_ID,
    (p, page) => {
      const name = p.title('Name')
      if (!name) return null
      const raw = p.select('Group')
      const matched = PERSON_GROUPS.find((g) => g.toLowerCase() === raw.toLowerCase())
      return {
        id: page.id,
        name,
        role: p.text('Role'),
        bio: p.text('Bio') || PLACEHOLDER_BIO,
        photo: p.file('Photo') ?? p.cover() ?? PLACEHOLDER_PORTRAIT,
        linkedin: p.url('LinkedIn'),
        group: matched ?? 'Core Team',
      }
    }
  )
  if (!rows) {
    // Community ambassadors have no placeholder roster — the section hides
    // itself until real people are added in Notion.
    if (group === 'Community Ambassador') return []
    if (group === 'Advisor') return []
    return placeholderPeople(group, group === 'Core Team' ? 15 : 6)
  }
  const inGroup = rows.filter((person) => person.group === group)
  if (inGroup.length > 0) return inGroup
  if (group === 'Community Ambassador' || group === 'Advisor') return []
  return placeholderPeople(group, group === 'Core Team' ? 15 : 6)
}

/* ------------------------------------------------------------------ */
/* Partner logos                                                       */
/* ------------------------------------------------------------------ */

export type PartnerLogo = { id: string; name: string; logo: string; url: string }

export const FALLBACK_PARTNERS: PartnerLogo[] = [
  '/bcp/partner-1.png',
  '/bcp/partner-2.png',
  '/bcp/partner-3.png',
  '/bcp/partner-4.png',
  '/bcp/partner-5.png',
  '/bcp/partner-6.png',
].map((logo, i) => ({ id: `fallback-partner-${i}`, name: 'Partner', logo, url: '' }))

export async function getPartners(): Promise<PartnerLogo[]> {
  const rows = await queryCollection<PartnerLogo>(
    'getPartners',
    process.env.NOTION_PARTNERS_DATABASE_ID,
    (p, page) => {
      const logo = p.file('Logo') ?? p.cover()
      if (!logo) return null
      return {
        id: page.id,
        name: p.title('Name') || 'Partner',
        logo,
        url: p.url('Website'),
      }
    }
  )
  return rows ?? FALLBACK_PARTNERS
}

/* ------------------------------------------------------------------ */
/* Impact stats — the numbered tiles in the home page collage          */
/* ------------------------------------------------------------------ */

export type Stat = { id: string; value: string; label: string; icon: string }

export const FALLBACK_STATS: Stat[] = [
  { id: 'fallback-stat-1', value: '6000+', label: 'Young Africans impacted', icon: 'users' },
  {
    id: 'fallback-stat-2',
    value: '80%+',
    label: 'BCP alumni now work in leading organizations',
    icon: 'briefcase',
  },
  {
    id: 'fallback-stat-3',
    value: '4',
    label: 'Countries reached (Nigeria, UK, Canada, Cyprus)',
    icon: 'globe',
  },
  { id: 'fallback-stat-4', value: '100+', label: 'Speakers hosted since 2022', icon: 'speech' },
]

export async function getStats(): Promise<Stat[]> {
  const rows = await queryCollection<Stat>(
    'getStats',
    process.env.NOTION_STATS_DATABASE_ID,
    (p, page) => {
      const value = p.title('Value')
      if (!value) return null
      return {
        id: page.id,
        value,
        label: p.text('Label'),
        icon: p.select('Icon').toLowerCase() || 'users',
      }
    }
  )
  return rows ?? FALLBACK_STATS
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

export type Testimonial = { id: string; quote: string; name: string; role: string; photo: string }

export const FALLBACK_TESTIMONIALS: Testimonial[] = Array.from({ length: 3 }).map((_, i) => ({
  id: `fallback-testimonial-${i}`,
  quote: 'BCP changed how I think about career growth and gave me the clarity I needed.',
  name: 'Toluwase Olugbemiro',
  role: 'BCP Alumni',
  photo: '/bcp/testimonial-avatar.png',
}))

export async function getTestimonials(): Promise<Testimonial[]> {
  const rows = await queryCollection<Testimonial>(
    'getTestimonials',
    process.env.NOTION_TESTIMONIALS_DATABASE_ID,
    (p, page) => {
      const quote = p.title('Quote') || p.text('Quote')
      if (!quote) return null
      return {
        id: page.id,
        quote,
        name: p.text('Name'),
        role: p.text('Role'),
        photo: p.file('Photo') ?? '/bcp/testimonial-avatar.png',
      }
    }
  )
  return rows ?? FALLBACK_TESTIMONIALS
}

/* ------------------------------------------------------------------ */
/* Events — flagship, mini experiences, and past editions              */
/* ------------------------------------------------------------------ */

export type BcpEvent = {
  id: string
  title: string
  tagline: string
  kind: 'Flagship' | 'Mini'
  /** ISO yyyy-mm-dd in the event's own local date, or null if undated. */
  date: string | null
  city: string
  summary: string
  cover: string | null
  /** Registration or details link. */
  url: string
}

export const FALLBACK_FLAGSHIP: BcpEvent = {
  id: 'fallback-flagship',
  title: 'BCP’26',
  tagline: 'The Beginning of Tomorrow',
  kind: 'Flagship',
  date: '2026-10-01',
  city: 'Lagos',
  summary:
    'Stakeholders Meeting, The Beginning of Tomorrow. Join us in Lagos in October 2026 for an inspiring gathering of minds.',
  cover: '/bcp/events-hero.png',
  url: '',
}

async function getEvents(): Promise<BcpEvent[] | null> {
  return queryCollection<BcpEvent>(
    'getEvents',
    process.env.NOTION_EVENTS_DATABASE_ID,
    (p, page) => {
      const title = p.title('Title')
      if (!title) return null
      const kind = p.select('Kind').toLowerCase() === 'flagship' ? 'Flagship' : 'Mini'
      return {
        id: page.id,
        title,
        tagline: p.text('Tagline'),
        kind,
        date: p.date('Date'),
        city: p.text('City'),
        summary: p.text('Summary'),
        cover: p.file('Cover') ?? p.cover(),
        url: p.url('Register URL') || p.url('URL'),
      }
    },
    { property: 'Date', direction: 'ascending' }
  )
}

/** Today at midnight UTC, so an event dated today still counts as upcoming. */
function startOfToday() {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
}

function isUpcoming(event: BcpEvent) {
  return event.date !== null && new Date(`${event.date}T00:00:00Z`) >= startOfToday()
}

/** The next flagship edition — drives the home page and the events hero. */
export async function getUpcomingFlagship(): Promise<BcpEvent> {
  const events = await getEvents()
  if (!events) return FALLBACK_FLAGSHIP
  const flagship = events.filter((e) => e.kind === 'Flagship')
  return flagship.find(isUpcoming) ?? flagship.at(-1) ?? FALLBACK_FLAGSHIP
}

/** Dated mini experiences from today onwards, for the calendar. */
export async function getMiniEvents(): Promise<BcpEvent[]> {
  const events = await getEvents()
  if (!events) return []
  return events.filter((e) => e.kind === 'Mini' && e.date !== null)
}

/** Editions that have already happened, newest first. */
export async function getPastEvents(): Promise<BcpEvent[]> {
  const events = await getEvents()
  if (!events) return []
  return events
    .filter((e) => !isUpcoming(e))
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
}

/* ------------------------------------------------------------------ */
/* Videos — gallery highlights and event recaps, hosted on YouTube     */
/* ------------------------------------------------------------------ */

export type BcpVideo = {
  id: string
  title: string
  subtitle: string
  /** 'Highlight' feeds the carousel; 'Recap' feeds the three recap cards. */
  group: 'Highlight' | 'Recap'
  location: string
  url: string
  thumbnail: string | null
}

export const FALLBACK_HIGHLIGHTS: BcpVideo[] = [
  '/bcp/collage-1.png',
  '/bcp/collage-2.png',
  '/bcp/collage-3.png',
  '/bcp/collage-4.png',
].map((thumbnail, i) => ({
  id: `fallback-highlight-${i}`,
  title: 'BCP 24, Akure',
  subtitle: 'a Speaker Session, A Pitch session',
  group: 'Highlight' as const,
  location: 'Akure',
  url: '',
  thumbnail,
}))

export const FALLBACK_RECAPS: BcpVideo[] = [
  { location: 'Akure', thumbnail: '/bcp/recap-akure.png' },
  { location: 'Kaduna', thumbnail: '/bcp/recap-kaduna.png' },
  { location: 'Calabar', thumbnail: '/bcp/partner-photo-2.png' },
].map(({ location, thumbnail }, i) => ({
  id: `fallback-recap-${i}`,
  title: `BCP’25 ${location}`,
  subtitle: 'Recap',
  group: 'Recap' as const,
  location,
  url: '',
  thumbnail,
}))

export async function getVideos(group: 'Highlight' | 'Recap'): Promise<BcpVideo[]> {
  const rows = await queryCollection<BcpVideo>(
    'getVideos',
    process.env.NOTION_VIDEOS_DATABASE_ID,
    (p, page) => {
      const title = p.title('Title')
      if (!title) return null
      return {
        id: page.id,
        title,
        subtitle: p.text('Subtitle'),
        group: p.select('Group').toLowerCase() === 'recap' ? 'Recap' : 'Highlight',
        location: p.text('Location'),
        url: p.url('YouTube URL') || p.url('URL'),
        thumbnail: p.file('Thumbnail') ?? p.cover(),
      }
    }
  )
  const fallback = group === 'Recap' ? FALLBACK_RECAPS : FALLBACK_HIGHLIGHTS
  if (!rows) return fallback
  const inGroup = rows.filter((video) => video.group === group)
  return inGroup.length > 0 ? inGroup : fallback
}

/* ------------------------------------------------------------------ */
/* Resource links — host library, downloads, media kit                 */
/* ------------------------------------------------------------------ */

export type ResourceLink = {
  id: string
  label: string
  description: string
  group: string
  icon: string
  url: string
}

export const FALLBACK_HOST_RESOURCES: ResourceLink[] = [
  { label: 'Host guide', icon: 'book' },
  { label: 'Event planning checklist', icon: 'checklist' },
  { label: 'Branding assets', icon: 'palette' },
  { label: 'Templates', icon: 'file' },
].map(({ label, icon }, i) => ({
  id: `fallback-host-resource-${i}`,
  label,
  description: '',
  group: 'Host Library',
  icon,
  url: '',
}))

export async function getResourceLinks(group: string): Promise<ResourceLink[]> {
  const rows = await queryCollection<ResourceLink>(
    'getResourceLinks',
    process.env.NOTION_RESOURCES_DATABASE_ID,
    (p, page) => {
      const label = p.title('Label')
      if (!label) return null
      return {
        id: page.id,
        label,
        description: p.text('Description'),
        group: p.select('Group') || 'Host Library',
        icon: p.select('Icon').toLowerCase() || 'file',
        url: p.url('URL') || p.file('File') || '',
      }
    }
  )
  if (!rows) return group === 'Host Library' ? FALLBACK_HOST_RESOURCES : []
  const inGroup = rows.filter((row) => row.group.toLowerCase() === group.toLowerCase())
  if (inGroup.length > 0) return inGroup
  return group === 'Host Library' ? FALLBACK_HOST_RESOURCES : []
}

/* ------------------------------------------------------------------ */
/* Partnership types — the "Find the right partnership" cards          */
/* ------------------------------------------------------------------ */

export type PartnershipType = { id: string; title: string; body: string; url: string }

export const FALLBACK_PARTNERSHIPS: PartnershipType[] = [
  {
    title: 'Event Sponsorship',
    body: 'Align your brand with our flagship events, conferences, and hackathons.',
  },
  {
    title: 'Community Sponsorship',
    body: 'Gain year round visibility and engagement as a key supporter of the BCP community.',
  },
  {
    title: 'Corporate Talent Development',
    body: 'Custom programs to upskill your team or build a bespoke talent pipeline.',
  },
  {
    title: 'Venue/ logistics Partnerships',
    body: 'Host a BCP experience at your space, or power one with travel and logistics support.',
  },
  {
    title: 'Corporate Talent Development Programs',
    body: 'Multi-cohort programmes that turn your graduate intake into job-ready operators.',
  },
].map((row, i) => ({ id: `fallback-partnership-${i}`, url: '', ...row }))

export async function getPartnershipTypes(): Promise<PartnershipType[]> {
  const rows = await queryCollection<PartnershipType>(
    'getPartnershipTypes',
    process.env.NOTION_PARTNERSHIPS_DATABASE_ID,
    (p, page) => {
      const title = p.title('Title')
      if (!title) return null
      return { id: page.id, title, body: p.text('Body'), url: p.url('URL') }
    }
  )
  return rows ?? FALLBACK_PARTNERSHIPS
}

/* ------------------------------------------------------------------ */
/* Story feeds — reuse the blog database, split by its Type column     */
/* ------------------------------------------------------------------ */

/** Published posts whose Type matches, e.g. "Impact Story" or "Origin Story".
 *  Returns an empty array when nothing matches, so callers can fall back. */
export async function getPostsByType(type: string): Promise<BlogPost[]> {
  const posts = await getPosts()
  if (posts === FALLBACK_POSTS) return []
  return posts.filter((post) => post.type.toLowerCase() === type.toLowerCase())
}
