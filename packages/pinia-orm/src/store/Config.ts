import { WeakCache } from '../cache/WeakCache'
import type { InstallOptions } from './Store'

export const CONFIG_DEFAULTS = {
  model: {
    withMeta: false,
    hidden: ['_meta'],
    visible: ['*'],
  },
  cache: {
    shared: true,
    provider: WeakCache
  },
}

export const config: InstallOptions = { ...CONFIG_DEFAULTS }
