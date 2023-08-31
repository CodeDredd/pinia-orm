import { customAlphabet, nanoid as urlAlphabet } from 'nanoid/non-secure'
import type { ModelFields } from '../../../../src/model/Model'
import { CastAttribute } from '../../../../src/model/casts/CastAttribute'
import type { NanoidOptions } from '../../../../src/model/decorators/Contracts'

export class UidCast extends CastAttribute {
  static parameters?: NanoidOptions

  /**
   * Create a new String attribute instance.
   */
  constructor (attributes: ModelFields) {
    super(attributes)
  }

  static withParameters (parameters?: NanoidOptions): typeof CastAttribute {
    this.parameters = parameters
    return this
  }

  /**
   * Make the value for the attribute.
   */
  set (value: any): string | null {
    const nanoid = this.$parameters?.alphabet ? customAlphabet(this.$parameters.alphabet) : urlAlphabet
    return value ?? nanoid(this.$parameters?.size)
  }
}
