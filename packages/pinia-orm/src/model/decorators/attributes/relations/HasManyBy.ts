import type { Model } from '../../../Model'
import type { FieldDecorator } from '../../Metadata'
import { createFieldDecorator } from '../../Metadata'

/**
 * Create a has-many-by attribute property decorator.
 */
export function HasManyBy (
  related: () => typeof Model,
  foreignKey: string,
  ownerKey?: string,
): FieldDecorator {
  return createFieldDecorator(model => model.hasManyBy(related(), foreignKey, ownerKey))
}
