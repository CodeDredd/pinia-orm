// build.config.ts
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    // bundling
    'src/index',
    'src/decorators',
    'src/casts',
    { input: 'src/model/decorators/nanoid/', outDir: 'dist/nanoid/decorators' },
    { input: 'src/model/casts/nanoid/', outDir: 'dist/nanoid/casts' },
  ],
  declaration: true,
  clean: true,
  externals: ['@/composables'],
  rollup: {
    emitCJS: true,
  },
})
