#!/usr/bin/env node
/**
 * Checks every Notion table the site reads and prints why a section might be
 * showing nothing.
 *
 *   npm run notion:doctor
 *
 * For each table it reports: whether the id is set, whether the integration
 * can reach it, which columns exist versus the ones the code reads, and how
 * many rows are published. A filled table with zero published rows is the
 * single most common reason content does not appear on the site.
 *
 * Reads .env.local directly so it can be run without a dev server.
 */
import { Client } from '@notionhq/client'
import fs from 'node:fs'
import path from 'node:path'

const ENV_FILE = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(ENV_FILE)) {
  for (const m of fs.readFileSync(ENV_FILE, 'utf8').matchAll(/^([A-Z_][A-Z0-9_]*)=(.*)$/gm)) {
    if (!process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^"|"$/g, '')
  }
}

/** Table label -> [env var, columns lib/notion.ts reads, requires Published]. */
const TABLES = [
  ['Blog posts', 'NOTION_DATABASE_ID', ['Title', 'Slug', 'Type', 'Excerpt', 'Published', 'Date'], true],
  ['Job roles', 'NOTION_ROLES_DATABASE_ID', ['Title', 'Slug', 'Department', 'Location', 'Commitment', 'Summary', 'Published'], true],
  ['FAQs', 'NOTION_FAQS_DATABASE_ID', ['Question', 'Answer', 'Published'], true],
  ['Gallery', 'NOTION_GALLERY_DATABASE_ID', ['Title', 'Images', 'Published'], true],
  ['People', 'NOTION_PEOPLE_DATABASE_ID', ['Name', 'Group', 'Role', 'Bio', 'Photo', 'LinkedIn', 'Published', 'Order'], true],
  ['Partners', 'NOTION_PARTNERS_DATABASE_ID', ['Name', 'Logo', 'Website', 'Published', 'Order'], true],
  ['Impact Stats', 'NOTION_STATS_DATABASE_ID', ['Value', 'Label', 'Icon', 'Published', 'Order'], true],
  ['Testimonials', 'NOTION_TESTIMONIALS_DATABASE_ID', ['Quote', 'Name', 'Role', 'Photo', 'Published', 'Order'], true],
  ['Events', 'NOTION_EVENTS_DATABASE_ID', ['Title', 'Kind', 'Date', 'City', 'Summary', 'Register URL', 'Published'], true],
  ['Videos', 'NOTION_VIDEOS_DATABASE_ID', ['Title', 'Group', 'YouTube URL', 'Thumbnail', 'Published'], true],
  ['Resources', 'NOTION_RESOURCES_DATABASE_ID', ['Label', 'Group', 'URL', 'File', 'Published'], true],
  ['Partnership Types', 'NOTION_PARTNERSHIPS_DATABASE_ID', ['Title', 'Body', 'URL', 'Published'], true],
  ['Contact messages', 'NOTION_CONTACT_DATABASE_ID', [], false],
  ['Subscribers', 'NOTION_SUBSCRIBERS_DATABASE_ID', [], false],
  ['Host applications', 'NOTION_HOST_APPS_DATABASE_ID', [], false],
  ['Job applications', 'NOTION_APPLICATIONS_DATABASE_ID', [], false],
]

if (!process.env.NOTION_TOKEN) {
  console.error('NOTION_TOKEN is not set. Nothing can be checked.')
  process.exit(1)
}

const notion = new Client({ auth: process.env.NOTION_TOKEN })
const problems = []

for (const [label, envKey, expected, needsPublished] of TABLES) {
  const id = process.env[envKey]
  if (!id) {
    console.log(`${label.padEnd(20)} —  ${envKey} not set`)
    problems.push(`${label}: ${envKey} is not set`)
    continue
  }

  let db
  try {
    db = await notion.databases.retrieve({ database_id: id })
  } catch (err) {
    const hint =
      err.status === 404
        ? 'not found, or the integration has not been shared to it (••• → Connections)'
        : err.message.slice(0, 80)
    console.log(`${label.padEnd(20)} ✗  ${hint}`)
    problems.push(`${label}: unreachable — ${hint}`)
    continue
  }

  const dsId = db.data_sources?.[0]?.id ?? id
  let props = db.properties ?? {}
  try {
    const ds = await notion.dataSources.retrieve({ data_source_id: dsId })
    props = ds.properties ?? props
  } catch {
    // fall back to the database's own schema
  }

  const missing = expected.filter((name) => !(name in props))

  let total = 0
  let published = 0
  try {
    const all = await notion.dataSources.query({ data_source_id: dsId, page_size: 100 })
    total = all.results.length
    published = needsPublished
      ? all.results.filter((p) => p.properties?.Published?.checkbox === true).length
      : total
  } catch (err) {
    console.log(`${label.padEnd(20)} ✗  query failed: ${err.message.slice(0, 60)}`)
    problems.push(`${label}: query failed`)
    continue
  }

  const counts = needsPublished ? `${total} rows, ${published} published` : `${total} rows`
  let mark = '✓'
  if (missing.length) {
    mark = '✗'
    problems.push(`${label}: missing column(s) the code reads — ${missing.join(', ')}`)
  } else if (needsPublished && total > 0 && published === 0) {
    mark = '!'
    problems.push(`${label}: ${total} row(s) but none ticked Published — nothing will render`)
  } else if (needsPublished && total === 0) {
    mark = '·'
  }
  console.log(
    `${label.padEnd(20)} ${mark}  ${counts}${missing.length ? `  MISSING: ${missing.join(', ')}` : ''}`
  )
}

console.log('\nLegend: ✓ live   ! filled but unpublished   · empty   ✗ broken\n')
if (problems.length) {
  console.log('Problems found:')
  for (const p of problems) console.log(`  - ${p}`)
  process.exitCode = 1
} else {
  console.log('No problems found.')
}
