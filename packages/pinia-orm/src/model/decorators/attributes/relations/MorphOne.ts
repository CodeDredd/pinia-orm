import type { Model } from '../../../Model'
import type { FieldDecorator } from '../../Metadata'
import { createFieldDecorator } from '../../Metadata'

/**
 * Create a morph-one attribute property decorator.
 */
export function MorphOne (
  related: () => typeof Model,
  id: string,
  type: string,
  localKey?: string,
): FieldDecorator {
  return createFieldDecorator(model => model.morphOne(related(), id, type, localKey))
}
