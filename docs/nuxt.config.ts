import theme from '@nuxt/content-theme-docs'

export default theme({
  loading: { color: '#5A0FC8' },
  // buildModules: ['nuxt-ackee'],
  // ackee: {
  //   server: 'https://ackee.nuxtjs.com',
  //   domainId: 'a2998bc2-56dd-47fa-9d94-9781411bd1f9',
  //   detailed: true
  // },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      hid: 'google-verification',
      name: 'google-site-verification',
      content: '9nl6uN8TTI5jqZb_noWhW0itfRNSflXiRs99B4xFofo',
    },
  ],
  pwa: {
    manifest: {
      name: 'Nuxt PWA',
    },
  },
})
