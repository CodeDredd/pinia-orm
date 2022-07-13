import { nanoid } from 'nanoid/non-secure'
import { Type } from './Type'

export class Uid extends Type {
  /**
   * Make the value for the attribute.
   */
  make(value: any): string {
    return value ?? nanoid()
  }
}
