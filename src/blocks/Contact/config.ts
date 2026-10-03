import type { Block, Field, GroupField } from 'payload'

import { getMapEmbedUrl } from './map'

const iconField = (defaultValue: string): Field => ({
  name: 'icon',
  type: 'text',
  admin: {
    components: {
      Field: '@/fields/icon/IconPickerField#IconPickerField',
    },
  },
  defaultValue,
})

const titleField = (labels: { en: string; vi: string }): Field => ({
  name: 'title',
  type: 'text',
  defaultValue: ({ locale }) => (locale === 'en' ? labels.en : labels.vi),
  localized: true,
})

const contactGroup = ({
  defaultIcon,
  fields,
  label,
  name,
  titles,
}: {
  defaultIcon: string
  fields: Field[]
  label: string
  name: string
  titles: { en: string; vi: string }
}): GroupField => ({
  name,
  type: 'group',
  label,
  fields: [iconField(defaultIcon), titleField(titles), ...fields],
})

export const Contact: Block = {
  slug: 'contactBlock',
  interfaceName: 'ContactBlock',
  labels: {
    plural: 'Contact Blocks',
    singular: 'Contact',
  },
  fields: [
    {
      name: 'maxWidth',
      type: 'number',
      admin: {
        description:
          'Limits the width of all content and keeps it centered. Leave empty for full container width.',
        placeholder: 'Full width',
        step: 10,
      },
      label: 'Max width (px)',
      min: 200,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Address',
          fields: [
            contactGroup({
              name: 'address',
              defaultIcon: 'lu/LuMapPin',
              label: 'Address',
              titles: { en: 'Address', vi: 'Địa chỉ' },
              fields: [{ name: 'content', type: 'textarea', localized: true }],
            }),
          ],
        },
        {
          label: 'Phone',
          fields: [
            contactGroup({
              name: 'phone',
              defaultIcon: 'lu/LuPhone',
              label: 'Phone',
              titles: { en: 'Phone', vi: 'Điện thoại' },
              fields: [
                {
                  name: 'content',
                  type: 'textarea',
                  admin: {
                    description: 'One phone number per line. Each becomes a tap-to-call link.',
                  },
                },
              ],
            }),
          ],
        },
        {
          label: 'Email',
          fields: [
            contactGroup({
              name: 'email',
              defaultIcon: 'lu/LuMail',
              label: 'Email',
              titles: { en: 'Email', vi: 'Email' },
              fields: [{ name: 'email', type: 'email' }],
            }),
          ],
        },
        {
          label: 'Social',
          fields: [
            contactGroup({
              name: 'social',
              defaultIcon: 'lu/LuShare2',
              label: 'Social',
              titles: { en: 'Follow us', vi: 'Kết nối' },
              fields: [
                { name: 'content', type: 'textarea', localized: true },
                {
                  name: 'links',
                  type: 'array',
                  admin: {
                    description:
                      'Search the icon picker for e.g. "facebook", "x twitter", "youtube".',
                    initCollapsed: true,
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'label',
                          type: 'text',
                          admin: { placeholder: 'Facebook', width: '50%' },
                          required: true,
                        },
                        {
                          name: 'url',
                          type: 'text',
                          admin: { placeholder: 'https://facebook.com/…', width: '50%' },
                          required: true,
                        },
                      ],
                    },
                    {
                      name: 'icon',
                      type: 'text',
                      admin: {
                        components: {
                          Field: '@/fields/icon/IconPickerField#IconPickerField',
                        },
                      },
                      defaultValue: 'fa6/FaFacebookF',
                      required: true,
                    },
                  ],
                  labels: { plural: 'Social links', singular: 'Social link' },
                },
              ],
            }),
          ],
        },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'map',
          type: 'textarea',
          admin: {
            description:
              'Company address (e.g. "VinUniversity, Gia Lâm, Hà Nội") or the iframe code from Google Maps → Share → Embed a map.',
            width: '75%',
          },
          label: 'Google Map',
          validate: (value: null | string | undefined) =>
            !value || getMapEmbedUrl(value)
              ? true
              : 'Enter an address or the "Embed a map" iframe code. Short share links cannot be embedded.',
        },
        {
          name: 'mapHeight',
          type: 'number',
          admin: { step: 10, width: '25%' },
          defaultValue: 450,
          label: 'Map height (px)',
          max: 900,
          min: 200,
        },
      ],
    },
  ],
}
