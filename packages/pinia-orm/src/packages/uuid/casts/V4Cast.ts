import { v4 } from 'uuid'
import type { V4Options } from 'uuid'
import type { ModelFields } from '../../../../src/model/Model'
import { CastAttribute } from '../../../../src/model/casts/CastAttribute'

export class UidCast extends CastAttribute {
  static parameters?: V4Options

  /**
   * Create a new String attribute instance.
   */
  constructor (attributes: ModelFields) {
    super(attributes)
  }

  static withParameters (parameters?: V4Options): typeof CastAttribute {
    this.parameters = parameters
    return this
  }

  /**
   * Make the value for the attribute.
   */
  set (value: any): string | null {
    return value ?? v4(this.$parameters)
  }
}
