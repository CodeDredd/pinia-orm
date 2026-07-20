import type { Model } from '../../../Model'
import type { FieldDecorator } from '../../Metadata'
import { createFieldDecorator } from '../../Metadata'

/**
 * Create a has-many attribute property decorator.
 */
export function HasManyThrough (
  related: () => typeof Model,
  through: () => typeof Model,
  firstKey: string,
  secondKey: string,
  localKey?: string,
  secondLocalKey?: string,
): FieldDecorator {
  return createFieldDecorator(model => model.hasManyThrough(related(), through(), firstKey, secondKey, localKey, secondLocalKey))
}
