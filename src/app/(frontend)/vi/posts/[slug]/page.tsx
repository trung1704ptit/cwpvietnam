import { createPostRoute } from '@/app/(frontend)/_views/PostView'

const route = createPostRoute('vi')

export default route.Page
export const generateMetadata = route.generateMetadata
export const generateStaticParams = route.generateStaticParams
