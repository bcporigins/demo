# BCP Origins — bcporigins.com

Marketing and community site for BCP Origins, a global community empowering young
Africans with the knowledge, network, and opportunities to build exceptional careers.

Next.js 16 App Router, React 19, Tailwind CSS v4, deployed on Vercel. Almost all
copy, people, events, and media come from Notion so the team can edit the site
without a developer.

---

## Quick start

```bash
npm install
cp .env.example .env.local     # then paste in the values (see Environment below)
npm run dev                    # http://localhost:3000
```

The site runs without any environment variables at all — every Notion-backed
section falls back to built-in content. You only need `.env.local` to see real
data or to test form submissions.

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit`. **There is no ESLint in this project** — `next lint` was removed in Next 16 |
| `npm run notion:doctor` | Checks every Notion table and reports why a section might be blank. **Start here when content isn't showing** |
| `npm run notion:setup <page-url>` | Creates all the content tables in a Notion page from scratch |

---

## How to think about this codebase

Three ideas explain almost everything:

**1. One page = one component.** Every route in `app/` is a thin file that sets
metadata and renders a single component from `components/bcp/`. `app/about/page.tsx`
is nine lines; the actual page is `components/bcp/about-page.tsx`. Look for the
component, not the route.

**2. All Notion access goes through `lib/notion.ts`.** There is exactly one Notion
client in the codebase. No API routes fetch Notion, no build scripts do. Server
Components call `getPeople()`, `getEvents()`, etc. directly and await them.

**3. Nothing breaks when Notion is unavailable.** Every getter catches its own
errors and returns fallback content or an empty array. A bad token, a deleted
table, or a network blip degrades one section instead of 500-ing the page.

```
app/                      routes — metadata + one component each
  actions.ts              server actions for every form on the site
  layout.tsx              fonts, nav, site-wide metadata
  sitemap.ts, robots.ts   generated from the route list + Notion
  icon.png, apple-icon.png, opengraph-image.png
components/bcp/           all 30 UI components; the real code lives here
  ui.tsx                  nav groups, footer, buttons, hero, socials — shared primitives
  nav.tsx                 header with dropdown menus
lib/
  notion.ts               every Notion read and write (~1,200 lines)
  site.ts                 links, emails, phone, socials — all env-overridable
  seo.ts                  per-page metadata builder
scripts/
  notion-doctor.mjs       CMS diagnostics
  setup-notion.mjs        creates the Notion tables
```

`@/` maps to the repo root, so `@/lib/notion` and `@/components/bcp/ui` resolve
from anywhere.

---

## The Notion CMS

All content tables live under one Notion page, **BCP Website CMS**. Each table's id
is a separate environment variable — the page id itself is never used by the code.

### Reading content

`lib/notion.ts` exposes one getter per section:

| Getter | Feeds | Env var |
| --- | --- | --- |
| `getPeople(group)` | Team page — Core Team, Regional Hosts, Advisors, Ambassadors | `NOTION_PEOPLE_DATABASE_ID` |
| `getTestimonials()` | Home page quote cards | `NOTION_TESTIMONIALS_DATABASE_ID` |
| `getStats()` | The four number tiles in the home collage | `NOTION_STATS_DATABASE_ID` |
| `getPartners()` | Logo marquee on home, partners, team | `NOTION_PARTNERS_DATABASE_ID` |
| `getUpcomingFlagship()` `getMiniEvents()` `getPastEvents()` | Events page, live calendar, home event band | `NOTION_EVENTS_DATABASE_ID` |
| `getVideos(group)` | Gallery highlights and event recaps | `NOTION_VIDEOS_DATABASE_ID` |
| `getResourceLinks(group)` | Host library, downloads, media kit | `NOTION_RESOURCES_DATABASE_ID` |
| `getPartnershipTypes()` | Partnership tier cards | `NOTION_PARTNERSHIPS_DATABASE_ID` |
| `getPosts()` `getPostBySlug()` `getPostsByType()` | Blog, origin stories, impact stories | `NOTION_DATABASE_ID` |
| `getRoles()` `getRoleBySlug()` | Careers | `NOTION_ROLES_DATABASE_ID` |
| `getFaqs()` | Home page FAQ | `NOTION_FAQS_DATABASE_ID` |
| `getGalleryEditions()` | Gallery collage | `NOTION_GALLERY_DATABASE_ID` |

Most of them route through one helper, `queryCollection()`, which does three things
worth knowing:

- **Filters on `Published = true`.** A row with the checkbox unticked does not exist
  as far as the site is concerned. This is the single most common reason "I filled
  the table and nothing happened".
- **Sorts by an `Order` number column** so the team controls sequence from Notion.
- **Swallows errors** and returns `null`, which the caller turns into fallback
  content. Check the server logs for `[notion] getX failed` — failures are logged,
  not surfaced.

### Writing — where forms go

`app/actions.ts` holds every form's server action. All of them write into Notion.

| Form | Lands in | Env var |
| --- | --- | --- |
| Newsletter / Join the Community | Subscribers | `NOTION_SUBSCRIBERS_DATABASE_ID` |
| Contact form | Contact Messages, `Source = Contact page` | `NOTION_CONTACT_DATABASE_ID` |
| Partnership enquiry | Contact Messages, `Source = Partnership inquiry` | `NOTION_CONTACT_DATABASE_ID` |
| Job application | Applications, CV attached to the row | `NOTION_APPLICATIONS_DATABASE_ID` |
| FAQ helpful/not helpful | Increments counters on the FAQ row | `NOTION_FAQS_DATABASE_ID` |
| Regional host application | **Tally**, not Notion — see below | `NEXT_PUBLIC_BCP_HOST_FORM_URL` |

**Nothing is emailed automatically.** Submissions sit in Notion until someone looks.
Notion automations (••• → Automations → When page added → Send email) are configured
per table in the workspace, not in this repo.

The regional host questionnaire is a Tally form embedded inline on `/events` and
`/regional-host`. Set `NEXT_PUBLIC_BCP_HOST_FORM_URL` to an empty value and a
built-in form takes over, writing to `NOTION_HOST_APPS_DATABASE_ID` instead.

### Fallback content, and why some of it should stay

When a table is empty, most getters return hardcoded content from `FALLBACK_*`
constants in `lib/notion.ts`. This keeps the design intact before the CMS is filled.

Two getters deliberately **do not** do this, and it matters:

- `getPeople()` returns `[]`
- `getTestimonials()` returns `[]`

They used to invent people — fifteen identical cards with the same name and stock
portrait — and three copies of an invented quote. The result was a page that looked
populated whether or not the CMS worked, which hid a real outage: the People rows
had been filled in but never published, and nothing on the page said so. Every
consumer now guards on `length === 0` and hides its section. **Don't reintroduce
fabricated people or quotes.** Named humans and attributed statements are not
placeholder material.

The remaining fallbacks are generic marketing copy and real BCP figures, which is a
different thing. Sections still running on built-in content today: partners, stats,
events, videos, resources, partnership types.

---

## Caching

Every Notion-backed page sets `export const revalidate = 60`, so edits in Notion
appear within about a minute with no redeploy. Static pages (`/about`, `/programs`,
`/contact`) have no revalidate because they have no Notion content.

Note the stale-while-revalidate behaviour: the first request after the window
expires still serves the old page and *triggers* the rebuild, so the change lands on
the next request. If you refresh once and see stale content, refresh again before
concluding anything is broken.

---

## Environment

Copy `.env.example` to `.env.local`. Everything is optional; missing values fall back.

- `NOTION_TOKEN` — integration secret. **The integration must also be shared to each
  database** (••• → Connections in Notion) or reads return 404.
- `NOTION_*_DATABASE_ID` — sixteen table ids, listed in `.env.example`.
- `NEXT_PUBLIC_SITE_URL` — canonical origin for metadata and the sitemap. Falls back
  to Vercel's `VERCEL_PROJECT_PRODUCTION_URL`, so it only needs setting for a custom
  domain.
- `NEXT_PUBLIC_BCP_*` — links, phone, socials. Defaults live in `lib/site.ts`; set a
  social to an empty value and its icon disappears sitewide rather than linking
  somewhere dead.

> A past outage was caused by these being present on Vercel but saved as **empty
> strings** — `NOTION_TOKEN=""` disables every read silently. `vercel env pull` to a
> scratch file and diff against `.env.local` before debugging anything else.

---

## Deployment

Vercel project **`demo`** under the **`team-bcp`** team, git-linked to
`bcporigins/demo` with production branch `main`. Pushing to `main` deploys.

- `www.bcporigins.com` serves the site; `bcporigins.com` 308-redirects to it.
- `.vercel.app` deployment URLs sit behind Vercel SSO — verify against the custom
  domain, not the deployment URL.

---

## Design system

There is no component library. The look is deliberately neo-brutalist and lives in
Tailwind classes.

| Token | Value | Used for |
| --- | --- | --- |
| Charcoal | `#2b3034` / `#1f1f1f` | Text, 6px borders, dark sections |
| Gold | `#fed07b` | Primary buttons, accents, active nav |
| Cream | `#fbfbfb` / `#ebe8e3` | Page and card backgrounds |
| Sage | `#91bd86` / `#b0c8a9` | Highlight panels |

- **Fonts:** Hepta Slab for headings, Raleway for body, Inter as a utility. Loaded in
  `layout.tsx` as CSS variables and referenced as `[font-family:var(--font-raleway)]`.
- **Buttons:** `BrutalButton` in `ui.tsx` — 2px border plus a hard offset shadow.
  Renders as a link, external link, or button depending on props.
- **Section headings:** 36px Hepta Slab bold. If you add one, match it.
- **Bordered boxes:** a `max-w-[…]` box needs horizontal padding **on its section**,
  or it runs flush to the screen edges below that width and the border reads as a
  stray full-bleed rule. This has been fixed twice.
- **Animations** live in `app/globals.css` under `bcp-*` names, each with a
  `prefers-reduced-motion` guard. Follow that pattern.

Navigation groups are defined once, in `NAV_GROUPS` in `components/bcp/ui.tsx`. The
header builds a dropdown per group, the footer renders them as columns, and the 404
page uses the flattened list — so a new page is added in one place.

---

## Gotchas

- **Notion image URLs expire after about an hour.** Anything from `getPeople().photo`
  or a post cover is a signed S3 link. That's why those render with plain `<img>`
  rather than `next/image` — Next would cache a URL that dies. Don't "fix" this.
- **`npm run lint` doesn't exist.** Use `npm run typecheck`.
- **Notion API version.** `@notionhq/client` v5 splits databases from data sources —
  you retrieve a database, read `data_sources[0].id`, then query *that*. See
  `getDataSourceId()`. Older Notion snippets you find online won't work.
- **Content not appearing?** Run `npm run notion:doctor` first. It will tell you
  whether the id is unset, the integration can't reach the table, a column the code
  reads is missing, or rows exist but aren't published.

---

## Related docs

- `NOTION-SETUP.md` — written for the non-technical team: what each table controls,
  which column does what, and where every form submission lands.
- `.env.example` — annotated list of every environment variable.
