import type { FieldDecorator } from './Metadata'
import { HIDDEN, createRegistrationDecorator, ownMetadataRecord } from './Metadata'

/**
 * Create a hidden attribute property decorator.
 */
export function Hidden (): FieldDecorator {
  return createRegistrationDecorator((context) => {
    ownMetadataRecord<true>(context.metadata, HIDDEN)[String(context.name)] = true
  })
}
