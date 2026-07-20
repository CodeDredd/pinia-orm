export default defineAppConfig({
  versions: [
    // `current` marks the version this deployment serves.
    { label: '2.x', href: 'https://pinia-orm.codedredd.de', current: true },
    { label: '1.x', href: 'https://v1.pinia-orm.codedredd.de' },
  ],
  docus: {
    title: 'Pinia ORM',
    description: 'The Pinia plugin to enable Object-Relational Mapping access to the Pinia Store.',
    url: 'https://pinia-orm.codedredd.de',
    socials: {
      github: 'codedredd/pinia-orm',
      twitter: '_Gregor_Becker'
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
      logo: true,
      navigation: true
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
