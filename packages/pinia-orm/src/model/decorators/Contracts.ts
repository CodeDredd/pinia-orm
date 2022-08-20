import type { Model } from '../Model'

export type PropertyDecorator = (target: Model, propertyKey: string) => void

export interface TypeOptions {
  notNullable?: boolean
}
