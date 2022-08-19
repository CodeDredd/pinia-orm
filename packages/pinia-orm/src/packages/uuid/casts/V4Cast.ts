import { v4 } from 'uuid'
import type { ModelFields } from '../../../../src'
import { CastAttribute } from '../../../../src'

export class UidCast extends CastAttribute {
  /**
   * Create a new String attribute instance.
   */
  constructor(attributes: ModelFields) {
    super(attributes)
  }

  /**
   * Make the value for the attribute.
   */
  set(value: any): string | null {
    return value ?? v4()
  }
}
