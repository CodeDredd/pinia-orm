import { Element, Model } from 'pinia-orm'
import { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios'

export type PersistMethods = 'save' | 'insert'

export type PersistOptions = { [P in PersistMethods]?: string[] }

export interface Config extends AxiosRequestConfig {
  dataKey?: string
  dataTransformer?: (response: AxiosResponse) => Element | Element[]
  save?: boolean
  persistBy?: PersistMethods
  persistOptions?: PersistOptions
  delete?: string | number | ((model: Model) => boolean)
  actions?: {
    [name: string]: any
  }
}

export interface GlobalConfig extends Config {
  axios?: AxiosInstance
}
