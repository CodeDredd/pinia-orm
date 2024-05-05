import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        primary: {
          50: { value: '#ecfeff' },
          100: { value: '#cffafe' },
          200: { value: '#a5f3fc' },
          300: { value: '#67e8f9' },
          400: { value: '#22d3ee' },
          500: { value: '#06b6d4' },
          600: { value: '#0891b2' },
          700: { value: '#0e7490' },
          800: { value: '#155e75' },
          900: { value: '#164e63' }
        }
      }
    }
  },
  content: [
    'components/**/*.{vue,js,ts}',
    'layouts/**/*.vue',
    'pages/**/*.vue',
    'composables/**/*.{js,ts}',
    'plugins/**/*.{js,ts}',
    'App.{js,ts,vue}',
    'app.{js,ts,vue}',
    'Error.{js,ts,vue}',
    'error.{js,ts,vue}',
    'content/**/*.md'
  ],
  safelist: [
    {
      pattern: /grid-cols-(2|3|4|6)/,
      variants: ['lg']
    },
  ],
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.text-stroke-thin': {
          '-webkit-text-stroke': 'thin',
        }
      })
    })
  ]
}
