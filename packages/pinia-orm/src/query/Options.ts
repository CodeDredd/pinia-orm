import { Model } from '@/model/Model';
import type { Query } from './Query'

export interface Where<T = Model> {
  field: WherePrimaryClosure<T> | NonMethodKeys<T> | string
  value: WhereSecondaryClosure<T> | any
  boolean: 'and' | 'or'
}

export type NonMethodKeys<T> = { [P in keyof T]: T[P] extends Function ? never : P }[keyof T];

export type WherePrimaryClosure<T> = (model: T) => boolean

export type WhereSecondaryClosure<T> = (value: T) => boolean

export interface WhereGroup {
  and?: Where[]
  or?: Where[]
}

export interface Order {
  field: OrderBy
  direction: OrderDirection
}

export interface Group {
  field: GroupBy
}

export type OrderBy = string | ((model: any) => any)

export type GroupBy = string
export type GroupByFields = string[]

export type OrderDirection = 'asc' | 'desc'

export interface EagerLoad {
  [name: string]: EagerLoadConstraint
}

export type EagerLoadConstraint = (query: Query) => void
