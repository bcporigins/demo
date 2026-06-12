import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, MapPin, Clock, Tag } from 'lucide-react'
import { BcpHero, JoinCommunity, BcpFooter } from '@/components/bcp/ui'
import { NotionContent } from '@/components/bcp/notion-blocks'
import { ApplyForm } from '@/components/bcp/apply-form'
import { ShareButtons } from '@/components/bcp/share-buttons'
import { getRoleBySlug, getRoles } from '@/lib/notion'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const roles = await getRoles()
  return roles.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const result = await getRoleBySlug(slug)
  if (!result) return { title: 'Careers | BCP' }
  return {
    title: `${result.role.title} | Careers | BCP`,
    description: result.role.summary || undefined,
  }
}

function MetaChip({ icon: Icon, label }: { icon: typeof MapPin; label: string }) {
  return (
    <span className="flex items-center gap-2 border-2 border-[#2b3034] bg-[#fbfbfb] px-3.5 py-1.5 text-[16px] font-semibold text-[#2b3034] [font-family:var(--font-raleway)]">
      <Icon className="size-4" strokeWidth={2} />
      {label}
    </span>
  )
}

export default async function RolePage({ params }: Props) {
  const { slug } = await params
  const result = await getRoleBySlug(slug)
  if (!result) notFound()
  const { role, blocks } = result

  return (
    <main className="min-h-screen bg-[#fbfbfb]">
      <BcpHero title={role.title} subtitle={role.summary || undefined} subtitleSize="sm" />
      <section className="relative overflow-hidden py-[70px]">
        <img
          src="/bcp/wave-2.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full object-cover opacity-30"
        />
        <div className="relative mx-auto flex max-w-[860px] flex-col gap-10 px-6">
          <div className="flex flex-col gap-6">
            <Link
              href="/careers"
              className="flex w-fit items-center gap-2 text-[17px] font-semibold text-[#1c75bc] [font-family:var(--font-raleway)] hover:underline"
            >
              <ArrowLeft className="size-4" /> All open roles
            </Link>
            <div className="flex flex-wrap gap-3">
              <MetaChip icon={Tag} label={role.department} />
              <MetaChip icon={MapPin} label={role.location} />
              <MetaChip icon={Clock} label={role.commitment} />
            </div>
            <ShareButtons title={`${role.title} — BCP Careers`} label="Share this role" />
          </div>
          <NotionContent blocks={blocks} />
          <div className="mt-6">
            <ApplyForm roleTitle={role.title} roleSlug={role.slug} />
          </div>
        </div>
      </section>
      <JoinCommunity />
      <BcpFooter />
    </main>
  )
}
