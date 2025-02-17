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
}

export default defineNuxtModule<PiniaOrmNuxtOptions>({
  meta: {
    name: 'pinia-orm',
    configKey: 'piniaOrm',
  },
  defaults: {
    autoImports: [],
    ...CONFIG_DEFAULTS,
  },
  setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Transpile runtime
    nuxt.options.build.transpile.push(resolver.resolve('./runtime'))

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

    addPlugin(resolver.resolve('./runtime/plugin.vue'), {
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
