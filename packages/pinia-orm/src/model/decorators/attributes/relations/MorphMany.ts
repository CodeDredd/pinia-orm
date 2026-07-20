import type { Model } from '../../../Model'
import type { FieldDecorator } from '../../Metadata'
import { createFieldDecorator } from '../../Metadata'

/**
 * Create a morph-many attribute property decorator.
 */
export function MorphMany (
  related: () => typeof Model,
  id: string,
  type: string,
  localKey?: string,
): FieldDecorator {
  return createFieldDecorator(model => model.morphMany(related(), id, type, localKey))
}
