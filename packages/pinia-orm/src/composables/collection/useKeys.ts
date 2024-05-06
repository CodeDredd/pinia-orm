import type { Collection } from '../../../src'

/**
 * The keys method returns all of the collection's primary keys
 */
export function useKeys (models: Collection<any>): string[] {
  return models.map(model => model[model.$getLocalKey()])
}
