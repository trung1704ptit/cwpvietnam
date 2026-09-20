import { defaultLocale, type Locale } from './config'

const messages = {
  vi: {
    closeMenu: 'Đóng menu',
    menu: 'Menu',
    noResults: 'Không tìm thấy kết quả.',
    openMenu: 'Mở menu',
    posts: 'Bài viết',
    search: 'Tìm kiếm',
    searchPlaceholder: 'Tìm bài viết...',
  },
  en: {
    closeMenu: 'Close menu',
    menu: 'Menu',
    noResults: 'No results found.',
    openMenu: 'Open menu',
    posts: 'Posts',
    search: 'Search',
    searchPlaceholder: 'Search posts...',
  },
} as const

export type Messages = (typeof messages)[Locale]

export function getMessages(locale: Locale): Messages {
  return messages[locale] ?? messages[defaultLocale]
}
