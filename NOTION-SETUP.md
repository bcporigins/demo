# Editing the BCP site without a developer

Almost everything that changes year to year now comes from Notion. This page
explains what lives where, how to switch a section on, and — at the bottom —
exactly where each form submission ends up.

The site never breaks while a table is empty or disconnected: each section
falls back to the content that is baked into the code. You can connect one
table at a time.

---

## 1. One-time setup

1. Create a Notion integration at <https://notion.so/profile/integrations> and
   copy its secret into `.env.local` as `NOTION_TOKEN`.
2. Make a Notion page to hold the content tables (e.g. "BCP Website Content").
   Open it, click **•••  → Connections**, and connect your integration.
3. Run:

   ```bash
   npm run notion:setup <paste-that-page-URL>
   ```

   It creates all eight content tables with the right columns and prints the
   environment variables. Paste those into `.env.local` **and** into the Vercel
   project's Environment Variables, then redeploy.

Re-running the script is safe: it skips any table whose variable is already
set.

## 2. Two rules that apply to every table

- **Published** — a row only appears on the site when this checkbox is ticked.
- **Order** — a number controlling the sequence. Lowest first.

Changes appear on the live site within **60 seconds**; no redeploy needed.

---

## 3. What each table controls

### BCP — People
Core team, regional hosts, advisors, and community ambassadors, all in one
table split by the **Group** column.

| Column | What it does |
| --- | --- |
| Name | Shown on the front of the card |
| Group | `Core Team`, `Regional Host`, `Advisor`, or `Community Ambassador` |
| Role | Small gold line on the back of the card |
| Bio | The short bio revealed when the card flips |
| Photo | Portrait. Upload directly to the row |
| LinkedIn | Makes the LinkedIn icon on the card clickable |

The **Community Ambassadors** and **Advisors** sections stay hidden until you
add rows — nothing appears empty on the page. Core Team and Regional Hosts show
placeholder cards until you add real people.

### BCP — Partners
Logos in the home page marquee, the partners page, and Advisors & Partners.
Add a row per organisation with a **Logo** upload; set **Website** to make the
logo clickable.

### BCP — Impact Stats
The four number tiles in the home page collage, filled in **Order**.
`Value` is the big number ("100+"), `Label` the caption, `Icon` picks the
symbol above it.

### BCP — Testimonials
Quote cards on the home page. `Quote` is the row title — no quote marks
needed, the design adds them.

### BCP — Events
One table for everything dated.

- **Kind = Flagship** → the "Upcoming Event" band on the home page and the
  events page hero. The soonest future one wins.
- **Kind = Mini** → highlighted dates on the live calendar. Clicking a
  highlighted day shows the title, city, summary, and a Register button.
- Anything whose **Date** has passed becomes a **Past Events** card.

`Register URL` is where the Register buttons point. Leave it blank and they
fall back to an email to help@bcporigins.com.

### BCP — Videos
`Group = Highlight` fills the gallery carousel (cards open YouTube in a new
tab). `Group = Recap` fills the three large recap cards, which play inline.
Paste any YouTube link into **YouTube URL** — watch, youtu.be, shorts, and
live URLs all work. Leave **Thumbnail** empty to use YouTube's own still.

### BCP — Resources
| Group | Where it appears |
| --- | --- |
| `Host Library` | Resource Library on /regional-host |
| `Download` | Downloads section on /resources |
| `Media Kit` | Logo download buttons on /resources |

Set **URL** for an external link, or upload to **File** to host it in Notion.
A Download card with neither shows "Coming soon" instead of a dead button.

### BCP — Partnership Types
The "Find the right partnership for you" cards. **URL** is where *Read More*
goes — usually a public Notion page describing that tier. With no URL the link
becomes *Enquire* and scrolls to the form.

### Blog (the existing `NOTION_DATABASE_ID` table)
Two extra uses beyond the blog itself, driven by the post's **Type**:

- `Origin Story` → the four clickable cards in "Origin stories" on /community
- `Impact Story` → the three cards in "Our impact in action" on /partners

Both fall back to the current static cards until you publish posts of that
type.

---

## 4. Links and contact details

These are not in Notion. They live in `lib/site.ts` and can each be overridden
with an environment variable (see `.env.example`), which means they can be
changed from the Vercel dashboard without editing code:

WhatsApp community, YouTube channel, the host questionnaire URL, the phone
number, and the five social accounts. **Blank out a social URL and its icon
disappears from the site** rather than linking somewhere broken.

### The host questionnaire
Set `NEXT_PUBLIC_BCP_HOST_FORM_URL` to a Tally link (`https://tally.so/r/xxxx`)
and it is embedded inline on both /events and /regional-host, replacing the
short built-in form. You then edit the questions entirely in Tally. Leave it
blank and the built-in form runs instead — the page is never empty.

### Images that are not in Notion
Replace the file in `public/bcp/` keeping the same filename:

- `speaker.png` — the portrait beside "Become a Speaker"
- `partner-photo-1.png`, `partner-photo-2.png` — the two photos beside the
  partner benefits list
- `hero-photo.png`, `events-hero.png`, `collage-*.png` — hero and collage shots

---

## 5. Where every submission goes

| Form | Where it lands | Env var |
| --- | --- | --- |
| Newsletter / "Join the Community" email box (every page footer band) | Notion **Subscribers** | `NOTION_SUBSCRIBERS_DATABASE_ID` |
| Contact form (/contact) | Notion **Contact Messages**, `Source = Contact page` | `NOTION_CONTACT_DATABASE_ID` |
| "Let's Build Together" partnership enquiry (/partners) | The **same** Contact Messages table, `Source = Partnership inquiry`, with Organization and Partnership Type recorded | `NOTION_CONTACT_DATABASE_ID` |
| Host a BCP Regional Event (/events) | Notion **Host Applications**, `Source = Events page` | `NOTION_HOST_APPS_DATABASE_ID` |
| Host Application Form (/regional-host) | Notion **Host Applications**, `Source = Regional Host page` | `NOTION_HOST_APPS_DATABASE_ID` |
| Job application (/careers/…) | Notion **Applications**, CV attached to the row | `NOTION_APPLICATIONS_DATABASE_ID` |
| FAQ "was this helpful" votes | Increments Helpful / Not Helpful on the FAQ row | `NOTION_FAQS_DATABASE_ID` |
| Apply to Speak (/events) | Opens an email to **brand@bcporigins.com** — no database |
| Partner with Us (home page) | Scrolls to the partnership form on /partners — no database |

**Nothing is emailed automatically.** Every submission lands in Notion and
someone has to look there. To get notified instead, open the database in Notion
and add an automation: **•••  → Automations → When page added → Send
notification / Send email**. Point the Contact Messages one at
brand@bcporigins.com for partnership rows and help@bcporigins.com for the rest.

If a table is not connected, the matching form tells the visitor to email
help@bcporigins.com (or brand@bcporigins.com for partnerships) instead of
silently failing.
