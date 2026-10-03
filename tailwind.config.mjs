/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--text)',
              '--tw-prose-headings': 'var(--text)',
              '--tw-prose-links': 'var(--primary)',
              '--tw-prose-invert-links': 'var(--primary)',
              '--tw-prose-bullets': 'var(--primary)',
              '--tw-prose-invert-bullets': 'var(--primary)',
              '--tw-prose-quotes': 'var(--text)',
              '--tw-prose-quote-borders': 'var(--primary)',
              '--tw-prose-invert-quote-borders': 'var(--primary)',
              a: {
                textDecoration: 'none',
              },
              blockquote: {
                backgroundColor: 'var(--footer-background)',
                borderRadius: '0.5rem',
                padding: '1rem 1.25rem',
              },
              h1: {
                fontWeight: 'normal',
                marginBottom: '0.25em',
              },
            },
          ],
        },
        invert: {
          css: {
            blockquote: {
              backgroundColor: 'var(--card)',
            },
          },
        },
        base: {
          css: [
            {
              h1: {
                fontSize: '2.5rem',
              },
              h2: {
                fontSize: '1.25rem',
                fontWeight: 600,
              },
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: '3.5rem',
              },
              h2: {
                fontSize: '1.5rem',
              },
            },
          ],
        },
      },
    },
  },
}

export default config
