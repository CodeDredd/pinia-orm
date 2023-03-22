export default defineAppConfig({
  docus: {
    title: 'Pinia ORM',
    description: 'The Pinia plugin to enable Object-Relational Mapping access to the Pinia Store.',
    url: 'https://pinia-orm.codedredd.de',
    socials: {
      github: 'codedredd/pinia-orm'
    },
    cover: {
      src: '/preview.png',
      alt: 'Pina ORM module'
    },
    aside: {
      level: 1,
      collapsed: true,
    },
    header: {
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
  }
})
