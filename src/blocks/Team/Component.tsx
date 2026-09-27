import type { TeamBlock as TeamBlockProps, TeamMember } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { getLocale } from '@/utilities/getLocale'
import { cn } from '@/utilities/ui'

const gridColumns: Record<NonNullable<TeamBlockProps['columns']>, string> = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
}

const imageSizes: Record<NonNullable<TeamBlockProps['columns']>, string> = {
  '2': '(min-width: 640px) 50vw, 100vw',
  '3': '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  '4': '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw',
}

const getInitials = (name?: string | null) => {
  const words = name?.trim().split(/\s+/).filter(Boolean) ?? []
  if (!words.length) return '?'
  const first = words[0]!.charAt(0)
  const last = words.length > 1 ? words[words.length - 1]!.charAt(0) : ''
  return (first + last).toUpperCase()
}

const TeamMemberCard: React.FC<{ member: TeamMember; sizes: string }> = ({ member, sizes }) => {
  const { description, fullName, image, name, position } = member

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border text-card-foreground shadow-sm transition-shadow hover:shadow-md">
      <div className="h-56 relative aspect-[1/1] overflow-hidden bg-muted">
        {image && typeof image === 'object' ? (
          <Media
            alt={name ?? undefined}
            fill
            imgClassName="h-56 object-cover transition-transform duration-500 group-hover:scale-105"
            resource={image}
            size="160px"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full items-center justify-center bg-primary/10 text-5xl font-bold text-primary"
          >
            {getInitials(name)}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <RichText
          className="text-xl font-bold leading-snug [&_p+p]:mt-1"
          data={fullName}
          enableGutter={false}
          enableProse={false}
        />
        {position && (
          <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-primary">
            {position}
          </p>
        )}
        {description && (
          <RichText
            className="mt-4 border-t border-border pt-4 text-base leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_ol]:list-inside [&_ol]:list-decimal [&_p+p]:mt-3 [&_ul]:list-inside [&_ul]:list-disc"
            data={description}
            enableGutter={false}
            enableProse={false}
          />
        )}
      </div>
    </article>
  )
}

export const TeamBlock: React.FC<TeamBlockProps & { id?: string }> = async (props) => {
  const { id, columns, introContent, members: selectedMembers, populateBy } = props

  let members: TeamMember[] = []

  if (populateBy === 'selection') {
    members = (selectedMembers ?? []).filter(
      (member): member is TeamMember => typeof member === 'object' && member.active !== false,
    )
  } else {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'team-members',
      depth: 1,
      locale: await getLocale(),
      pagination: false,
      sort: '_order',
      where: { active: { equals: true } },
    })
    members = docs
  }

  if (!members.length && !introContent) return null

  const columnCount = columns ?? '3'

  return (
    <section className="container my-16" id={`block-${id}`}>
      {introContent && (
        <RichText
          className="mx-auto mb-12 max-w-3xl text-center"
          data={introContent}
          enableGutter={false}
        />
      )}
      {members.length > 0 && (
        <div className={cn('grid grid-cols-1 gap-6 lg:gap-8', gridColumns[columnCount])}>
          {members.map((member) => (
            <TeamMemberCard key={member.id} member={member} sizes={imageSizes[columnCount]} />
          ))}
        </div>
      )}
    </section>
  )
}
