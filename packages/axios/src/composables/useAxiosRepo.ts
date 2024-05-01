import type { Model } from 'pinia-orm'
import { useRepo } from 'pinia-orm'
import { AxiosRepository } from '../repository/AxiosRepository'
import { getActivePinia } from 'pinia'

export function useAxiosRepo<M extends Model> (model: M) {
  const pinia = getActivePinia()
  AxiosRepository.useModel = model
  return useRepo(AxiosRepository, pinia)
}
