import type { Version4Options } from 'uuid'
import type { FieldDecorator } from '../../../../src/model/decorators/Metadata'
import { CASTS, createFieldDecorator, ownMetadataRecord } from '../../../../src/model/decorators/Metadata'
import type { CastAttribute } from '../../../../src/model/casts/CastAttribute'
import { UidCast } from '../casts/V4Cast'

/**
 * Create a uuid v4 uid attribute property decorator.
 */
export function Uid (options?: Version4Options): FieldDecorator {
  return (_value, context) => {
    ownMetadataRecord<typeof CastAttribute>(context.metadata, CASTS)[String(context.name)] = UidCast.withParameters(options)
    return createFieldDecorator(model => model.uid())(_value, context)
  }
}
