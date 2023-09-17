import type { Pinia } from 'pinia'
import type { Model } from '../model/Model'
import { Repository } from '../repository/Repository'
import { Database } from '../database/Database'
import type { Constructor } from '../types'
import { registerPlugins } from '../store/Plugins'

export function useRepo<R extends Repository>(
  repository: R | Constructor<R>,
  pinia?: Pinia,
): R

export function useRepo<M extends Model>(
  model: Constructor<M>,
  pinia?: Pinia,
): Repository<M>

export function useRepo (
  ModelOrRepository: any,
  pinia?: Pinia
) {
  const database = new Database()

  const repository: Repository = ModelOrRepository._isRepository
    ? new ModelOrRepository(database, pinia).initialize()
    : new Repository(database, pinia).initialize(ModelOrRepository)

  try {
    const typeModels = Object.values(repository.getModel().$types())
    if (typeModels.length > 0) {
      typeModels.forEach(typeModel => repository.database.register(typeModel.newRawInstance()))
    } else {
      repository.database.register(repository.getModel())
    }
  } catch (e) {}

  return registerPlugins(repository)
}
