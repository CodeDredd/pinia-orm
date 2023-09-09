import { PiniaOrmPlugin } from 'pinia-orm'
import { GlobalConfig } from './types/config'

export function piniaOrmPluginAxios (axiosConfig?: GlobalConfig): PiniaOrmPlugin {
  return (context) => {
    context.config.axiosApi = axiosConfig
    return context
  }
}
