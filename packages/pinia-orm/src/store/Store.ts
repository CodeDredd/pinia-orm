import type { PiniaPlugin } from 'pinia'
import type { WeakCache } from '../cache/WeakCache'
import type { Model } from '../model/Model'
import { CONFIG_DEFAULTS, config } from './Config'
import { PiniaOrmPlugin, plugins } from './Plugins'

export interface ModelConfigOptions {
  withMeta?: boolean
  hidden?: string[]
  namespace?: string
  visible?: string[]
}

export interface CacheConfigOptions {
  shared?: boolean
  provider?: typeof WeakCache<string, Model[]>
}

export interface InstallOptions {
  model?: ModelConfigOptions
  cache?: CacheConfigOptions | boolean
  plugins: Record<string, any>
  [key: string]: any
}

export interface FilledInstallOptions {
  model: Required<ModelConfigOptions>
  cache: Required<CacheConfigOptions | boolean>
}

export interface CreatePiniaOrm {
  use(plugin: PiniaOrmPlugin): this
}

/**
 * Install Pinia ORM to the store.
 */
export function createORM (options?: InstallOptions) {
  config.model = { ...CONFIG_DEFAULTS.model, ...options?.model }
  config.cache = options?.cache === false ? false : { ...CONFIG_DEFAULTS.cache, ...(options?.cache !== true && options?.cache) }
  const orm = {
    use(plugin: PiniaOrmPlugin) {
      plugins.push(plugin)
      return this
    }
  }
  return () => orm
}
