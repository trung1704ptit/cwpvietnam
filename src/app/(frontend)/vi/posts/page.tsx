import { createPostsRoute } from '@/app/(frontend)/_views/PostsView'

const route = createPostsRoute('vi')

export default route.Page
export const generateMetadata = route.generateMetadata
