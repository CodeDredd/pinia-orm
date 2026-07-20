import type { CastAttribute } from '../casts/CastAttribute'
import type { FieldDecorator } from './Metadata'
import { CASTS, createRegistrationDecorator, ownMetadataRecord } from './Metadata'

/**
 * Create a cast for an attribute property decorator.
 */
export function Cast (to: (() => typeof CastAttribute)): FieldDecorator {
  return createRegistrationDecorator((context) => {
    ownMetadataRecord<typeof CastAttribute>(context.metadata, CASTS)[String(context.name)] = to()
  })
}
