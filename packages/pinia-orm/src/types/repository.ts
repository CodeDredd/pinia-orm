import type { Collection, Item, Model, Query } from '../'

declare module '../repository/Repository' {
  interface Repository<M extends Model = Model> {
    /**
     * Add a where clause where `field` value is in values.
     */
    whereIn (field: string, values: any[] | Set<any>): Query<M>
    /**
     * Add a where clause where `field` value is in values or ...
     */
    orWhereIn (field: string, values: any[] | Set<any>): Query<M>
    /**
     * Add a where clause where `field` value is not in values or ...
     */
    orWhereNotIn (field: string, values: any[] | Set<any>): Query<M>
    /**
     * Add a where clause where `field` has not defined values
     */
    whereNotIn (field: string, values: any[] | Set<any>): Query<M>
    /**
     * Add a where clause to get all results where `field` is null
     */
    whereNull (field: string): Query<M>
    /**
     * Add a where clause to get all results where `field` is not null
     */
    whereNotNull (field: string): Query<M>
    /**
     * Find the model with the given id.
     */
    find (id: string | number): Item<M>
    find (ids: (string | number)[]): Collection<M>
    find (ids: any): Item<any>
  }
}
