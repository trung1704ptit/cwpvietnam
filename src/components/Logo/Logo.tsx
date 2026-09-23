import clsx from 'clsx'

interface Props {
  alt?: string
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  color?: 'white' | 'text'
}

export const Logo = (props: Props) => {
  const {
    alt = 'Cancer Wellness Program',
    loading: loadingFromProps,
    priority: priorityFromProps,
    className,
    color = 'white',
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
      className={clsx('h-auto w-auto max-w-36', className)}
      src={`/logo-${color}.png`}
    />
  )
}
