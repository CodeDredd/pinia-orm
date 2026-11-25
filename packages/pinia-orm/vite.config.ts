import path from 'node:path'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    // Vite 8 transforms TS with Oxc, which does not lower TC39 decorators yet
    // (https://github.com/oxc-project/oxc/issues/9170), so Babel does it here.
    // SWC is no option: it does not link the decorator metadata of a subclass
    // to its parent class, so models would lose their inherited fields.
    // Babel runs before Oxc, so it strips the types of these files as well,
    // otherwise `id!: number` turns into an invalid `id!: number = init()`.
    babel({
      presets: [{
        preset: () => ({
          plugins: [
            '@babel/plugin-transform-typescript',
            ['@babel/plugin-proposal-decorators', { version: '2023-11' }],
          ],
        }),
        // Only run this transform if the file contains a decorator.
        rolldown: { filter: { code: '@' } },
      }],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
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
      exclude: ['src/index.ts', 'src/cache/*'],
    },
  },
  enabled: true,
})
