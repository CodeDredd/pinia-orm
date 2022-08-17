import type { Model } from '../model/Model'

export type Element = Record<string, any>

export interface Elements {
  [id: string]: Element
}

export interface NormalizedData {
  [entity: string]: Elements
}

export type Item<M extends Model = Model> = M | null

export type Collection<M extends Model = Model> = M[]

export type GroupedCollection<M extends Model = Model> = Record<string, M[]>
