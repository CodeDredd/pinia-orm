import type { Model } from '../model/Model'

export const cache = <M extends Model = Model>() => new Map<string, M>()
