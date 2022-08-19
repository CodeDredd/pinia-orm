// build.config.ts
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    // bundling
    'src/index',
    'src/decorators',
    'src/casts',
    { input: 'src/packages/', outDir: 'packages' },
  ],
  declaration: true,
  clean: true,
  externals: ['@/composables'],
  rollup: {
    emitCJS: true,
  },
})
