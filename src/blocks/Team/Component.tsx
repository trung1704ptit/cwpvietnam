import type { TeamBlock as TeamBlockProps, TeamMember } from '@/payload-types'

import configPromise from '@payload-config'
import { ChevronDown } from 'lucide-react'
import { getPayload } from 'payload'
import React from 'react'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { getMessages, type Messages } from '@/i18n/messages'
import { getLocale } from '@/utilities/getLocale'
import { cn } from '@/utilities/ui'

const getInitials = (name?: string | null) => {
  const words = name?.trim().split(/\s+/).filter(Boolean) ?? []
  if (!words.length) return '?'
  const first = words[0]!.charAt(0)
  const last = words.length > 1 ? words[words.length - 1]!.charAt(0) : ''
  return (first + last).toUpperCase()
}

const TeamMemberRow: React.FC<{ member: TeamMember; t: Messages }> = ({ member, t }) => {
  const { description, fullName, image, name, position } = member

  return (
    <article className="flex items-start gap-5 rounded-xl border border-border bg-white p-5 text-card-foreground shadow-sm transition-shadow hover:shadow-md sm:gap-8 sm:p-6 dark:bg-card">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-full bg-muted ring-4 ring-primary/10 sm:size-28">
        {image && typeof image === 'object' ? (
          <Media
            alt={name ?? undefined}
            fill
            imgClassName="object-cover"
            resource={image}
            size="112px"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full items-center justify-center bg-primary/10 text-2xl font-bold text-primary sm:text-3xl"
          >
            {getInitials(name)}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <RichText
          className="text-lg font-bold leading-snug sm:text-xl [&_p+p]:mt-1"
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
          <details className="group/details mt-3">
            <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-sm font-medium text-primary hover:underline [&::-webkit-details-marker]:hidden">
              <span className="group-open/details:hidden">{t.showDetails}</span>
              <span className="hidden group-open/details:inline">{t.hideDetails}</span>
              <ChevronDown
                aria-hidden="true"
                className="size-4 transition-transform group-open/details:rotate-180"
              />
            </summary>
            <RichText
              className="mt-3 border-t border-border pt-3 text-base leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_ol]:list-inside [&_ol]:list-decimal [&_p+p]:mt-3 [&_ul]:list-inside [&_ul]:list-disc"
              data={description}
              enableGutter={false}
              enableProse={false}
            />
          </details>
        )}
      </div>
    </article>
  )
}

export const TeamBlock: React.FC<TeamBlockProps & { id?: string }> = async (props) => {
  const { id, introContent, members: selectedMembers, populateBy } = props
  const locale = await getLocale()
  const t = getMessages(locale)

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
      locale,
      pagination: false,
      sort: '_order',
      where: { active: { equals: true } },
    })
    members = docs
  }

  if (!members.length && !introContent) return null

  return (
    <section className="container my-16" id={`block-${id}`}>
      {introContent && (
        <RichText className="mx-auto max-w-4xl" data={introContent} enableGutter={false} />
      )}
      {members.length > 0 && (
        <ul className={cn('mx-auto max-w-4xl space-y-4', introContent && 'mt-6')}>
          {members.map((member) => (
            <li key={member.id}>
              <TeamMemberRow member={member} t={t} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
