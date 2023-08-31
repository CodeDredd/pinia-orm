import type { PropertyDecorator, UidOptions } from '../../../../src/decorators'
import { UidCast } from '../casts/NonSecureCast'

/**
 * Create a cast for an attribute property decorator.
 */
export function Uid (options?: UidOptions): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()
    self.setCast(propertyKey, UidCast)
    self.setRegistry(propertyKey, () => self.uid(options))
  }
}
