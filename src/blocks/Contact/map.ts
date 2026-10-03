const IFRAME_SRC = /<iframe[^>]+src=["']([^"']+)["']/i
const GOOGLE_HOST = /^(?:www\.|maps\.)?google\.[a-z.]+$/i

/**
 * Accepts a Google Maps "Embed a map" iframe snippet, an embed URL, or a plain
 * address / place name. Short share links (maps.app.goo.gl) can't be embedded.
 */
export const getMapEmbedUrl = (value?: string | null): string | null => {
  const input = value?.trim()
  if (!input) return null

  const candidate = (input.match(IFRAME_SRC)?.[1] ?? input).replace(/&amp;/g, '&')

  if (!/^https?:\/\//i.test(candidate)) {
    return `https://www.google.com/maps?q=${encodeURIComponent(input)}&output=embed`
  }

  try {
    const url = new URL(candidate)
    const isGoogleMaps = GOOGLE_HOST.test(url.hostname) && url.pathname.startsWith('/maps')
    const isEmbed =
      url.pathname.startsWith('/maps/embed') || url.searchParams.get('output') === 'embed'
    return isGoogleMaps && isEmbed ? url.toString() : null
  } catch {
    return null
  }
}
