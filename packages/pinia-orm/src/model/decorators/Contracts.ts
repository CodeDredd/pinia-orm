import type { Model } from '../Model'

export type PropertyDecorator = (target: Model, propertyKey: string) => void

export type UidOptions = NanoidOptions | number

export interface NanoidOptions {
  alphabet?: string
  size?: number
}

export interface TypeOptions {
  notNullable?: boolean
}
