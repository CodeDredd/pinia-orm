// build.config.ts
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    // bundling
    'src/index',
    'src/decorators',
    // bundleless, or just copy assets
    // { input: 'src/model/decorators/attributes/types/', outDir: 'dist/decorators' },
    // { input: 'src/model/decorators/attributes/relations/', outDir: 'dist/decorators' },
    // { input: 'src/model/decorators/Cast', outDir: 'dist/decorators', builder: 'mkdist', name: 'Cast' },
    // { input: 'src/model/decorators/Mutate.ts', outDir: 'dist/decorators' },
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
})
