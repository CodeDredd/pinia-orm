import type { Model, WithKeys } from '../model/Model'
import type { Query } from './Query'

export interface Where<T = Model> {
  field: WherePrimaryClosure<T> | NonMethodKeys<T> | string | string[]
  value: WhereSecondaryClosure<T> | any
  boolean: 'and' | 'or'
}

export type NonMethodKeys<T> = { [P in keyof T]: T[P] extends Function ? never : P }[keyof T]
export type GetElementType<T extends unknown[] | unknown> = T extends (infer U)[] ? U : T
export type UltimateKeys<M> = { [T in keyof M]: M[T] extends Model | Model[] | null ? GetElementType<NonNullable<M[T]>> : never }
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

export type EagerLoad<M extends Model> = {
  [K in keyof M]: EagerLoadConstraint<GetElementType<M[WithKeys<M>] extends Model ? M[WithKeys<M>] : never>>
}

export type EagerLoadConstraint<M extends Model> = (query: Query<M>) => void
