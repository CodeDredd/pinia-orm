import { withDocus } from 'docus'

export default withDocus({
  rootDir: __dirname,
  env: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  },
  loading: { color: '#ff4785' },
  buildModules: ['vue-plausible'],
  plausible: {
    domain: 'storybook.nuxtjs.org',
  },
})
