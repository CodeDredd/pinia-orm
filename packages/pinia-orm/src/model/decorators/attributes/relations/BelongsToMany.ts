import type { Model } from '../../../Model'
import type { PropertyDecorator } from '../../Contracts'

/**
 * Create a belongs-to-many attribute property decorator.
 */
export function BelongsToMany(
  related: () => typeof Model,
  pivot: () => typeof Model,
  foreignPivotKey: string,
  relatedPivotKey: string,
  parentKey?: string,
  relatedKey?: string,
): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () =>
      self.belongsToMany(related(), pivot(), foreignPivotKey, relatedPivotKey, parentKey, relatedKey),
    )
  }
}
