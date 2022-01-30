import { Model } from '../../../Model'
import { PropertyDecorator } from '../../Contracts'

/**
 * Create a belongs-to attribute property decorator.
 */
export function BelongsTo(
  related: () => typeof Model,
  foreignKey: string,
  ownerKey?: string
): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () =>
      self.belongsTo(related(), foreignKey, ownerKey)
    )
  }
}
