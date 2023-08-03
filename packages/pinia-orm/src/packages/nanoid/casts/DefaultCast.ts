import { customAlphabet, nanoid as urlAlphabet } from 'nanoid'
import type { ModelFields } from '../../../../src/model/Model'
import { CastAttribute } from '../../../../src/model/casts/CastAttribute'

export class UidCast extends CastAttribute {
  static parameters = {
    alphabet: 'string',
    size: 'number',
  }

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
    const nanoid = this.$parameters.alphabet ? customAlphabet(this.$parameters.alphabet) : urlAlphabet
    return value ?? nanoid(this.$parameters.size)
  }
}
