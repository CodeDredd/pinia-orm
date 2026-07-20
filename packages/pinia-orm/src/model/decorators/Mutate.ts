import type { Mutator, MutatorFunctions } from '../../types'
import type { FieldDecorator } from './Metadata'
import { MUTATORS, createRegistrationDecorator, ownMetadataRecord } from './Metadata'

/**
 * Create a Mutate attribute property decorator.
 */
export function Mutate (get?: Mutator<any>, set?: Mutator<any>): FieldDecorator {
  return createRegistrationDecorator((context) => {
    ownMetadataRecord<MutatorFunctions<any>>(context.metadata, MUTATORS)[String(context.name)] = { get, set }
  })
}
