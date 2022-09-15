import type { Collection } from '../../../src'
import { getValue } from '../../support/Utils'

/**
 * The pluck method retrieves all of the values for a given key.
 */
export function usePluck(models: Collection, field: string): any[] {
  return models.map(model => getValue(model, field)).filter((item: any) => item)
}
