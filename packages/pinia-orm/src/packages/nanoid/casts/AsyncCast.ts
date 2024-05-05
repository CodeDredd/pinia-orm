import { customAlphabet, nanoid as urlAlphabet } from 'nanoid/async'
import type { ModelFields } from '../../../../src/model/Model'
import { CastAttribute } from '../../../../src/model/casts/CastAttribute'
import type { NanoidOptions } from '../../../../src/model/decorators/Contracts'

/**
 * Create a cast nanoid/async.
 * @deprecated will be removed in v2 because nanoid v5 dropped it
 */
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
  async set (value: any): Promise<string | null> {
    const nanoid = this.$parameters?.alphabet ? customAlphabet(this.$parameters.alphabet) : urlAlphabet
    return value ?? await nanoid(this.$parameters?.size)
  }
}
