import { createPostsRoute } from '@/app/(frontend)/_views/PostsView'

const route = createPostsRoute('en')

export default route.Page
export const generateMetadata = route.generateMetadata
