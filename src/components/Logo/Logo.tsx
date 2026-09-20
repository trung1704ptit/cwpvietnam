import clsx from 'clsx'
import React from 'react'

interface Props {
  alt?: string
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const {
    alt = 'Cancer Wellness Program',
    loading: loadingFromProps,
    priority: priorityFromProps,
    className,
  } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt={alt}
      width={240}
      height={48}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('h-auto max-h-14 w-auto max-w-[15rem]', className)}
      src="/logo-text.png"
    />
  )
}
