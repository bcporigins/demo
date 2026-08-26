'use client'

import Script from 'next/script'
import { HostApplyForm } from '@/components/bcp/host-apply-form'
import { HOST_APPLICATION_FORM_URL } from '@/lib/site'

/** Turns a shared Tally link (tally.so/r/xxxx) into its embeddable form,
 *  and leaves any other URL — a Google Form, Typeform, etc. — untouched. */
function embedUrl(url: string) {
  const tally = url.match(/^https:\/\/tally\.so\/r\/([A-Za-z0-9]+)/)
  if (!tally) return url
  const params = new URLSearchParams({
    alignLeft: '1',
    hideTitle: '1',
    transparentBackground: '1',
    // Tally's embed script only takes over the sizing of a frame whose src
    // asks for it by name; without this the form scrolls inside a fixed box.
    dynamicHeight: '1',
  })
  return `https://tally.so/embed/${tally[1]}?${params}`
}

function isTally(url: string) {
  return /^https:\/\/tally\.so\//.test(url)
}

/**
 * The regional-host questionnaire. When a form URL is configured in
 * lib/site.ts (or NEXT_PUBLIC_BCP_HOST_FORM_URL) it is embedded inline so the
 * questions can be edited in Tally; otherwise the built-in short form runs,
 * writing to the Notion "Host Applications" database. Either way the section
 * always renders something a visitor can submit.
 */
export function HostApplication({
  source,
  submitLabel = 'Submit',
}: {
  source: 'Events page' | 'Regional Host page'
  submitLabel?: string
}) {
  if (!HOST_APPLICATION_FORM_URL) {
    return <HostApplyForm source={source} submitLabel={submitLabel} />
  }

  const src = embedUrl(HOST_APPLICATION_FORM_URL)
  const tally = isTally(HOST_APPLICATION_FORM_URL)

  return (
    <>
      <iframe
        // Plain `src`, deliberately without Tally's `data-tally-src`: their
        // script only adopts an iframe that has one attribute or the other,
        // and this way the form still loads at the fallback height below if
        // the script is blocked. Once adopted it sets an inline height, which
        // overrides the class here, so the form never scrolls inside its box.
        src={src}
        title="Regional host application form"
        loading="lazy"
        className="h-[900px] w-full rounded-[3px] border-2 border-[#1f1f1f] bg-[#fefefe] shadow-[4px_4px_0px_0px_#1f1f1f]"
      />
      {tally && (
        <Script
          src="https://tally.so/widgets/embed.js"
          strategy="lazyOnload"
          onLoad={() => {
            // @ts-expect-error — injected by the embed script
            window.Tally?.loadEmbeds()
          }}
        />
      )}
    </>
  )
}
