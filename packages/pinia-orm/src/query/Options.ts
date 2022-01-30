import { Query } from './Query'

export interface Where {
  field: WherePrimaryClosure | string
  value: WhereSecondaryClosure | any
  boolean: 'and' | 'or'
}

export type WherePrimaryClosure = (model: any) => boolean

export type WhereSecondaryClosure = (value: any) => boolean

export interface WhereGroup {
  and?: Where[]
  or?: Where[]
}

export interface Order {
  field: OrderBy
  direction: OrderDirection
}

export type OrderBy = string | ((model: any) => any)

export type OrderDirection = 'asc' | 'desc'

export interface EagerLoad {
  [name: string]: EagerLoadConstraint
}

export type EagerLoadConstraint = (query: Query) => void
