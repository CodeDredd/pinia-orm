import type { Model } from '../model/Model'
import { Repository } from '../repository/Repository'
import { Database } from '../database/Database'
import type { Constructor } from '../types'

export function useRepo<M extends Model>(
  model: Constructor<M>,
): Repository<M>

export function useRepo<R extends Repository>(
  repository: Constructor<R>,
): R

export function useRepo(
  ModelOrRepository: any,
) {
  const database = new Database()

  const repository: Repository = ModelOrRepository._isRepository
    ? new ModelOrRepository(database).initialize()
    : new Repository(database).initialize(ModelOrRepository)

  try {
    const typeModels = Object.values(repository.getModel().$types())
    if (typeModels.length > 0)
      typeModels.forEach(typeModel => database.register(typeModel.newRawInstance()))
    else
      database.register(repository.getModel())
  }
  catch (e) {}

  return repository
}
