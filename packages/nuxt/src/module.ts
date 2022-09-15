import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtModule, addPlugin, addTemplate, isNuxt3 } from '@nuxt/kit'
import { InstallOptions } from 'pinia-orm'

export default defineNuxtModule<InstallOptions>({
  meta: {
    name: 'pinia-orm',
    configKey: 'piniaOrm'
  },
  defaults: {
    model: {
      withMeta: false,
      hidden: ['_meta'],
      visible: ['*']
    }
  },
  setup (options, nuxt) {
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir)

    // Add runtime options
    addTemplate({
      filename: 'orm-options.mjs',
      getContents () {
        return `
export const ormOptions = ${JSON.stringify(options, null, 2)}
        `
      }
    })

    addPlugin(resolve(runtimeDir, isNuxt3() ? 'plugin' : 'nuxt2-plugin'), {
      append: true
    })
  }
})
