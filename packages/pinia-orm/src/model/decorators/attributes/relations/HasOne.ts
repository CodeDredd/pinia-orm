import type { Model, PrimaryKey } from '../../../Model'
import type { PropertyDecorator } from '../../Contracts'

/**
 * Create a has-one attribute property decorator.
 */
export function HasOne(
  related: () => typeof Model,
  foreignKey: PrimaryKey,
  localKey?: PrimaryKey,
): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () =>
      self.hasOne(related(), foreignKey, localKey),
    )
  }
}
