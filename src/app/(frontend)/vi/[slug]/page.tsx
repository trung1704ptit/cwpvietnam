import { createPageRoute } from '@/app/(frontend)/_views/PageView'

const route = createPageRoute('vi')

export default route.Page
export const generateMetadata = route.generateMetadata
export const generateStaticParams = route.generateStaticParams
