import { Repository, Model, config } from 'pinia-orm'
import type { AxiosInstance } from 'axios'
import { useAxiosApi } from '../index'
import { Config } from '../types/config'

export class AxiosRepository<M extends Model = Model> extends Repository<M> {
  axios: AxiosInstance = config?.axiosApi?.axios || null
  globalApiConfig = config?.axiosApi || {}
  apiConfig: Config = {}

  api () {
    return useAxiosApi(this)
  }
}
