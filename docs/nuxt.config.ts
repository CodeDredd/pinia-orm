import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  extends: ['./node_modules/@docus/docs-theme'],
  github: {
    owner: 'CodeDredd',
    repo: 'pinia-orm',
    branch: 'master',
  },
  theme: {},
  modules: ['@nuxthq/admin', '@docus/github', 'vue-plausible'],
  plausible: {
    domain: 'pinia-orm.codedredd.de',
  },
  toc: {
    depth: 3,
    searchDepth: 3
  },
  tailwindcss: {
    config: {
      important: true,
      theme: {
        extend: {
          colors: {
            primary: {
              50: '#ecfeff',
              100: '#cffafe',
              200: '#a5f3fc',
              300: '#67e8f9',
              400: '#22d3ee',
              500: '#06b6d4',
              600: '#0891b2',
              700: '#0e7490',
              800: '#155e75',
              900: '#164e63',
            },
          },
        },
      },
    },
  },
  colorMode: {
    preference: 'dark',
  },
})
