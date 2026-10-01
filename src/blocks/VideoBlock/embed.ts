export type VideoEmbed = { src: string; type: 'file' | 'iframe' }

const VIDEO_FILE_PATTERN = /\.(m4v|mov|mp4|ogg|ogv|webm)$/i
const YOUTUBE_PATH_PATTERN = /^\/(?:embed|live|shorts|v)\/([\w-]{6,})/

const parseStartSeconds = (value: string | null): number | undefined => {
  if (!value) return undefined
  if (/^\d+$/.test(value)) return Number(value)

  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/)
  if (!match) return undefined
  const [, h = '0', m = '0', s = '0'] = match
  return Number(h) * 3600 + Number(m) * 60 + Number(s) || undefined
}

const getYouTubeEmbed = (url: URL, host: string): VideoEmbed | null => {
  let id: string | undefined

  if (host === 'youtu.be') {
    id = url.pathname.split('/')[1]
  } else if (['music.youtube.com', 'youtube-nocookie.com', 'youtube.com'].includes(host)) {
    id = url.searchParams.get('v') ?? url.pathname.match(YOUTUBE_PATH_PATTERN)?.[1]
  }

  if (!id) return null

  const start = parseStartSeconds(url.searchParams.get('t') ?? url.searchParams.get('start'))
  return {
    src: `https://www.youtube.com/embed/${id}${start ? `?start=${start}` : ''}`,
    type: 'iframe',
  }
}

const getVimeoEmbed = (url: URL, host: string): VideoEmbed | null => {
  if (host !== 'vimeo.com' && host !== 'player.vimeo.com') return null

  const [id, hash] = url.pathname.replace(/^\/video\//, '/').split('/').filter(Boolean)
  if (!id || !/^\d+$/.test(id)) return null

  const h = url.searchParams.get('h') ?? hash
  return {
    src: `https://player.vimeo.com/video/${id}${h ? `?h=${h}` : ''}`,
    type: 'iframe',
  }
}

export const parseVideoUrl = (input?: string | null): VideoEmbed | null => {
  if (!input?.trim()) return null

  let url: URL
  try {
    url = new URL(input.trim())
  } catch {
    return null
  }

  const host = url.hostname.replace(/^(?:m|www)\./, '')

  return (
    getYouTubeEmbed(url, host) ??
    getVimeoEmbed(url, host) ??
    (VIDEO_FILE_PATTERN.test(url.pathname) ? { src: url.toString(), type: 'file' } : null)
  )
}
