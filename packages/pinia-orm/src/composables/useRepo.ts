import type { Pinia } from 'pinia'
import type { Model } from '../model/Model'
import { Repository } from '../repository/Repository'
import { Database } from '../database/Database'
import type { Constructor } from '../types'
import { registerPlugins } from '../store/Plugins'

export function useRepo<R extends Repository<any>> (
  repository: R | Constructor<R>,
  pinia?: Pinia,
): R

export function useRepo<M extends Model> (
  model: Constructor<M>,
  pinia?: Pinia,
): Repository<M>

export function useRepo (
  ModelOrRepository: any,
  pinia?: Pinia,
) {
  const database = new Database()

  const repository: Repository = ModelOrRepository._isRepository
    ? new ModelOrRepository(database, pinia).initialize()
    : new Repository(database, pinia).initialize(ModelOrRepository)

  try {
    const registerTypeModels = (model: Model, registered: Set<string>) => {
      Object.values(model.$types()).forEach((typeModel) => {
        if (registered.has(typeModel.modelEntity())) { return }

        registered.add(typeModel.modelEntity())
        const instance = typeModel.newRawInstance()
        repository.database.register(instance)
        // Also register nested discriminated models (e.g. Document -> File -> Video).
        registerTypeModels(instance, registered)
      })
    }

    if (Object.values(repository.getModel().$types()).length > 0) {
      registerTypeModels(repository.getModel(), new Set())
    } else {
      repository.database.register(repository.getModel())
    }
  } catch (e) {
    console.error('[Pinia ORM] Failed to register models', e)
  }

  return registerPlugins(repository)
}
