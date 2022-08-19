import type { Model } from '../../Model'
import { generateId } from '../../../support/Utils'
import { Type } from './Type'

export class Uid extends Type {
  // This alphabet uses `A-Za-z0-9_-` symbols.
  // The order of characters is optimized for better gzip and brotli compression.
  // References to the same file (works both for gzip and brotli):
  // `'use`, `andom`, and `rict'`
  // References to the brotli default dictionary:
  // `-26T`, `1983`, `40px`, `75px`, `bush`, `jack`, `mind`, `very`, and `wolf`
  protected urlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'

  protected size = 21

  constructor(model: Model, size = 21) {
    super(model)
    this.size = size
  }

  /**
   * Make the value for the attribute.
   */
  make(value: any): string {
    return value ?? generateId(this.size, this.urlAlphabet)
  }
}
