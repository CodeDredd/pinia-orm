import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    // https://github.com/vitejs/vite/issues/7879
    deps: {
      fallbackCJS: true,
    },
    // silent: true,
    coverage: {
      reporter: ['lcov', 'text'],
      include: ['src/**/*.ts'],
      exclude: ['src/index.ts', 'src/index.cjs.ts'],
    },
  },
})
