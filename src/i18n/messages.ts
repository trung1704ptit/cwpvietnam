import { defaultLocale, type Locale } from './config'

const messages = {
  vi: {
    basicSites: 'Liên kết',
    closeMenu: 'Đóng menu',
    contactInformation: 'Thông tin liên hệ',
    getConnected: 'Kết nối',
    menu: 'Menu',
    noResults: 'Không tìm thấy kết quả.',
    openMenu: 'Mở menu',
    posts: 'Bài viết',
    search: 'Tìm kiếm',
    searchPlaceholder: 'Tìm bài viết...',
  },
  en: {
    basicSites: 'Basic Sites',
    closeMenu: 'Close menu',
    contactInformation: 'Contact Information',
    getConnected: 'Get Connected',
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
