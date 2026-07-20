import { addImports, addPlugin, addTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { InstallOptions } from 'pinia-orm'
import { CONFIG_DEFAULTS } from 'pinia-orm'

export interface PiniaOrmNuxtOptions extends InstallOptions {
  /**
   * Array of auto imports to be added to the nuxt.config.js file.
   * @default
   * `useRepo`
   *
   * @example
   * ```js
   * autoImports: [
   *  // automatically import `useRepo`
   *  'useRepo',
   *  // automatically import `useRepo` as `usePinaOrmRepo`
   *  ['useRepo', 'usePinaOrmRepo',
   * ]
   * ```
   *
   */
  autoImports?: Array<string | [string, string]>
  /**
   * Add pinia-orm packages to vite's `optimizeDeps.include` so the dev
   * server pre-bundles them and avoids "new dependency optimized" reloads.
   * @default true
   */
  optimizeDeps?: boolean
}

export default defineNuxtModule<PiniaOrmNuxtOptions>({
  meta: {
    name: 'pinia-orm',
    configKey: 'piniaOrm',
    compatibility: {
      nuxt: '>=3.14.0',
    },
  },
  defaults: {
    autoImports: [],
    optimizeDeps: true,
    ...CONFIG_DEFAULTS,
  },
  setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Transpile runtime
    nuxt.options.build.transpile.push(resolver.resolve('./runtime'))

    if (options.optimizeDeps) {
      // Pre-bundle pinia-orm so vite doesn't restart the dev server with
      // "new dependencies optimized" once the first repository is used.
      nuxt.options.vite.optimizeDeps ||= {}
      nuxt.options.vite.optimizeDeps.include ||= []
      for (const dep of ['pinia-orm', 'pinia-orm > @pinia-orm/normalizr']) {
        if (!nuxt.options.vite.optimizeDeps.include.includes(dep)) {
          nuxt.options.vite.optimizeDeps.include.push(dep)
        }
      }
    }

    nuxt.hook('devtools:customTabs', (tabs) => {
      tabs.push({
        name: 'pinia-orm',
        title: 'Pinia ORM',
        icon: 'https://pinia-orm.codedredd.de/logo.svg',
        view: {
          type: 'iframe',
          src: 'https://pinia-orm.codedredd.de/api/composables/use-repo',
        },
      })
    })

    nuxt.hook('prepare:types', ({ references }) => {
      references.push({ types: '@pinia-orm/nuxt' })
    })

    // Add runtime options
    addTemplate({
      filename: 'orm-options.mjs',
      getContents () {
        return `
export const ormOptions = ${JSON.stringify(options, null, 2)}
        `
      },
    })

    addPlugin(resolver.resolve('./runtime/plugin'), {
      append: true,
    })

    if (options.autoImports) {
      // Add auto imports
      const generateImports = [
        { from: 'pinia-orm', name: 'useRepo' },
        ...options.autoImports.map(imports =>
          typeof imports === 'string'
            ? { from: 'pinia-orm', name: imports }
            : { from: 'pinia-orm', name: imports[0], as: imports[1] },
        ),
      ]
      addImports(generateImports)
    }
  },
})
