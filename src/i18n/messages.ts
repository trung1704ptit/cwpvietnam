import { defaultLocale, type Locale } from './config'

const messages = {
  vi: {
    allPosts: 'Tất cả bài viết',
    siteLinks: 'Liên kết',
    categories: 'Danh mục',
    clearFilter: 'Bỏ lọc',
    closeMenu: 'Đóng menu',
    contactInformation: 'Thông tin liên hệ',
    filteredBy: 'Đang lọc theo',
    getConnected: 'Kết nối',
    goHome: 'Về trang chủ',
    hideDetails: 'Thu gọn',
    loading: 'Đang tải...',
    loadMore: 'Xem thêm',
    menu: 'Menu',
    noPosts: 'Chưa có bài viết nào.',
    noResults: 'Không tìm thấy kết quả.',
    openMenu: 'Mở menu',
    pageNotFound: 'Không tìm thấy trang này.',
    posts: 'Bài viết',
    recentPosts: 'Bài viết gần đây',
    search: 'Tìm kiếm',
    searchPlaceholder: 'Tìm bài viết...',
    showDetails: 'Xem thêm',
    tags: 'Thẻ',
    viewDetails: 'Xem chi tiết',
    viewPublication: 'Xem bài báo',
  },
  en: {
    allPosts: 'All posts',
    siteLinks: 'Links',
    categories: 'Categories',
    clearFilter: 'Clear filter',
    closeMenu: 'Close menu',
    contactInformation: 'Contact Information',
    filteredBy: 'Filtered by',
    getConnected: 'Get Connected',
    goHome: 'Go home',
    hideDetails: 'Show less',
    loading: 'Loading...',
    loadMore: 'Load more',
    menu: 'Menu',
    noPosts: 'No posts yet.',
    noResults: 'No results found.',
    openMenu: 'Open menu',
    pageNotFound: 'This page could not be found.',
    posts: 'Posts',
    recentPosts: 'Recent posts',
    search: 'Search',
    searchPlaceholder: 'Search posts...',
    showDetails: 'Show more',
    tags: 'Tags',
    viewDetails: 'Read more',
    viewPublication: 'View publication',
  },
} as const

export type Messages = (typeof messages)[Locale]

export function getMessages(locale: Locale): Messages {
  return messages[locale] ?? messages[defaultLocale]
}
