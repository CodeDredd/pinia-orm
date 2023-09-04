import { Repository } from 'pinia-orm'
import { Request } from './api/Request'
function useAxiosApi (repository: typeof Repository) {
 return new Request(repository)
}
