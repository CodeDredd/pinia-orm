export type { FieldDecorator } from './Metadata'

export type UidOptions = NanoidOptions | number

export interface NanoidOptions {
  alphabet?: string
  size?: number
}

export interface TypeOptions {
  notNullable?: boolean
}
