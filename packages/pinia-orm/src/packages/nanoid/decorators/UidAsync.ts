import type { PropertyDecorator } from '../../../../src/decorators'
import { UidCast } from '../casts/AsyncCast'
import type { NanoidOptions } from '../../../../src/model/decorators/Contracts'

/**
 * Creates an uuid based on nanoid/async.
 * @deprecated will be removed in v2 because nanoid v5 dropped it
 */
export function Uid (options?: NanoidOptions): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()
    self.setCast(propertyKey, UidCast.withParameters(options))
    self.setRegistry(propertyKey, () => self.uid())
  }
}
