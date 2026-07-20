import type { deleteModes } from '../attributes/relations/Relation'
import type { FieldDecorator } from './Metadata'
import { FIELDS_ON_DELETE, createRegistrationDecorator, ownMetadataRecord } from './Metadata'

/**
 * Define the delete behaviour for a relation
 */
export function OnDelete (mode: deleteModes): FieldDecorator {
  return createRegistrationDecorator((context) => {
    ownMetadataRecord<deleteModes>(context.metadata, FIELDS_ON_DELETE)[String(context.name)] = mode
  })
}
