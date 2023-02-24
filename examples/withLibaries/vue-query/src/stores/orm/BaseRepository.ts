import { Repository } from 'pinia-orm'
import { useQuery } from 'vue-query/esm'
import type { QueryFunction } from 'react-query/core'
import type { UseQueryOptions } from 'vue-query/esm/vue/useQuery'

export default class BaseRepository extends Repository {
  vueQuery(
    queryFn: QueryFunction,
    options?: Omit<UseQueryOptions, 'queryKey'>
  ) {
    return useQuery(this.model.$entity(), queryFn, options)
  }
}
