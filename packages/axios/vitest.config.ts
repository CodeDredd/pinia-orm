import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['./test/setup.ts'],
    externals: ['pinia-orm'],
    coverage: {
      enabled: true,
      reporter: ['lcov', 'text', 'html']
    }
  }
})
