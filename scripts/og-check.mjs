#!/usr/bin/env node
/**
 * Verifies the social share metadata on every route.
 *
 *   npm run og:check                    # against localhost:3000
 *   npm run og:check https://www.bcporigins.com
 *
 * Checks the tags each platform actually reads:
 *   X/Twitter  twitter:card=summary_large_image + title, description, image
 *   LinkedIn   og:title, og:description, og:image, og:url
 *   Facebook   the og:* set plus image dimensions
 *   WhatsApp   og:image reachable, and small — it gives up on large files
 *
 * Exits non-zero if anything is missing, so it can gate a deploy.
 */

const BASE = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '')

const ROUTES = [
  '/',
  '/about',
  '/programs',
  '/team',
  '/events',
  '/community',
  '/careers',
  '/gallery',
  '/partners',
  '/regional-host',
  '/resources',
  '/contact',
]

const REQUIRED = [
  ['og:title', 'property'],
  ['og:description', 'property'],
  ['og:url', 'property'],
  ['og:type', 'property'],
  ['og:site_name', 'property'],
  ['og:image', 'property'],
  ['og:image:width', 'property'],
  ['og:image:height', 'property'],
  ['og:image:alt', 'property'],
  ['twitter:card', 'name'],
  ['twitter:title', 'name'],
  ['twitter:description', 'name'],
  ['twitter:image', 'name'],
]

/** WhatsApp quietly drops previews for images much beyond this. */
const MAX_IMAGE_BYTES = 300 * 1024
const MAX_TITLE = 70
const MIN_DESC = 50
const MAX_DESC = 200

function readTag(html, attr, value) {
  const re = new RegExp(
    `<meta[^>]*${attr}="${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*content="([^"]*)"`,
    'i'
  )
  const alt = new RegExp(
    `<meta[^>]*content="([^"]*)"[^>]*${attr}="${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`,
    'i'
  )
  return (html.match(re) ?? html.match(alt))?.[1] ?? null
}

const problems = []
let checked = 0

async function discoverDynamic() {
  const extra = []
  try {
    const xml = await (await fetch(`${BASE}/sitemap.xml`)).text()
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const p = new URL(m[1]).pathname
      if (/^\/(blog|careers)\/.+/.test(p)) extra.push(p)
    }
  } catch {
    // sitemap unavailable; static routes still get checked
  }
  // one of each dynamic kind is enough to prove the template works
  const blog = extra.find((p) => p.startsWith('/blog/'))
  const role = extra.find((p) => p.startsWith('/careers/'))
  return [blog, role].filter(Boolean)
}

for (const route of [...ROUTES, ...(await discoverDynamic())]) {
  checked++
  const url = `${BASE}${route}`
  let html
  try {
    const res = await fetch(url)
    if (!res.ok) {
      problems.push(`${route}: page returned ${res.status}`)
      console.log(`${route.padEnd(26)} ✗ HTTP ${res.status}`)
      continue
    }
    html = await res.text()
  } catch (err) {
    problems.push(`${route}: ${err.message}`)
    console.log(`${route.padEnd(26)} ✗ ${err.message}`)
    continue
  }

  const found = {}
  const missing = []
  for (const [tag, attr] of REQUIRED) {
    const value = readTag(html, attr, tag)
    if (!value) missing.push(tag)
    else found[tag] = value
  }

  const notes = []
  if (found['twitter:card'] && found['twitter:card'] !== 'summary_large_image') {
    notes.push(`twitter:card is "${found['twitter:card']}", not summary_large_image`)
  }
  if (found['og:title'] && found['og:title'].length > MAX_TITLE) {
    notes.push(`og:title ${found['og:title'].length} chars (over ${MAX_TITLE}, will truncate)`)
  }
  if (found['og:description']) {
    const n = found['og:description'].length
    if (n < MIN_DESC) notes.push(`og:description only ${n} chars`)
    if (n > MAX_DESC) notes.push(`og:description ${n} chars (over ${MAX_DESC}, will truncate)`)
  }
  if (found['og:image'] && !/^https?:\/\//.test(found['og:image'])) {
    notes.push('og:image is not an absolute URL — every platform requires one')
  }

  let imageNote = ''
  if (found['og:image']) {
    try {
      const img = await fetch(found['og:image'])
      const buf = Buffer.from(await img.arrayBuffer())
      const type = img.headers.get('content-type') ?? ''
      if (!img.ok) notes.push(`og:image returned ${img.status}`)
      else if (!type.startsWith('image/')) notes.push(`og:image content-type is ${type}`)
      else if (buf.length > MAX_IMAGE_BYTES) {
        notes.push(`og:image ${(buf.length / 1024).toFixed(0)}KB — over WhatsApp's practical limit`)
      }
      imageNote = `${(buf.length / 1024).toFixed(0)}KB`
    } catch (err) {
      notes.push(`og:image unreachable: ${err.message}`)
    }
  }

  for (const m of missing) problems.push(`${route}: missing ${m}`)
  for (const n of notes) problems.push(`${route}: ${n}`)

  const mark = missing.length || notes.length ? '✗' : '✓'
  console.log(
    `${route.padEnd(26)} ${mark} ${imageNote.padStart(6)}` +
      (missing.length ? `  missing: ${missing.join(', ')}` : '') +
      (notes.length ? `  ${notes.join('; ')}` : '')
  )
}

console.log(`\n${checked} routes checked against ${BASE}`)
if (problems.length) {
  console.log('\nProblems:')
  for (const p of problems) console.log(`  - ${p}`)
  process.exitCode = 1
} else {
  console.log('All routes have complete share metadata.')
}
