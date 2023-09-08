import { AxiosRepository } from '../repository/AxiosRepository'
import { useRepo, Model } from 'pinia-orm'

export function useApiRepo<M extends Model> (model: M): AxiosRepository<M> {
  AxiosRepository.useModel = model
  return useRepo(AxiosRepository)
}
