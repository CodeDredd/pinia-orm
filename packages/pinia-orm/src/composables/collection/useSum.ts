import type { Collection } from '../../../src'

/**
 * Get the sum value of the specified filed.
 */
export function useSum(models: Collection, field: string): number {
  return models.reduce<number>((sum, item) => {
    if (typeof item[field] === 'number')
      sum += item[field]

    return sum
  }, 0)
}
