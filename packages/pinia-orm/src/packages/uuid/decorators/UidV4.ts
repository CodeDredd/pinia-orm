import type { PropertyDecorator } from '../../../../src/decorators'
import { UidCast } from '../casts/V4Cast'

/**
 * Create a cast for an attribute property decorator.
 */
export function Uid(): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()
    self.setCast(propertyKey, UidCast)
    self.setRegistry(propertyKey, () => self.uid())
  }
}
