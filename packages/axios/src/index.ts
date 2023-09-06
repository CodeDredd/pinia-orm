import { Repository } from 'pinia-orm'
import { Request } from './api/Request'

export function useAxiosApi (repository: typeof Repository) {
  return new Request(repository)
}

export * from './api/Response'
export * from './api/Request'
