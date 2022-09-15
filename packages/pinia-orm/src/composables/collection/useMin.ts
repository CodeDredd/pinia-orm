import type { Collection } from '../../../src'
import { usePluck } from './usePluck'

/**
 * Get the min value of the specified filed.
 */
export function useMin(models: Collection, field: string): number {
  const numbers = usePluck(models, field).filter(item => typeof item === 'number')

  return numbers.length === 0 ? 0 : Math.min(...numbers)
}
