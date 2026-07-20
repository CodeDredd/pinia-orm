import type { Model } from '../../../Model'
import type { FieldDecorator } from '../../Metadata'
import { createFieldDecorator } from '../../Metadata'

/**
 * Create a morph-to-many attribute property decorator.
 */
export function MorphToMany (
  related: () => typeof Model,
  pivot: (() => typeof Model) | {
    as: string
    model: () => typeof Model
  },
  relatedId: string,
  id: string,
  type: string,
  parentKey?: string,
  relatedKey?: string,
): FieldDecorator {
  return createFieldDecorator((model) => {
    if (typeof pivot === 'function') { return model.morphToMany(related(), pivot(), relatedId, id, type, parentKey, relatedKey) }

    return model.morphToMany(related(), pivot.model(), relatedId, id, type, parentKey, relatedKey).as(pivot.as)
  })
}
