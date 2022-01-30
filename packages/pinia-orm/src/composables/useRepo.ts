import { defineStore } from 'pinia'
import { Model } from '../model/Model'
import { Repository } from '../repository/Repository'
import { Database } from '../database/Database'
import { Constructor } from '../types'
import { useStoreActions } from './useStoreActions'

export function useRepo<M extends Model>(
  model: Constructor<M>,
  connection?: string
): Repository<M>

export function useRepo<R extends Repository>(
  repository: Constructor<R>,
  connection?: string
): R

export function useRepo(modelOrRepository: any, connection?: string) {
  let database: Database
  // const store = defineStore(connection || 'database', {
  //   state: () => ({ entities: {} }),
  // })

  // if (connection) {
  // if (!(connection in store.$databases)) {
  //   database = createDatabase(store, { namespace: connection })
  //   database.start()
  // } else {
  //   database = store.$databases[connection]
  // }
  // } else {
  database = new Database().setConnection(connection || 'database')
  // .setStore(store)
  // }

  const repository = modelOrRepository._isRepository
    ? new modelOrRepository(database).initialize()
    : new Repository(database).initialize(modelOrRepository)

  const store = defineStore(repository.getModel().$entity(), {
    state: () => ({ data: {} }),
    actions: useStoreActions(),
  })
  repository.database.setStore(store)

  try {
    database.register(repository.getModel())
  } catch (e) {}

  return repository

  // return defineStore(model.$entity(), {
  //   state: () => {
  //     return model.$fields()
  //   },
  // })
}
