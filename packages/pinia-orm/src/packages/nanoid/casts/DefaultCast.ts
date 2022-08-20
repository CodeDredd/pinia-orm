import { nanoid } from 'nanoid'
import type { ModelFields } from '../../../../src/model/Model'
import { CastAttribute } from '../../../../src/model/casts/CastAttribute'

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
    return value ?? nanoid()
  }
}
