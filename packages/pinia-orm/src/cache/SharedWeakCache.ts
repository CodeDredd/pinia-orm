import type { Model } from '../model/Model'
import { WeakCache } from './WeakCache'

export const cache = new WeakCache<string, Model[]>()
