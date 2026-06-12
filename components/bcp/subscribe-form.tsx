'use client'

import { useActionState } from 'react'
import { CheckCircle2, LoaderCircle } from 'lucide-react'
import { subscribeAction, type FormState } from '@/app/actions'

export function SubscribeForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(subscribeAction, {
    status: 'idle',
  })

  if (state.status === 'success') {
    return (
      <div className="mt-5 flex h-[60px] w-full max-w-[706px] items-center justify-center gap-3 rounded-[2px] border-[3px] border-[#2b3034] bg-[#91bd86]">
        <CheckCircle2 className="size-6 text-[#2b3034]" strokeWidth={2} />
        <p className="text-[17px] font-semibold text-[#2b3034] [font-family:var(--font-raleway)]">
          {state.message}
        </p>
      </div>
    )
  }

  return (
    <div className="mt-5 flex w-full max-w-[706px] flex-col">
      <form action={formAction} className="flex w-full flex-col items-center gap-4 sm:flex-row sm:gap-[44px]">
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          className="h-[60px] w-full shrink-0 rounded-[2px] border-[3px] border-[#2b3034] bg-[#f1f1f4] px-[26px] text-[16px] text-[#2b3034] [font-family:var(--font-raleway)] placeholder:text-[#5f5f64] focus:outline-none focus:ring-2 focus:ring-[#fed07b] sm:w-auto sm:flex-1"
        />
        <button
          type="submit"
          disabled={pending}
          className="flex h-[60px] w-full items-center justify-center gap-2 rounded-[3px] border-2 border-[#1f1f1f] bg-[#fed07b] px-5 text-[18px] font-bold leading-7 text-[#2b3034] shadow-[4px_4px_0px_#1f1f1f] transition-transform [font-family:var(--font-raleway)] hover:-translate-y-0.5 disabled:opacity-70 sm:w-[232px]"
        >
          {pending && <LoaderCircle className="size-5 animate-spin" />}
          {pending ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
      {state.status === 'error' && (
        <p className="mt-2 text-left text-[15px] font-semibold text-[#b3261e] [font-family:var(--font-raleway)]">
          {state.message}
        </p>
      )}
    </div>
  )
}
