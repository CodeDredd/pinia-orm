import type { V1Options } from 'uuid'
import type { PropertyDecorator } from '../../../../src/decorators'
import { UidCast } from '../casts/V1Cast'

/**
 * Create a cast for an attribute property decorator.
 */
export function Uid (options?: V1Options): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()
    self.setCast(propertyKey, UidCast.withParameters(options))
    self.setRegistry(propertyKey, () => self.uid())
  }
}
