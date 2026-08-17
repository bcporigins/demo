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
  })
  return `https://tally.so/embed/${tally[1]}?${params}`
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
  return (
    <iframe
      src={embedUrl(HOST_APPLICATION_FORM_URL)}
      title="Regional host application form"
      loading="lazy"
      className="h-[900px] w-full rounded-[3px] border-2 border-[#1f1f1f] bg-[#fefefe] shadow-[4px_4px_0px_0px_#1f1f1f]"
    />
  )
}
