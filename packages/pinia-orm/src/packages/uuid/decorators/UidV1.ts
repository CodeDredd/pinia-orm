import type { Version1Options } from 'uuid'
import type { FieldDecorator } from '../../../../src/model/decorators/Metadata'
import { CASTS, createFieldDecorator, ownMetadataRecord } from '../../../../src/model/decorators/Metadata'
import type { CastAttribute } from '../../../../src/model/casts/CastAttribute'
import { UidCast } from '../casts/V1Cast'

/**
 * Create a uuid v1 uid attribute property decorator.
 */
export function Uid (options?: Version1Options): FieldDecorator {
  return (_value, context) => {
    ownMetadataRecord<typeof CastAttribute>(context.metadata, CASTS)[String(context.name)] = UidCast.withParameters(options)
    return createFieldDecorator(model => model.uid())(_value, context)
  }
}
