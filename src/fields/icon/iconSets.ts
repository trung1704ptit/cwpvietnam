import type { IconType } from 'react-icons'

export type IconModule = Record<string, IconType | undefined>

export const iconSets = {
  lu: { label: 'Lucide', import: () => import('react-icons/lu') },
  fa6: { label: 'Font Awesome 6', import: () => import('react-icons/fa6') },
  md: { label: 'Material Design', import: () => import('react-icons/md') },
  hi2: { label: 'Heroicons 2', import: () => import('react-icons/hi2') },
  bs: { label: 'Bootstrap', import: () => import('react-icons/bs') },
  ri: { label: 'Remix', import: () => import('react-icons/ri') },
} satisfies Record<string, { import: () => Promise<object>; label: string }>

export type IconSetKey = keyof typeof iconSets

const cache = new Map<IconSetKey, Promise<IconModule>>()

const toIconModule = (mod: object): IconModule =>
  Object.fromEntries(
    Object.entries(mod).filter(([name, value]) => /^[A-Z]/.test(name) && typeof value === 'function'),
  )

export const loadIconSet = (key: IconSetKey): Promise<IconModule> => {
  let icons = cache.get(key)
  if (!icons) {
    icons = iconSets[key].import().then(toIconModule)
    cache.set(key, icons)
  }
  return icons
}

export const isIconSetKey = (value: unknown): value is IconSetKey =>
  typeof value === 'string' && Object.hasOwn(iconSets, value)

/** Icons are stored as `<set>/<ExportName>`, e.g. `lu/LuHeart`. */
export const parseIconValue = (value?: string | null): { name: string; set: IconSetKey } | null => {
  const [set, name] = value?.split('/') ?? []
  return isIconSetKey(set) && name ? { name, set } : null
}

export const loadIcon = async (value?: string | null): Promise<IconType | null> => {
  const parsed = parseIconValue(value)
  if (!parsed) return null
  const icons = await loadIconSet(parsed.set)
  return icons[parsed.name] ?? null
}
