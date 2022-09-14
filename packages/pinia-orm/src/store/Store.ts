import type { PiniaPlugin } from 'pinia'
import type { WeakCache } from '../cache/WeakCache'
import type { Model } from '../model/Model'
import { CONFIG_DEFAULTS, config } from './Config'

export interface ModelConfigOptions {
  withMeta?: boolean
  hidden?: string[]
  visible?: string[]
}

export interface CacheConfigOptions {
  shared?: boolean
  provider?: typeof WeakCache<string, Model[]>
}

export interface InstallOptions {
  model?: ModelConfigOptions
  cache?: CacheConfigOptions | boolean
}

export interface FilledInstallOptions {
  model: Required<ModelConfigOptions>
  cache: Required<CacheConfigOptions | boolean>
}

/**
 * Install Pinia ORM to the store.
 */
export function createORM(options?: InstallOptions): PiniaPlugin {
  config.model = { ...CONFIG_DEFAULTS.model, ...options?.model }
  config.cache = options?.cache === false ? false : { ...CONFIG_DEFAULTS.cache, ...(options?.cache !== true && options?.cache) }
  return () => {}
}
