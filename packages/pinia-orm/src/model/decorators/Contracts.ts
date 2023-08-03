import type { Model } from '../Model'

export type PropertyDecorator = (target: Model, propertyKey: string) => void

export type UidOptions = Record<string, any> | number

export interface TypeOptions {
  notNullable?: boolean
}
