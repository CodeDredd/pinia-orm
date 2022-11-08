import type { PropertyDecorator } from '../../Contracts'
import type { TypeDefault } from '../../../attributes/types/Type'

/**
 * Create an Attr attribute property decorator.
 */
export function Attr(value?: TypeDefault<any>): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () => self.attr(value))
  }
}
