'use client'

import { Hash, Loader2, X } from 'lucide-react'
import React, { useRef, useState, useTransition } from 'react'

import { LocalizedLink as Link } from '@/components/LocalizedLink'
import type { Locale } from '@/i18n/config'
import { getMessages, type Messages } from '@/i18n/messages'
import { cn } from '@/utilities/ui'

import { loadPosts } from './actions'
import { formatPostDate, getPostHref, PostCard, PostThumbnail } from './PostCard'
import type { PostCardData, PostCardsPage, PostsFilter, PostsTaxonomy, TaxonomyItem } from './queries'

const gridColumns: Record<string, string> = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-1 sm:grid-cols-2',
  '3': 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3',
}

const isSameFilter = (a: PostsFilter | null, b: PostsFilter | null) =>
  a?.type === b?.type && a?.id === b?.id

const SidebarSection: React.FC<{ children: React.ReactNode; title: string }> = ({
  children,
  title,
}) => (
  <section className="rounded-xl border border-border bg-white p-5 shadow-sm dark:bg-card">
    <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
      <span aria-hidden="true" className="h-5 w-1 rounded-full bg-primary" />
      {title}
    </h2>
    {children}
  </section>
)

const CategoryButton: React.FC<{
  active: boolean
  count: number
  label: string
  onClick: () => void
}> = ({ active, count, label, onClick }) => (
  <button
    aria-pressed={active}
    className={cn(
      'flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-primary/5 hover:text-primary',
      active ? 'bg-primary/10 font-semibold text-primary' : 'text-foreground',
    )}
    onClick={onClick}
    type="button"
  >
    <span>{label}</span>
    <span
      className={cn(
        'min-w-7 rounded-full px-2 py-0.5 text-center text-xs font-semibold tabular-nums',
        active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
      )}
    >
      {count}
    </span>
  </button>
)

const Sidebar: React.FC<{
  activeFilter: PostsFilter | null
  locale: Locale
  onFilter: (filter: PostsFilter | null) => void
  recentPosts: PostCardData[]
  t: Messages
  taxonomy: PostsTaxonomy
  totalPosts: number
}> = ({ activeFilter, locale, onFilter, recentPosts, t, taxonomy, totalPosts }) => {
  const isActive = (type: PostsFilter['type'], item: TaxonomyItem) =>
    activeFilter?.type === type && activeFilter.id === item.id

  return (
    <aside className="flex flex-col gap-6">
      {taxonomy.categories.length > 0 && (
        <SidebarSection title={t.categories}>
          <ul className="space-y-1">
            <li>
              <CategoryButton
                active={!activeFilter}
                count={totalPosts}
                label={t.allPosts}
                onClick={() => onFilter(null)}
              />
            </li>
            {taxonomy.categories.map((category) => (
              <li key={category.id}>
                <CategoryButton
                  active={isActive('category', category)}
                  count={category.count}
                  label={category.title}
                  onClick={() => onFilter({ ...category, type: 'category' })}
                />
              </li>
            ))}
          </ul>
        </SidebarSection>
      )}

      {recentPosts.length > 0 && (
        <SidebarSection title={t.recentPosts}>
          <ul className="space-y-4">
            {recentPosts.map((post) => (
              <li key={post.id}>
                <Link className="group flex items-start gap-3" href={getPostHref(post.slug)}>
                  <PostThumbnail
                    className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted"
                    post={post}
                    size="64px"
                  />
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                      {post.title}
                    </p>
                    {post.publishedAt && (
                      <time
                        className="mt-1 block text-xs text-muted-foreground"
                        dateTime={post.publishedAt}
                      >
                        {formatPostDate(post.publishedAt, locale)}
                      </time>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </SidebarSection>
      )}

      {taxonomy.tags.length > 0 && (
        <SidebarSection title={t.tags}>
          <ul className="flex flex-wrap gap-2">
            {taxonomy.tags.map((tag) => {
              const active = isActive('tag', tag)
              return (
                <li key={tag.id}>
                  <button
                    aria-pressed={active}
                    className={cn(
                      'inline-flex items-center gap-0.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                      active
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border text-muted-foreground hover:border-primary hover:text-primary',
                    )}
                    onClick={() => onFilter(active ? null : { ...tag, type: 'tag' })}
                    type="button"
                  >
                    <Hash aria-hidden="true" className="size-3" />
                    {tag.title}
                  </button>
                </li>
              )
            })}
          </ul>
        </SidebarSection>
      )}
    </aside>
  )
}

export const PostsListClient: React.FC<{
  columns: string
  initialPosts: PostCardsPage
  limit: number
  locale: Locale
  recentPosts: PostCardData[]
  showAuthor: boolean
  taxonomy: PostsTaxonomy
}> = ({ columns, initialPosts, limit, locale, recentPosts, showAuthor, taxonomy }) => {
  const t = getMessages(locale)
  const [filter, setFilter] = useState<PostsFilter | null>(null)
  const [posts, setPosts] = useState(initialPosts.docs)
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(initialPosts.hasNextPage)
  const [pendingAction, setPendingAction] = useState<'filter' | 'more' | null>(null)
  const [, startTransition] = useTransition()
  const latestRequest = useRef(0)
  const listRef = useRef<HTMLDivElement>(null)

  const fetchPage = (nextFilter: PostsFilter | null, nextPage: number) => {
    const request = ++latestRequest.current
    setPendingAction(nextPage === 1 ? 'filter' : 'more')

    startTransition(async () => {
      try {
        const result = await loadPosts({ filter: nextFilter, limit, locale, page: nextPage })
        if (request !== latestRequest.current) return
        setPosts((current) => (nextPage === 1 ? result.docs : [...current, ...result.docs]))
        setPage(nextPage)
        setHasNextPage(result.hasNextPage)
      } catch (error) {
        console.error(error)
      } finally {
        if (request === latestRequest.current) setPendingAction(null)
      }
    })
  }

  const applyFilter = (nextFilter: PostsFilter | null) => {
    if (isSameFilter(filter, nextFilter)) return
    setFilter(nextFilter)

    const top = listRef.current?.getBoundingClientRect().top
    if (top !== undefined && top < 0) {
      listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    if (nextFilter) {
      fetchPage(nextFilter, 1)
    } else {
      latestRequest.current++
      setPendingAction(null)
      setPosts(initialPosts.docs)
      setPage(1)
      setHasNextPage(initialPosts.hasNextPage)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="scroll-mt-28" ref={listRef}>
        {filter && (
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {t.filteredBy}
            <button
              aria-label={`${t.clearFilter}: ${filter.title}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary transition-colors hover:bg-primary/20"
              onClick={() => applyFilter(null)}
              type="button"
            >
              {filter.type === 'tag' && <Hash aria-hidden="true" className="size-3.5" />}
              {filter.title}
              <X aria-hidden="true" className="size-3.5" />
            </button>
          </div>
        )}

        {posts.length > 0 ? (
          <ul
            aria-busy={pendingAction === 'filter'}
            className={cn(
              'grid gap-6 transition-opacity',
              gridColumns[columns] ?? gridColumns['2'],
              pendingAction === 'filter' && 'opacity-50',
            )}
          >
            {posts.map((post) => (
              <li key={post.id}>
                <PostCard locale={locale} post={post} showAuthor={showAuthor} t={t} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
            {pendingAction === 'filter' ? t.loading : t.noPosts}
          </p>
        )}

        {hasNextPage && (
          <div className="mt-10 flex justify-center">
            <button
              className="inline-flex items-center gap-2 rounded-full border border-primary px-8 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:pointer-events-none disabled:opacity-60"
              disabled={pendingAction !== null}
              onClick={() => fetchPage(filter, page + 1)}
              type="button"
            >
              {pendingAction === 'more' && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
              {pendingAction === 'more' ? t.loading : t.loadMore}
            </button>
          </div>
        )}
      </div>

      <Sidebar
        activeFilter={filter}
        locale={locale}
        onFilter={applyFilter}
        recentPosts={recentPosts}
        t={t}
        taxonomy={taxonomy}
        totalPosts={initialPosts.totalDocs}
      />
    </div>
  )
}
