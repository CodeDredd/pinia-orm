import type { StoreDefinition } from 'pinia'
import type { Model } from '../model/Model'
import { Repository } from '../repository/Repository'
import { Database } from '../database/Database'
import type { Constructor } from '../types'

export function useRepo<M extends Model>(
  model: Constructor<M>,
  storeGenerator?: (id: string) => StoreDefinition,
  connection?: string
): Repository<M>

export function useRepo<R extends Repository>(
  repository: Constructor<R>,
  storeGenerator?: (id: string) => StoreDefinition,
  connection?: string
): R

export function useRepo(
  ModelOrRepository: any,
  storeGenerator?: (id: string) => StoreDefinition,
  connection?: string,
) {
  const database = new Database().setConnection(connection || 'database')

  const repository = ModelOrRepository._isRepository
    ? new ModelOrRepository(database).initialize()
    : new Repository(database).initialize(ModelOrRepository)

  if (storeGenerator)
    repository.database.setStoreGenerator(storeGenerator)

  try {
    database.register(repository.getModel())
  }
  catch (e) {}

  return repository
}
