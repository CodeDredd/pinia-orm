import { defineTheme } from '@nuxt-themes/kit'

export default defineTheme({
  title: 'Pinia ORM',
  description: 'The Pinia plugin to enable Object-Relational Mapping access to the Pinia Store.',
  layout: 'docs',
  url: 'https://pinia-orm.codedredd.de',
  debug: false,
  socials: {
    twitter: '@_GregorBecker',
    github: 'codedredd/pinia-orm'
  },
  github: {
    root: 'docs/content',
    edit: true,
    releases: true
  },
  cover: {
    src: '/preview.png',
    alt: 'Pina ORM module'
  },
  aside: {
    level: 1,
    filter: [
      '/v1',
      '/content-v1',
      '/fr',
      '/ja',
      '/ru'
    ]
  },
  header: {
    title: false,
    logo: true
  },
  footer: {
    credits: {
      icon: 'IconDocus',
      text: 'Powered by Docus',
      href: 'https://docus.com'
    },
    icons: [
      {
        label: 'NuxtJS',
        href: 'https://nuxtjs.org',
        component: 'IconNuxt'
      },
      {
        label: 'Vue Telescope',
        href: 'https://vuetelescope.com',
        component: 'IconVueTelescope'
      }
    ]
  }
})
