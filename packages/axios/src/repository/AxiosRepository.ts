import type { Database, Model } from 'pinia-orm'
import type { Pinia } from 'pinia'
import { Repository, config } from 'pinia-orm'
import type { AxiosInstance } from 'axios'
import { useAxiosApi } from '../index'
import type { Config, GlobalConfig } from '../types/config'

export class AxiosRepository<M extends Model = Model> extends Repository<M> {
  axios: AxiosInstance
  globalApiConfig: GlobalConfig
  apiConfig: Config

  constructor (database: Database, pinia?: Pinia) {
    super(database, pinia)
    this.axios = config?.axiosApi?.axios || null
    this.globalApiConfig = config?.axiosApi || {}
    this.apiConfig = {}
  }

  api () {
    return useAxiosApi(this)
  }

  setAxios (axios: AxiosInstance) {
    this.axios = axios
    return this
  }
}
