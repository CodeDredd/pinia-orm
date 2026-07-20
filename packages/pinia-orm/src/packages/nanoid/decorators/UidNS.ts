import type { NanoidOptions } from '../../../../src/model/decorators/Contracts'
import type { FieldDecorator } from '../../../../src/model/decorators/Metadata'
import { CASTS, createFieldDecorator, ownMetadataRecord } from '../../../../src/model/decorators/Metadata'
import type { CastAttribute } from '../../../../src/model/casts/CastAttribute'
import { UidCast } from '../casts/NonSecureCast'

/**
 * Create a nanoid uid attribute property decorator.
 */
export function Uid (options?: NanoidOptions): FieldDecorator {
  return (_value, context) => {
    ownMetadataRecord<typeof CastAttribute>(context.metadata, CASTS)[String(context.name)] = UidCast.withParameters(options)
    return createFieldDecorator(model => model.uid())(_value, context)
  }
}
