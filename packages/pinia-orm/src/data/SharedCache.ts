import { WeakCache } from '../cache/WeakCache'
import type { Model } from '../model/Model'

export const cache = new WeakCache<string, Model[]>()
