'use client'

import { useActionState } from 'react'
import { CheckCircle2, ChevronDown, LoaderCircle } from 'lucide-react'
import { partnershipInquiryAction, type FormState } from '@/app/actions'
import { EMAILS } from '@/lib/site'

const FIELD_CLASSES =
  'w-full rounded-[3px] border-2 border-[#1f1f1f] bg-[#fefefe] px-6 text-[14px] leading-5 text-[#2f363d] shadow-[4px_4px_0px_0px_#1f1f1f] [font-family:var(--font-raleway)] placeholder:text-[#9aa1a7] focus:outline-none focus:ring-2 focus:ring-[#fed07b]'

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[20px] font-semibold leading-[27px] text-[#2b3034] [font-family:var(--font-raleway)]">
      {children}
    </span>
  )
}

/**
 * Partnership enquiries. Submissions are written to the Notion Contact
 * Messages database tagged "Partnership inquiry" — add a Notion automation on
 * that database to forward new rows to brand@bcporigins.com.
 */
export function PartnershipForm({ partnershipTypes }: { partnershipTypes: string[] }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    partnershipInquiryAction,
    { status: 'idle' }
  )

  if (state.status === 'success') {
    return (
      <div className="flex w-full flex-col items-center gap-4 py-10 text-center">
        <CheckCircle2 className="size-12 text-[#2b3034]" strokeWidth={1.75} />
        <h3 className="text-[26px] font-semibold leading-9 text-[#121212] [font-family:var(--font-hepta-slab)]">
          Enquiry received
        </h3>
        <p className="max-w-[480px] text-[18px] leading-[27px] text-[#2b3034] [font-family:var(--font-raleway)]">
          {state.message}
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex w-full flex-col gap-5 px-2.5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <label className="flex flex-1 flex-col gap-1">
            <FieldLabel>Name</FieldLabel>
            <input
              name="name"
              type="text"
              required
              placeholder="Your name"
              className={`h-[50px] ${FIELD_CLASSES}`}
            />
          </label>
          <label className="flex flex-1 flex-col gap-1">
            <FieldLabel>Organization</FieldLabel>
            <input
              name="organization"
              type="text"
              placeholder="Your organization"
              className={`h-[50px] ${FIELD_CLASSES}`}
            />
          </label>
        </div>
        <label className="flex flex-col gap-1">
          <FieldLabel>Email</FieldLabel>
          <input
            name="email"
            type="email"
            required
            placeholder="you@company.com"
            className={`h-[50px] ${FIELD_CLASSES}`}
          />
        </label>
        <label className="flex flex-col gap-1">
          <FieldLabel>Type of partnership</FieldLabel>
          <span className="relative">
            <select
              name="partnershipType"
              className={`h-[50px] appearance-none pr-12 ${FIELD_CLASSES}`}
              defaultValue=""
            >
              <option value="" disabled>
                Select a partnership type
              </option>
              {partnershipTypes.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-5 top-1/2 size-4 -translate-y-1/2 text-[#2f363d]" />
          </span>
        </label>
        <label className="flex flex-col gap-1">
          <FieldLabel>Message</FieldLabel>
          <textarea
            name="message"
            required
            placeholder="Type your message"
            className={`h-[120px] resize-none py-2.5 text-[18px] leading-[27px] ${FIELD_CLASSES}`}
          />
        </label>
      </div>
      {state.status === 'error' && (
        <p className="text-[16px] font-semibold text-[#7a1d16] [font-family:var(--font-raleway)]">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="flex h-[60px] w-full items-center justify-center gap-2 rounded-[3px] border-2 border-[#1f1f1f] bg-[#fed07b] px-5 text-[18px] font-bold leading-7 text-[#2b3034] shadow-[4px_4px_0px_#1f1f1f] transition-transform [font-family:var(--font-raleway)] hover:-translate-y-0.5 disabled:opacity-70"
      >
        {pending && <LoaderCircle className="size-5 animate-spin" />}
        {pending ? 'Submitting…' : 'Submit Inquiry'}
      </button>
      <p className="text-center text-[15px] leading-6 text-[#5f5f64] [font-family:var(--font-raleway)]">
        Prefer email? Write to{' '}
        <a href={`mailto:${EMAILS.brand}`} className="text-[#1c75bc] hover:underline">
          {EMAILS.brand}
        </a>
        .
      </p>
    </form>
  )
}
