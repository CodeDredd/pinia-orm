import { nanoid } from 'nanoid/non-secure'
import type { ModelFields } from '../../Model'
import { CastAttribute } from '../CastAttribute'

export class NanoIdNonSecureCast extends CastAttribute {
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
