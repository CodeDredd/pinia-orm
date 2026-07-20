import type { Model, PrimaryKey } from '../../../Model'
import type { FieldDecorator } from '../../Metadata'
import { createFieldDecorator } from '../../Metadata'

/**
 * Create a has-many attribute property decorator.
 */
export function HasMany (
  related: () => typeof Model,
  foreignKey: PrimaryKey,
  localKey?: PrimaryKey,
): FieldDecorator {
  return createFieldDecorator(model => model.hasMany(related(), foreignKey, localKey))
}
