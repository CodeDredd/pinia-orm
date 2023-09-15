import { PiniaOrmPlugin, definePiniaOrmPlugin } from 'pinia-orm'
import { GlobalConfig } from './types/config'

export function createPiniaOrmAxios (axiosConfig?: GlobalConfig): PiniaOrmPlugin {
  return definePiniaOrmPlugin((context) => {
    context.config.axiosApi = axiosConfig
    return context
  })
}

export const piniaOrmPluginAxios = createPiniaOrmAxios()
