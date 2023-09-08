import { Repository, Model, config } from 'pinia-orm'
import type { AxiosInstance } from 'axios'
import { useAxiosApi } from '../index'

export class AxiosRepository<M extends Model> extends Repository<M> {
  axios: AxiosInstance = config?.axios?.axios || null
  globalApiConfig = config?.axios || {}
  apiConfig = {}

  api () {
    return useAxiosApi(this)
  }
}
