import type { UidOptions } from '../../Contracts'
import type { FieldDecorator } from '../../Metadata'
import { createFieldDecorator } from '../../Metadata'

/**
 * Create a Uid attribute property decorator.
 */
export function Uid (options?: UidOptions): FieldDecorator {
  return createFieldDecorator(model => model.uid(options))
}
