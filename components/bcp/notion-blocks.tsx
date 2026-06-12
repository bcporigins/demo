import type { NotionBlock } from '@/lib/notion'

/* ------------------------------------------------------------------ */
/* Renders Notion blocks in the BCP design language: Hepta Slab        */
/* headings, Raleway body, 6px borders and hard shadows on media.      */
/* ------------------------------------------------------------------ */

type RichText = {
  plain_text: string
  href?: string | null
  annotations?: {
    bold?: boolean
    italic?: boolean
    strikethrough?: boolean
    underline?: boolean
    code?: boolean
  }
}

function Text({ richText }: { richText: RichText[] | undefined }) {
  if (!richText?.length) return null
  return (
    <>
      {richText.map((t, i) => {
        let node: React.ReactNode = t.plain_text
        const a = t.annotations ?? {}
        if (a.code)
          node = (
            <code className="rounded-[2px] bg-[#ebe8e3] px-1.5 py-0.5 font-mono text-[0.9em] text-[#2b3034]">
              {node}
            </code>
          )
        if (a.bold) node = <strong className="font-bold">{node}</strong>
        if (a.italic) node = <em>{node}</em>
        if (a.strikethrough) node = <s>{node}</s>
        if (a.underline) node = <u>{node}</u>
        if (t.href)
          node = (
            <a
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#1c75bc] underline decoration-2 underline-offset-2 hover:text-[#2b3034]"
            >
              {node}
            </a>
          )
        return <span key={i}>{node}</span>
      })}
    </>
  )
}

function blockData(block: NotionBlock): any {
  return (block as any)[block.type] ?? {}
}

/* ----------------------- table of contents ------------------------- */

// Stable anchor id derived from the block id, so the server-rendered
// heading and the TOC always agree. Use the id's tail — Notion block ids
// share a time-based prefix, so the leading characters collide.
export function headingAnchor(block: NotionBlock): string {
  return `h-${block.id.replace(/-/g, '').slice(-12)}`
}

export type TocHeading = { id: string; text: string; level: 1 | 2 | 3 }

export function extractHeadings(blocks: NotionBlock[]): TocHeading[] {
  const headings: TocHeading[] = []
  for (const block of blocks) {
    if (block.type === 'heading_1' || block.type === 'heading_2' || block.type === 'heading_3') {
      const text = ((blockData(block).rich_text ?? []) as { plain_text: string }[])
        .map((t) => t.plain_text)
        .join('')
        .trim()
      if (text) {
        headings.push({
          id: headingAnchor(block),
          text,
          level: Number(block.type.slice(-1)) as 1 | 2 | 3,
        })
      }
    }
  }
  return headings
}

function imageUrl(data: any): string | null {
  return data?.type === 'external' ? data.external?.url : data?.file?.url ?? null
}

function Block({ block }: { block: NotionBlock }) {
  const data = blockData(block)

  switch (block.type) {
    case 'heading_1':
      return (
        <h2
          id={headingAnchor(block)}
          className="mt-12 scroll-mt-28 text-[32px] font-bold leading-[1.3] text-[#121212] [font-family:var(--font-hepta-slab)]"
        >
          <Text richText={data.rich_text} />
        </h2>
      )
    case 'heading_2':
      return (
        <h3
          id={headingAnchor(block)}
          className="mt-10 scroll-mt-28 text-[26px] font-semibold leading-[1.3] text-[#121212] [font-family:var(--font-hepta-slab)]"
        >
          <Text richText={data.rich_text} />
        </h3>
      )
    case 'heading_3':
      return (
        <h4
          id={headingAnchor(block)}
          className="mt-8 scroll-mt-28 text-[21px] font-semibold leading-[1.3] text-[#121212] [font-family:var(--font-hepta-slab)]"
        >
          <Text richText={data.rich_text} />
        </h4>
      )
    case 'paragraph':
      if (!data.rich_text?.length) return null
      return (
        <p className="text-[19px] leading-[34px] text-[#414141] [font-family:var(--font-raleway)]">
          <Text richText={data.rich_text} />
        </p>
      )
    case 'quote':
      return (
        <blockquote className="border-[6px] border-[#2b3034] bg-[#f3f2f8] p-6 text-[20px] font-medium italic leading-9 text-[#2b3034] shadow-[6px_6px_0px_#1f1f1f] [font-family:var(--font-raleway)]">
          <Text richText={data.rich_text} />
          {block.children?.map((child) => <Block key={child.id} block={child} />)}
        </blockquote>
      )
    case 'callout':
      return (
        <aside className="flex gap-3 border-[3px] border-[#1f1f1f] bg-[#fed07b]/30 p-5 text-[18px] leading-8 text-[#2b3034] [font-family:var(--font-raleway)]">
          {data.icon?.type === 'emoji' && <span className="text-[22px]">{data.icon.emoji}</span>}
          <div>
            <Text richText={data.rich_text} />
            {block.children?.map((child) => <Block key={child.id} block={child} />)}
          </div>
        </aside>
      )
    case 'image': {
      const url = imageUrl(data)
      if (!url) return null
      const caption = data.caption as RichText[] | undefined
      return (
        <figure className="my-4">
          {/* Notion file URLs are short-lived signed links; plain img avoids
              next/image caching a URL that expires before revalidation */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={caption?.length ? caption.map((c) => c.plain_text).join('') : ''}
            className="w-full border-[6px] border-[#2b3034] object-cover"
          />
          {caption && caption.length > 0 && (
            <figcaption className="mt-3 text-center text-[15px] text-[#5f5f64] [font-family:var(--font-raleway)]">
              <Text richText={caption} />
            </figcaption>
          )}
        </figure>
      )
    }
    case 'divider':
      return <hr className="my-8 border-t-[3px] border-[#2b3034]" />
    case 'code':
      return (
        <pre className="overflow-x-auto rounded-[3px] border-2 border-[#1f1f1f] bg-[#2b3034] p-5 text-[14px] leading-6 text-[#ebe8e3] shadow-[4px_4px_0px_#1f1f1f]">
          <code>{(data.rich_text ?? []).map((t: RichText) => t.plain_text).join('')}</code>
        </pre>
      )
    case 'toggle':
      return (
        <details className="border-2 border-[#2b3034] p-4 [font-family:var(--font-raleway)]">
          <summary className="cursor-pointer text-[18px] font-semibold text-[#2b3034]">
            <Text richText={data.rich_text} />
          </summary>
          <div className="mt-3 flex flex-col gap-4">
            {block.children?.map((child) => <Block key={child.id} block={child} />)}
          </div>
        </details>
      )
    case 'bookmark':
    case 'embed':
      return (
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block truncate border-2 border-[#2b3034] p-4 text-[17px] font-semibold text-[#1c75bc] underline [font-family:var(--font-raleway)] hover:bg-[#ebe8e3]"
        >
          {data.url}
        </a>
      )
    case 'video': {
      const url = imageUrl(data) ?? data.external?.url
      if (!url) return null
      return (
        <video controls src={url} className="w-full border-[6px] border-[#2b3034]">
          <a href={url}>Watch video</a>
        </video>
      )
    }
    default:
      return null
  }
}

function ListItem({ block }: { block: NotionBlock }) {
  const data = blockData(block)
  return (
    <li className="text-[19px] leading-[34px] text-[#414141] [font-family:var(--font-raleway)]">
      <Text richText={data.rich_text} />
      {block.children && block.children.length > 0 && (
        <NotionContent blocks={block.children} className="mt-2" />
      )}
    </li>
  )
}

export function NotionContent({
  blocks,
  className = '',
}: {
  blocks: NotionBlock[]
  className?: string
}) {
  // Group consecutive list items into single <ul>/<ol> elements
  type Group =
    | { kind: 'list'; listType: 'ul' | 'ol'; items: NotionBlock[] }
    | { kind: 'block'; block: NotionBlock }
  const groups: Group[] = []
  for (const block of blocks) {
    const listType =
      block.type === 'bulleted_list_item' ? 'ul' : block.type === 'numbered_list_item' ? 'ol' : null
    if (listType) {
      const last = groups[groups.length - 1]
      if (last?.kind === 'list' && last.listType === listType) last.items.push(block)
      else groups.push({ kind: 'list', listType, items: [block] })
    } else {
      groups.push({ kind: 'block', block })
    }
  }

  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      {groups.map((group, i) =>
        group.kind === 'list' ? (
          group.listType === 'ul' ? (
            <ul key={i} className="flex list-disc flex-col gap-2 pl-7 marker:text-[#2b3034]">
              {group.items.map((item) => (
                <ListItem key={item.id} block={item} />
              ))}
            </ul>
          ) : (
            <ol key={i} className="flex list-decimal flex-col gap-2 pl-7 marker:font-bold marker:text-[#2b3034]">
              {group.items.map((item) => (
                <ListItem key={item.id} block={item} />
              ))}
            </ol>
          )
        ) : (
          <Block key={group.block.id} block={group.block} />
        )
      )}
    </div>
  )
}
