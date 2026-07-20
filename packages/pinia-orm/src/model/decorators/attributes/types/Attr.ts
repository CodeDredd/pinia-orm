import type { FieldDecorator } from '../../Metadata'
import { createFieldDecorator } from '../../Metadata'
import type { TypeDefault } from '../../../attributes/types/Type'

/**
 * Create an Attr attribute property decorator.
 */
export function Attr (value?: TypeDefault<any>): FieldDecorator {
  return createFieldDecorator(model => model.attr(value))
}
