import { Model } from './Model'
import { Constructor } from '../types'

export interface ModelConstructor<M extends Model> extends Constructor<M> {
  newRawInstance(): M
}
