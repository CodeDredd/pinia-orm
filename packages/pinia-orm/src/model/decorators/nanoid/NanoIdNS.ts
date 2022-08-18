import type { PropertyDecorator } from '../Contracts'
import { NanoIdNonSecureCast } from '../../casts/single/NanoIdNonSecureCast'

/**
 * Create a cast for an attribute property decorator.
 */
export function NanoIdNS(): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()
    self.setCast(propertyKey, NanoIdNonSecureCast)
    self.setRegistry(propertyKey, () => self.attr(''))
  }
}
