import type { Block } from 'payload'

export const PostsList: Block = {
  slug: 'postsList',
  interfaceName: 'PostsListBlock',
  labels: {
    plural: 'Posts Lists',
    singular: 'Posts List',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'columns',
          type: 'select',
          admin: {
            description: 'Posts per row on large screens.',
            width: '33%',
          },
          defaultValue: '2',
          options: [
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
          ],
          required: true,
        },
        {
          name: 'postsPerPage',
          type: 'number',
          admin: {
            description: 'Posts shown first; "Load more" adds this many again.',
            step: 1,
            width: '33%',
          },
          defaultValue: 6,
          max: 24,
          min: 1,
          required: true,
        },
        {
          name: 'showAuthor',
          type: 'checkbox',
          admin: {
            width: '33%',
          },
          defaultValue: false,
          label: 'Show author',
        },
      ],
    },
  ],
}
