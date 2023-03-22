// build.config.ts
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  rollup: {
    emitCJS: true
  },
  externals: ['pinia', '@nuxt/kit-edge', '@nuxt/types', 'pinia-orm', '@pinia-orm/normalizr']
})
