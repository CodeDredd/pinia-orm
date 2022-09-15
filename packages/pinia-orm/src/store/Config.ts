import { WeakCache } from '../cache/WeakCache'
import type { FilledInstallOptions } from './Store'

export const CONFIG_DEFAULTS = {
  model: {
    withMeta: false,
    hidden: ['_meta'],
    visible: ['*'],
  },
  cache: {
    shared: true,
    provider: WeakCache,
  },
}

export const config: FilledInstallOptions = { ...CONFIG_DEFAULTS }
