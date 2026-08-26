import { ImageResponse } from 'next/og'
import fs from 'node:fs'
import path from 'node:path'

/**
 * One share card design, used by every route's `opengraph-image.tsx`.
 *
 * 1200x630 is the size every platform crops from: X renders it whole in a
 * summary_large_image card, LinkedIn and Facebook letterbox it, and WhatsApp
 * shows a small square crop from the middle-left. The layout therefore keeps
 * everything meaningful inside the left two-thirds and away from the edges,
 * so it survives being cropped square.
 */

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

const FONT_DIR = path.join(process.cwd(), 'assets/fonts')
const font = (file: string) => fs.readFileSync(path.join(FONT_DIR, file))

// Read once per server instance rather than per request.
const heptaBold = font('hepta-slab-bold.ttf')
const ralewaySemi = font('raleway-semibold.ttf')
const ralewayRegular = font('raleway-regular.ttf')

// The wordmark, already inverted to white, inlined because Satori cannot
// fetch a relative URL while rendering.
const LOGO = `data:image/png;base64,${fs
  .readFileSync(path.join(process.cwd(), 'assets/og-logo.png'))
  .toString('base64')}`

const CHARCOAL = '#2b3034'
const GOLD = '#fed07b'
const CREAM = '#ebe8e3'
const MUTED = '#a9afb6'

export type OgCardProps = {
  /** Small gold line above the title — usually the section name. */
  eyebrow: string
  title: string
  /** One line of context. Keep it short; it is set at 30px. */
  subtitle?: string
}

export function bcpOgImage({ eyebrow, title, subtitle }: OgCardProps) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: CHARCOAL,
          padding: '64px 72px',
          position: 'relative',
        }}
      >
        {/* Brand rule down the left edge, mirroring the site's 6px borders. */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 16,
            backgroundColor: GOLD,
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO} alt="BCP Origins" height={52} width={185} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 900 }}>
          <div
            style={{
              fontFamily: 'Raleway',
              fontWeight: 600,
              fontSize: 24,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: GOLD,
              marginBottom: 20,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontFamily: 'Hepta Slab',
              fontSize: title.length > 46 ? 62 : 76,
              lineHeight: 1.12,
              color: CREAM,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                fontFamily: 'Raleway',
                fontSize: 30,
                lineHeight: 1.4,
                color: MUTED,
                marginTop: 24,
                maxWidth: 820,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'Raleway',
            fontSize: 26,
            color: MUTED,
          }}
        >
          <div style={{ display: 'flex' }}>bcporigins.com</div>
          <div style={{ display: 'flex', color: CREAM }}>
            Building the next generation of African talents
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Hepta Slab', data: heptaBold, weight: 700, style: 'normal' },
        { name: 'Raleway', data: ralewaySemi, weight: 600, style: 'normal' },
        { name: 'Raleway', data: ralewayRegular, weight: 400, style: 'normal' },
      ],
    }
  )
}
