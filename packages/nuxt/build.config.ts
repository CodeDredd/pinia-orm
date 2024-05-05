// build.config.ts
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  failOnWarn: false,
  clean: true,
  externals: ['pinia-orm'],
  rollup: {
    emitCJS: true,
  },
})
