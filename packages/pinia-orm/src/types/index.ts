export interface Constructor<T> {
  new (...args: any[]): T
}

export type Mutator<T> = (value: T) => T

export interface MutatorFunctions<T> {
  get?: Mutator<T>
  set?: Mutator<T>
}

export interface Mutators {
  [name: string]: MutatorFunctions<any> | Mutator<any>
}

export interface CacheConfig {
  key?: string
  params?: Record<string, any>
}
