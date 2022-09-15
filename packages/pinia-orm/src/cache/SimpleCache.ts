export interface StoredData<T> {
  key: string
  data: T
  expiration: number
}

// By default data will expire in 5 minutes.
const DEFAULT_EXPIRATION_SECONDS = 5 * 60

export class SimpleCache {
  constructor(private cache = new Map()) {}

  clear(): void {
    this.cache = new Map()
  }

  size(): number {
    return this.cache.size
  }

  private computeExpirationTime(expiresInSeconds: number): number {
    return new Date().getTime() + expiresInSeconds * 1000
  }

  // Store the data in memory and attach to the object expiration containing the
  // expiration time.
  set<T>({ key, data, expiration = DEFAULT_EXPIRATION_SECONDS }: StoredData<T>): T {
    this.cache.set(key, { data, expiration: this.computeExpirationTime(expiration) })

    return data
  }

  // Will get specific data from the Map object based on a key and return null if
  // the data has expired.
  get<T>(key: string): T | null {
    if (this.cache.has(key)) {
      const { data, expiration } = this.cache.get(key) as StoredData<T>

      return this.hasExpired(expiration) ? null : data
    }

    return null
  }

  private hasExpired(expiration: number): boolean {
    return expiration < new Date().getTime()
  }
}
