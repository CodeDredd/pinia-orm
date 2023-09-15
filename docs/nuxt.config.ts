export default defineNuxtConfig({
  extends: ['@nuxt-themes/docus'],
  runtimeConfig: {
    public: {
      plausible: {
        domain: 'pinia-orm.codedredd.de',
        apiHost: 'https://plausible.stormtail.dev'
      }
    }
  },
  modules: ['@nuxtlabs/github-module', '@nuxtjs/plausible', '@nuxtjs/tailwindcss'],
  github: {
    owner: 'CodeDredd',
    repo: 'pinia-orm',
    branch: 'master',
  }
})
