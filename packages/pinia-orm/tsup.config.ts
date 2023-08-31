import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'pinia-orm',
  clean: true,
  format: ['esm', 'cjs', 'iife'],
  entry: [
    'src/index.ts',
    'src/casts.ts',
    'src/decorators.ts'
  ],
  dts: true
})
