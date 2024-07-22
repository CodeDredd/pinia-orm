import type { Model } from '../../../Model'
import type { PropertyDecorator } from '../../Contracts'

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
): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () => {
      if (typeof pivot === 'function') { return self.belongsToMany(related(), pivot(), foreignPivotKey, relatedPivotKey, parentKey, relatedKey) }

      return self.belongsToMany(related(), pivot.model(), foreignPivotKey, relatedPivotKey, parentKey, relatedKey).as(pivot.as)
    },
    )
  }
}
