import type { Element } from 'pinia-orm'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export type PersistMethods = 'save' | 'insert'

export type PersistOptions = { [P in PersistMethods]?: string[] }

export interface Config extends AxiosRequestConfig {
  dataKey?: string
  url?: string
  method?: string
  data?: any
  dataTransformer?: (response: AxiosResponse) => Element | Element[]
  save?: boolean
  persistBy?: PersistMethods
  persistOptions?: PersistOptions
  /**
   * This tells the api to delete the record from the store after the call is finished.
   *
   *  It needs the `primaryKey` value (ID) of the entity as argument.
   */
  delete?: string | number
  actions?: {
    [name: string]: any
  }
}

export interface GlobalConfig extends Config {
  axios?: AxiosInstance
}

export interface InstallConfig {
  axiosApi?: GlobalConfig
}
