#!/usr/bin/env node
/**
 * Creates every editable-content database this site reads from, inside a
 * Notion page you choose, and prints the environment variables to paste into
 * .env.local (and into Vercel).
 *
 *   node scripts/setup-notion.mjs <notion-page-url-or-id>
 *
 * Safe to re-run: databases whose env var is already set are skipped, so you
 * can add the tables you skipped the first time without duplicating any.
 */

import { readFileSync } from 'node:fs'
import { Client } from '@notionhq/client'

/* ----------------------------- env loading ----------------------------- */

function loadEnvLocal() {
  try {
    for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, '')
      }
    }
  } catch {
    // No .env.local yet — NOTION_TOKEN may still come from the shell
  }
}

/** Accepts a full Notion URL or a bare id, with or without dashes. */
function parsePageId(input) {
  const hex = (input.match(/[0-9a-f]{32}/i) ?? input.match(/[0-9a-f-]{36}/i))?.[0]
  if (!hex) return null
  const bare = hex.replace(/-/g, '')
  return `${bare.slice(0, 8)}-${bare.slice(8, 12)}-${bare.slice(12, 16)}-${bare.slice(
    16,
    20
  )}-${bare.slice(20)}`
}

/* --------------------------- database schemas -------------------------- */

const title = () => ({ title: {} })
const text = () => ({ rich_text: {} })
const select = (...options) => ({ select: { options: options.map((name) => ({ name })) } })
const number = () => ({ number: { format: 'number' } })
const checkbox = () => ({ checkbox: {} })
const url = () => ({ url: {} })
const files = () => ({ files: {} })
const date = () => ({ date: {} })

// Order matters only for readability of the printed output.
const DATABASES = [
  {
    env: 'NOTION_PEOPLE_DATABASE_ID',
    name: 'BCP — People',
    hint: 'Core team, regional hosts, advisors, and community ambassadors (COAs)',
    properties: {
      Name: title(),
      Group: select('Core Team', 'Regional Host', 'Advisor', 'Community Ambassador'),
      Role: text(),
      Bio: text(),
      Photo: files(),
      LinkedIn: url(),
      Order: number(),
      Published: checkbox(),
    },
  },
  {
    env: 'NOTION_PARTNERS_DATABASE_ID',
    name: 'BCP — Partners',
    hint: 'Logos shown in the home marquee, the partners page, and Advisors & Partners',
    properties: {
      Name: title(),
      Logo: files(),
      Website: url(),
      Order: number(),
      Published: checkbox(),
    },
  },
  {
    env: 'NOTION_STATS_DATABASE_ID',
    name: 'BCP — Impact Stats',
    hint: 'The four number tiles in the home page collage, in Order',
    properties: {
      Value: title(),
      Label: text(),
      Icon: select('users', 'globe', 'briefcase', 'speech', 'award', 'building', 'calendar', 'location', 'sparkles'),
      Order: number(),
      Published: checkbox(),
    },
  },
  {
    env: 'NOTION_TESTIMONIALS_DATABASE_ID',
    name: 'BCP — Testimonials',
    hint: 'Quote cards on the home page',
    properties: {
      Quote: title(),
      Name: text(),
      Role: text(),
      Photo: files(),
      Order: number(),
      Published: checkbox(),
    },
  },
  {
    env: 'NOTION_EVENTS_DATABASE_ID',
    name: 'BCP — Events',
    hint: 'Kind=Flagship drives the hero and Upcoming Event; Kind=Mini fills the live calendar. Anything dated in the past becomes a Past Events card.',
    properties: {
      Title: title(),
      Kind: select('Flagship', 'Mini'),
      Tagline: text(),
      Date: date(),
      City: text(),
      Summary: text(),
      Cover: files(),
      'Register URL': url(),
      Order: number(),
      Published: checkbox(),
    },
  },
  {
    env: 'NOTION_VIDEOS_DATABASE_ID',
    name: 'BCP — Videos',
    hint: 'Group=Highlight feeds the gallery carousel; Group=Recap feeds the three recap players',
    properties: {
      Title: title(),
      Group: select('Highlight', 'Recap'),
      Subtitle: text(),
      Location: text(),
      'YouTube URL': url(),
      Thumbnail: files(),
      Order: number(),
      Published: checkbox(),
    },
  },
  {
    env: 'NOTION_RESOURCES_DATABASE_ID',
    name: 'BCP — Resources',
    hint: 'Host Library = regional host page; Download and Media Kit = resources page',
    properties: {
      Label: title(),
      Group: select('Host Library', 'Download', 'Media Kit'),
      Description: text(),
      Icon: select('book', 'checklist', 'palette', 'file', 'download', 'deck', 'video'),
      URL: url(),
      File: files(),
      Order: number(),
      Published: checkbox(),
    },
  },
  {
    env: 'NOTION_PARTNERSHIPS_DATABASE_ID',
    name: 'BCP — Partnership Types',
    hint: 'The "Find the right partnership for you" cards; URL is where Read More goes',
    properties: {
      Title: title(),
      Body: text(),
      URL: url(),
      Order: number(),
      Published: checkbox(),
    },
  },
]

/* -------------------------------- main --------------------------------- */

async function main() {
  loadEnvLocal()

  const token = process.env.NOTION_TOKEN
  if (!token) {
    console.error('NOTION_TOKEN is not set. Add it to .env.local first.')
    process.exit(1)
  }

  const pageId = parsePageId(process.argv[2] ?? '')
  if (!pageId) {
    console.error('Usage: node scripts/setup-notion.mjs <notion-page-url-or-id>\n')
    console.error('Create (or pick) a Notion page to hold the tables, connect your')
    console.error('integration to it via ••• → Connections, then pass its URL here.')
    process.exit(1)
  }

  const notion = new Client({ auth: token })
  const created = []
  const skipped = []

  for (const db of DATABASES) {
    if (process.env[db.env]) {
      skipped.push(db)
      continue
    }
    process.stdout.write(`Creating ${db.name} … `)
    try {
      const res = await notion.databases.create({
        parent: { type: 'page_id', page_id: pageId },
        title: [{ type: 'text', text: { content: db.name } }],
        initial_data_source: { properties: db.properties },
      })
      created.push({ ...db, id: res.id })
      console.log('done')
    } catch (err) {
      console.log('FAILED')
      console.error(`  ${err.message}`)
      console.error('  Check the integration is connected to the parent page.')
      process.exit(1)
    }
  }

  console.log('')
  if (skipped.length > 0) {
    console.log(`Skipped ${skipped.length} already configured: ${skipped.map((d) => d.env).join(', ')}\n`)
  }
  if (created.length === 0) {
    console.log('Nothing to do — every database is already configured.')
    return
  }

  console.log('Add these to .env.local and to your Vercel project settings:\n')
  for (const db of created) console.log(`${db.env}=${db.id.replace(/-/g, '')}`)
  console.log('\nEach table starts empty, and the site keeps showing its built-in')
  console.log('content until you add rows. Remember to tick "Published" on a row')
  console.log('for it to appear, and set "Order" to control the sequence.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
