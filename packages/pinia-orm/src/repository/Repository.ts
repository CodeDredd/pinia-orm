import type { Constructor } from '../types'
import { assert, isArray } from '../support/Utils'
import type { Collection, Element, Item } from '../data/Data'
import type { Database } from '../database/Database'
import type { Model } from '../model/Model'
import type { ModelConstructor } from '../model/ModelConstructor'
import { Query } from '../query/Query'
import type {
  EagerLoadConstraint,
  GroupByFields,
  OrderBy,
  OrderDirection,
  WherePrimaryClosure,
  WhereSecondaryClosure,
} from '../query/Options'
import { useRepo } from '../composables/useRepo'
import { useDataStore } from '../composables/useDataStore'

export class Repository<M extends Model = Model> {
  /**
   * A special flag to indicate if this is the repository class or not. It's
   * used when retrieving repository instance from `store.$repo()` method to
   * determine whether the passed in class is either a repository or a model.
   */
  static _isRepository = true

  /**
   * The database instance.
   */
  database: Database

  /**
   * The model instance.
   */
  protected model!: M

  /**
   * The model object to be used for the custom repository.
   */
  use?: typeof Model

  /**
   * Create a new Repository instance.
   */
  constructor(database: Database) {
    this.database = database
  }

  /**
   * Initialize the repository by setting the model instance.
   */
  initialize(model?: ModelConstructor<M>): this {
    // If there's a model passed in, just use that and return immediately.
    if (model) {
      this.model = model.newRawInstance()
      return this
    }

    // If no model was passed to the initializer, that means the user has
    // passed repository to the `store.$repo` method instead of a model.
    // In this case, we'll check if the user has set model to the `use`
    // property and instantiate that.
    if (this.use) {
      this.model = this.use.newRawInstance() as M
      return this
    }

    // Else just return for now. If the user tries to call methods that require
    // a model, the error will be thrown at that time.
    return this
  }

  /**
   * Get the model instance. If the model is not registered to the repository,
   * it will throw an error. It happens when users use a custom repository
   * without setting `use` property.
   */
  getModel(): M {
    assert(!!this.model, [
      'The model is not registered. Please define the model to be used at',
      '`use` property of the repository class.',
    ])

    return this.model
  }

  /**
   * Returns the pinia store used with this model
   */
  piniaStore() {
    return useDataStore<M>(this.model.$entity(), this.model.$piniaOptions())()
  }

  /**
   * Create a new repository with the given model.
   */
  repo<M extends Model>(model: Constructor<M>): Repository<M>
  repo<R extends Repository<any>>(repository: Constructor<R>): R
  repo(modelOrRepository: any): any {
    return useRepo(modelOrRepository)
  }

  /**
   * Create a new Query instance.
   */
  query(): Query<M> {
    return new Query(this.database, this.getModel())
  }

  /**
   * Add a basic where clause to the query.
   */
  where(
    field: WherePrimaryClosure | string,
    value?: WhereSecondaryClosure | any,
  ): Query<M> {
    return this.query().where(field, value)
  }

  /**
   * Add an "or where" clause to the query.
   */
  orWhere(
    field: WherePrimaryClosure | string,
    value?: WhereSecondaryClosure | any,
  ): Query<M> {
    return this.query().orWhere(field, value)
  }

  /**
   * Add a "where has" clause to the query.
   */
  whereHas(relation: string, callback: EagerLoadConstraint = () => {}, operator?: string | number, count?: number): Query<M> {
    return this.query().whereHas(relation, callback, operator, count)
  }

  /**
   * Add an "or where has" clause to the query.
   */
  orWhereHas(relation: string, callback: EagerLoadConstraint = () => {}, operator?: string | number, count?: number): Query<M> {
    return this.query().orWhereHas(relation, callback, operator, count)
  }

  /**
   * Add a "has" clause to the query.
   */
  has(relation: string, operator?: string | number, count?: number): Query<M> {
    return this.query().has(relation, operator, count)
  }

  /**
   * Add an "or has" clause to the query.
   */
  orHas(relation: string, operator?: string | number, count?: number): Query<M> {
    return this.query().orHas(relation, operator, count)
  }

  /**
   * Add a "doesn't have" clause to the query.
   */
  doesntHave(relation: string): Query<M> {
    return this.query().doesntHave(relation)
  }

  /**
   * Add a "doesn't have" clause to the query.
   */
  orDoesntHave(relation: string): Query<M> {
    return this.query().orDoesntHave(relation)
  }

  /**
   * Add a "where doesn't have" clause to the query.
   */
  whereDoesntHave(relation: string, callback: EagerLoadConstraint = () => {}): Query<M> {
    return this.query().whereDoesntHave(relation, callback)
  }

  /**
   * Add an "or where doesn't have" clause to the query.
   */
  orWhereDoesntHave(relation: string, callback: EagerLoadConstraint = () => {}): Query<M> {
    return this.query().orWhereDoesntHave(relation, callback)
  }

  /**
   * Add a "group by" clause to the query.
   */
  groupBy(...fields: GroupByFields): Query<M> {
    return this.query().groupBy(...fields)
  }

  /**
   * Add an "order by" clause to the query.
   */
  orderBy(field: OrderBy, direction?: OrderDirection): Query<M> {
    return this.query().orderBy(field, direction)
  }

  /**
   * Set the "limit" value of the query.
   */
  limit(value: number): Query<M> {
    return this.query().limit(value)
  }

  /**
   * Set the "offset" value of the query.
   */
  offset(value: number): Query<M> {
    return this.query().offset(value)
  }

  /**
   * Set the relationships that should be eager loaded.
   */
  with(name: string, callback?: EagerLoadConstraint): Query<M> {
    return this.query().with(name, callback)
  }

  /**
   * Set to eager load all top-level relationships. Constraint is set for all relationships.
   */
  withAll(callback?: EagerLoadConstraint): Query<M> {
    return this.query().withAll(callback)
  }

  /**
   * Set to eager load all top-level relationships. Constraint is set for all relationships.
   */
  withAllRecursive(depth?: number): Query<M> {
    return this.query().withAllRecursive(depth)
  }

  /**
   * Get all models from the store.
   */
  all(): Collection<M> {
    return this.query().get()
  }

  /**
   * Find the model with the given id.
   */
  find(id: string | number): Item<M>
  find(ids: (string | number)[]): Collection<M>
  find(ids: any): Item<any> {
    return this.query().find(ids)
  }

  /**
   * Retrieves the models from the store by following the given
   * normalized schema.
   */
  revive(schema: Element[]): Collection<M>
  revive(schema: Element): Item<M>
  revive(schema: Element | Element[]): Item<M> | Collection<M> {
    return this.query().revive(schema)
  }

  /**
   * Create a new model instance. This method will not save the model to the
   * store. It's pretty much the alternative to `new Model()`, but it injects
   * the store instance to support model instance methods in SSR environment.
   */
  make(records: Element[]): M[]
  make(record?: Element): M
  make(records?: Element | Element[]): M | M[] {
    if (isArray(records)) {
      return records.map(record => this.getModel().$newInstance(record, {
        relations: true,
      }))
    }

    return this.getModel().$newInstance(records, {
      relations: true,
    })
  }

  /*
   * Save the given records to the store with data normalization.
   */
  save(records: Element[]): M[]
  save(record: Element): M
  public save(records: Element | Element[]): M | M[] {
    return this.query().save(records)
  }

  /**
   * Create and persist model with default values.
   */
  new(): M {
    return this.query().new()
  }

  /**
   * Insert the given records to the store.
   */
  insert(records: Element[]): Collection<M>
  insert(record: Element): M
  insert(records: Element | Element[]): M | Collection<M> {
    return this.query().insert(records)
  }

  /**
   * Insert the given records to the store by replacing any existing records.
   */
  fresh(records: Element[]): Collection<M>
  fresh(record: Element): M
  fresh(records: Element | Element[]): M | Collection<M> {
    return this.query().fresh(records)
  }

  /**
   * Destroy the models for the given id.
   */
  destroy(ids: (string | number)[]): Collection<M>
  destroy(id: string | number): Item<M>
  destroy(ids: any): any {
    return this.query().destroy(ids)
  }

  /**
   * Delete all records in the store.
   */
  flush(): M[] {
    return this.query().flush()
  }
}
