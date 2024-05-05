import type { PiniaOrmPlugin } from 'pinia-orm'
import { definePiniaOrmPlugin } from 'pinia-orm'
import type { GlobalConfig } from './types/config'

export function createPiniaOrmAxios (axiosConfig?: GlobalConfig): PiniaOrmPlugin {
  return definePiniaOrmPlugin((context) => {
    context.config.axiosApi = axiosConfig
    return context
  })
}

export const piniaOrmPluginAxios = createPiniaOrmAxios()
