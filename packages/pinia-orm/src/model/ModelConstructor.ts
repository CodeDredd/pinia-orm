import type { Constructor } from '../types'
import type { Model } from './Model'

export interface ModelConstructor<M extends Model> extends Constructor<M> {
  newRawInstance(): M
}
