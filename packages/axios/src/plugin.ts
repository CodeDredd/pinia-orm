import { PiniaOrmPlugin, definePiniaOrmPlugin } from 'pinia-orm'
import { GlobalConfig } from './types/config'

export function piniaOrmPluginAxios (axiosConfig?: GlobalConfig): PiniaOrmPlugin {
  return definePiniaOrmPlugin((context) => {
    context.config.axiosApi = axiosConfig
    return context
  })
}
