import { useRepo, Model } from 'pinia-orm'
import { AxiosRepository } from '../repository/AxiosRepository'

export function useApiRepo<M extends Model> (model: M) {
  AxiosRepository.useModel = model
  return useRepo(AxiosRepository)
}
