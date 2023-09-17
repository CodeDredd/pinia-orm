import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    // silent: true,
    coverage: {
      enabled: true,
      reporter: ['lcov', 'text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/index.ts', 'src/cache/*']
    }
  },
  enabled: true
})
