import type { Collection } from '../../../src'

/**
 * The pluck method retrieves all of the values for a given key.
 */
export function usePluck(models: Collection, field: string): any[] {
  return field.split('.').reduce((model, prop) => model[prop], models)
}
