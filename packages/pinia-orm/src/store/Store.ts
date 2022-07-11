import type { PiniaPlugin, Store } from 'pinia'
import { components, plugins } from '../plugin/Plugin'

// export interface InstallOptions {
//   namespace?: string
// }

// type FilledInstallOptions = Required<InstallOptions>

/**
 * Install Pinia ORM to the store.
 */
export function install(): PiniaPlugin {
  return (store) => {
    mixin(store.store)
  }
}

/**
 * Create options by merging the given user-provided options.
 */
// function createOptions(options: InstallOptions = {}): FilledInstallOptions {
//   return {
//     namespace: options.namespace ?? 'entities',
//   }
// }

/**
 * Mixin Pinia ORM feature to the store.
 */
function mixin(store: Store<any>): void {
  installPlugins(store)
}

/**
 * Execute registered plugins.
 */
function installPlugins(store: Store<any>): void {
  plugins.forEach((plugin) => {
    const { func, options } = plugin

    func.install(store, components, options)
  })
}
