import { resolve } from 'pathe'
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  app: {
    head: {
      script: [
        {
          defer: true,
          'data-domain': 'pinia-orm.codedredd.de',
          src: 'https://plausible.io/js/script.js'
        }
      ]
    }
  },
  content: {
    // sources: [
    //   {
    //     name: 'v1',
    //     prefix: '/v1',
    //     driver: 'fs',
    //     base: resolve(__dirname, 'content-v1/en')
    //   },
    //   {
    //     name: 'v1-ja',
    //     prefix: '/ja/v1',
    //     driver: 'fs',
    //     base: resolve(__dirname, 'content-v1/ja')
    //   },
    //   {
    //     name: 'v1-fr',
    //     prefix: '/fr/v1',
    //     driver: 'fs',
    //     base: resolve(__dirname, 'content-v1/fr')
    //   },
    //   {
    //     name: 'v1-ru',
    //     prefix: '/ru/v1',
    //     driver: 'fs',
    //     base: resolve(__dirname, 'content-v1/ru')
    //   }
    // ],
    highlight: {
      preload: ['xml']
    }
  },
  nitro: {
    prerender: {
      routes: [
        '/',
        '/blog/announcing-v2'
      ]
    }
  },
  extends: ['@nuxt-themes/docus'],
  github: {
    owner: 'CodeDredd',
    repo: 'pinia-orm',
    branch: 'master',
  },
  theme: {},
  modules: ['@nuxthq/admin', '@nuxtlabs/github-module'],
  plausible: {
    domain: 'pinia-orm.codedredd.de',
  },
  colorMode: {
    preference: 'dark',
  },
})
