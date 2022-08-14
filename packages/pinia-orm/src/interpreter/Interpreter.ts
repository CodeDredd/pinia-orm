import type { schema as Normalizr } from '@pinia-orm/normalizr'
import { normalize } from '@pinia-orm/normalizr'
import { isArray } from '../support/Utils'
import type { Element, NormalizedData } from '../data/Data'
import type { Model } from '../model/Model'
import { Schema } from '../schema/Schema'

export class Interpreter {
  /**
   * The model object.
   */
  model: Model

  /**
   * Create a new Interpreter instance.
   */
  constructor(model: Model) {
    this.model = model
  }

  /**
   * Perform interpretation for the given data.
   */
  process(data: Element): [Element, NormalizedData]
  process(data: Element[]): [Element[], NormalizedData]
  process(data: Element | Element[]): [Element | Element[], NormalizedData] {
    const normalizedData = this.normalize(data)

    return [data, normalizedData]
  }

  /**
   * Normalize the given data.
   */
  private normalize(data: Element | Element[]): NormalizedData {
    const schema = isArray(data) ? [this.getSchema()] : this.getSchema()

    return normalize(data, schema).entities as NormalizedData
  }

  /**
   * Get the schema from the database.
   */
  private getSchema(): Normalizr.Entity {
    return new Schema(this.model).one()
  }
}
