import type { Model, PrimaryKey } from '../../../Model'
import type { FieldDecorator } from '../../Metadata'
import { createFieldDecorator } from '../../Metadata'

/**
 * Create a has-one attribute property decorator.
 */
export function HasOne (
  related: () => typeof Model,
  foreignKey: PrimaryKey,
  localKey?: PrimaryKey,
): FieldDecorator {
  return createFieldDecorator(model => model.hasOne(related(), foreignKey, localKey))
}
