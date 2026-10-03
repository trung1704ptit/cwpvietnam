import { createPageRoute } from '@/app/(frontend)/_views/PageView'

const route = createPageRoute('en')

export default route.Page
export const generateMetadata = route.generateMetadata
export const generateStaticParams = route.generateStaticParams
