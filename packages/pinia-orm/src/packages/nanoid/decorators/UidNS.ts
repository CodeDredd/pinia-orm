import type { PropertyDecorator } from '../../../../src/decorators'
import { UidCast } from '../casts/NonSecureCast'
import type { NanoidOptions } from '../../../../src/model/decorators/Contracts'

/**
 * Create a cast for an attribute property decorator.
 */
export function Uid (options?: NanoidOptions): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()
    self.setCast(propertyKey, UidCast.withParameters(options))
    self.setRegistry(propertyKey, () => self.uid())
  }
}
