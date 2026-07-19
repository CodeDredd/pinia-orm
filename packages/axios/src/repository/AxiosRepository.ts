import type { Model } from 'pinia-orm'
import { Repository } from 'pinia-orm'
import type { AxiosInstance } from 'axios'
import { useAxiosApi } from '../index'
import type { Config, GlobalConfig } from '../types/config'

export class AxiosRepository<M extends Model = Model> extends Repository<M> {
  apiConfig: Config = {}

  protected axiosInstance: AxiosInstance | null = null

  /**
   * The axios instance from the plugin config, unless an instance was set
   * explicitly via `setAxios`. The plugin config is resolved lazily because
   * plugins are registered after the repository has been constructed.
   */
  get axios (): AxiosInstance | null {
    return this.axiosInstance ?? this.globalApiConfig.axios ?? null
  }

  set axios (axios: AxiosInstance | null) {
    this.axiosInstance = axios
  }

  /**
   * The global plugin config passed to `createPiniaOrmAxios`.
   */
  get globalApiConfig (): GlobalConfig {
    return this.config.axiosApi ?? {}
  }

  api () {
    return useAxiosApi(this)
  }

  setAxios (axios: AxiosInstance) {
    this.axios = axios
    return this
  }
}
