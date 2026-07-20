import type { Model } from '../../../Model'
import type { FieldDecorator } from '../../Metadata'
import { createFieldDecorator } from '../../Metadata'

/**
 * Create a morph-to attribute property decorator.
 */
export function MorphTo (
  related: () => typeof Model[],
  id: string,
  type: string,
  ownerKey?: string,
): FieldDecorator {
  return createFieldDecorator(model => model.morphTo(related(), id, type, ownerKey))
}
