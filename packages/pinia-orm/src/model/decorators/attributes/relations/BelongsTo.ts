import type { Model, PrimaryKey } from '../../../Model'
import type { FieldDecorator } from '../../Metadata'
import { createFieldDecorator } from '../../Metadata'

/**
 * Create a belongs-to attribute property decorator.
 */
export function BelongsTo (
  related: () => typeof Model,
  foreignKey: PrimaryKey,
  ownerKey?: PrimaryKey,
): FieldDecorator {
  return createFieldDecorator(model => model.belongsTo(related(), foreignKey, ownerKey))
}
