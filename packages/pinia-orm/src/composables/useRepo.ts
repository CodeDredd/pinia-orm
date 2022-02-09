import { StoreDefinition } from 'pinia'
import { Model } from '../model/Model'
import { Repository } from '../repository/Repository'
import { Database } from '../database/Database'
import { Constructor } from '../types'

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
  modelOrRepository: any,
  storeGenerator?: (id: string) => StoreDefinition,
  connection?: string
) {
  let database: Database
  database = new Database().setConnection(connection || 'database')

  const repository = modelOrRepository._isRepository
    ? new modelOrRepository(database).initialize()
    : new Repository(database).initialize(modelOrRepository)

  if (storeGenerator) {
    repository.database.setStoreGenerator(storeGenerator)
  }

  try {
    database.register(repository.getModel())
  } catch (e) {}

  return repository
}
