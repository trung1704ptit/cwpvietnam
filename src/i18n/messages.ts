import { defaultLocale, type Locale } from './config'

const messages = {
  vi: {
    basicSites: 'Liên kết',
    closeMenu: 'Đóng menu',
    contactInformation: 'Thông tin liên hệ',
    getConnected: 'Kết nối',
    goHome: 'Về trang chủ',
    hideDetails: 'Thu gọn',
    menu: 'Menu',
    noResults: 'Không tìm thấy kết quả.',
    openMenu: 'Mở menu',
    pageNotFound: 'Không tìm thấy trang này.',
    posts: 'Bài viết',
    search: 'Tìm kiếm',
    searchPlaceholder: 'Tìm bài viết...',
    showDetails: 'Xem thêm',
  },
  en: {
    basicSites: 'Basic Sites',
    closeMenu: 'Close menu',
    contactInformation: 'Contact Information',
    getConnected: 'Get Connected',
    goHome: 'Go home',
    hideDetails: 'Show less',
    menu: 'Menu',
    noResults: 'No results found.',
    openMenu: 'Open menu',
    pageNotFound: 'This page could not be found.',
    posts: 'Posts',
    search: 'Search',
    searchPlaceholder: 'Search posts...',
    showDetails: 'Show more',
  },
} as const

export type Messages = (typeof messages)[Locale]

export function getMessages(locale: Locale): Messages {
  return messages[locale] ?? messages[defaultLocale]
}
