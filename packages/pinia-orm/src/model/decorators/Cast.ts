import type { CastAttribute } from '../casts/CastAttribute'
import type { PropertyDecorator } from './Contracts'

/**
 * Create a cast for an attribute property decorator.
 */
export function Cast(to: (() => typeof CastAttribute)): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()
    self.setCast(propertyKey, to())
  }
}
