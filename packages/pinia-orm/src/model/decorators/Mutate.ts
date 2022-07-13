import type { Mutator } from '../../types'
import type { PropertyDecorator } from './Contracts'

/**
 * Create an Mutate attribute property decorator.
 */
export function Mutate(get?: Mutator<any>, set?: Mutator<any>): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()
    self.setMutator(propertyKey, { get, set })
  }
}
