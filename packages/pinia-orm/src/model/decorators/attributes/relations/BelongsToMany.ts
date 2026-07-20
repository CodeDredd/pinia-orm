import type { Model } from '../../../Model'
import type { FieldDecorator } from '../../Metadata'
import { createFieldDecorator } from '../../Metadata'

/**
 * Create a belongs-to-many attribute property decorator.
 */
export function BelongsToMany (
  related: () => typeof Model,
  pivot: (() => typeof Model) | {
    as: string
    model: () => typeof Model
  },
  foreignPivotKey: string,
  relatedPivotKey: string,
  parentKey?: string,
  relatedKey?: string,
): FieldDecorator {
  return createFieldDecorator((model) => {
    if (typeof pivot === 'function') { return model.belongsToMany(related(), pivot(), foreignPivotKey, relatedPivotKey, parentKey, relatedKey) }

    return model.belongsToMany(related(), pivot.model(), foreignPivotKey, relatedPivotKey, parentKey, relatedKey).as(pivot.as)
  })
}
