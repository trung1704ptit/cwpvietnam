/**
 * URL-friendly slug for Vietnamese and English titles.
 * "Đây là bài viết" → "day-la-bai-viet"
 * "Hello World" → "hello-world"
 */
export function slugify(value?: string | null): string {
  if (!value) return ''

  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
