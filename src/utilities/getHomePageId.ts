import { getCachedGlobal } from '@/utilities/getGlobals'

export const getHomePageId = async (): Promise<number | null> => {
  const { homePage } = await getCachedGlobal('settings', 0)()

  if (!homePage) return null
  return typeof homePage === 'object' ? homePage.id : homePage
}
