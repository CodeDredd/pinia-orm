import { WeakCache } from '../cache/WeakCache'
import type { FilledInstallOptions } from './Store'

export const CONFIG_DEFAULTS = {
  model: {
    namespace: '',
    withMeta: false,
    hidden: ['_meta'],
    visible: ['*'],
  },
  cache: {
    shared: true,
    provider: WeakCache,
  },
  pinia: {
    storeType: 'optionStore',
  },
}

export const config: FilledInstallOptions & { [key: string]: any } = { ...CONFIG_DEFAULTS }
