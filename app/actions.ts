'use server'

import {
  voteFaq,
  submitHostApplication,
  submitContactMessage,
  subscribeEmail,
} from '@/lib/notion'

export type FormState =
  | { status: 'idle' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function faqVoteAction(faqId: string, helpful: boolean) {
  if (typeof faqId !== 'string' || faqId.length > 64) return { ok: false }
  return voteFaq(faqId, helpful)
}

export async function hostApplyAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const city = String(formData.get('city') ?? '').trim()
  const experience = String(formData.get('experience') ?? '').trim()
  const motivation = String(formData.get('motivation') ?? '').trim()
  const source = formData.get('source') === 'Events page' ? 'Events page' : 'Regional Host page'

  if (!name || !EMAIL_RE.test(email) || !city) {
    return { status: 'error', message: 'Please fill in your name, a valid email, and your city.' }
  }
  const result = await submitHostApplication({ name, email, city, experience, motivation, source })
  return result.ok
    ? {
        status: 'success',
        message: 'Thanks for applying to host a BCP event — our team will reach out soon.',
      }
    : { status: 'error', message: result.error }
}

export async function contactAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()

  if (!name || !EMAIL_RE.test(email) || !message) {
    return { status: 'error', message: 'Please fill in your name, a valid email, and a message.' }
  }
  const result = await submitContactMessage({ name, email, message })
  return result.ok
    ? { status: 'success', message: 'Message received — we usually respond within a couple of days.' }
    : { status: 'error', message: result.error }
}

export async function subscribeAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get('email') ?? '').trim()
  if (!EMAIL_RE.test(email)) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }
  const result = await subscribeEmail(email)
  return result.ok
    ? { status: 'success', message: 'You are in — welcome to the BCP community!' }
    : { status: 'error', message: result.error }
}
