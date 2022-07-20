import {
  assert,
  groupBy,
  isArray,
  isEmpty,
  isFunction,
  orderBy,
} from '../support/Utils'
import type { Collection, Element, Elements, Item } from '../data/Data'
import type { Database } from '../database/Database'
import { Relation } from '../model/attributes/relations/Relation'
import { MorphTo } from '../model/attributes/relations/MorphTo'
import type { Model, ModelOptions } from '../model/Model'
import { Interpreter } from '../interpreter/Interpreter'
import { useDataStore } from '../composables/useDataStore'
import type {
  EagerLoad,
  EagerLoadConstraint,
  Order,
  OrderBy,
  OrderDirection,
  Where,
  WherePrimaryClosure,
  WhereSecondaryClosure,
} from './Options'

export class Query<M extends Model = Model> {
  /**
   * The database instance.
   */
  database: Database

  /**
   * The model object.
   */
  protected model: M

  /**
   * The where constraints for the query.
   */
  protected wheres: Where[] = []

  /**
   * The orderings for the query.
   */
  protected orders: Order[] = []

  /**
   * The maximum number of records to return.
   */
  protected take: number | null = null

  /**
   * The number of records to skip.
   */
  protected skip = 0

  /**
   * The relationships that should be eager loaded.
   */
  protected eagerLoad: EagerLoad = {}

  /**
   * Create a new query instance.
   */
  constructor(database: Database, model: M) {
    this.database = database
    this.model = model
  }

  /**
   * Create a new query instance for the given model.
   */
  newQuery(model: string): Query<Model> {
    return new Query(this.database, this.database.getModel(model))
  }

  /**
   * Create a new query instance with constraints for the given model.
   */
  newQueryWithConstraints(model: string): Query<Model> {
    const newQuery = new Query(this.database, this.database.getModel(model))

    // Copy query constraints
    newQuery.eagerLoad = { ...this.eagerLoad }
    newQuery.wheres = [...this.wheres]
    newQuery.orders = [...this.orders]
    newQuery.take = this.take
    newQuery.skip = this.skip

    return newQuery
  }

  /**
   * Create a new query instance from the given relation.
   */
  newQueryForRelation(relation: Relation): Query<Model> {
    return new Query(this.database, relation.getRelated())
  }

  /**
   * Create a new interpreter instance.
   */
  protected newInterpreter(): Interpreter {
    return new Interpreter(this.model)
  }

  /**
   * Commit a store action and get the data
   */
  protected commit(name: string, payload?: any): Elements {
    const newStore = useDataStore(this.model.$entity(), this.model.$piniaOptions())
    const store = newStore()
    if (name && typeof store[name] === 'function')
      store[name](payload)

    return store.$state.data
  }

  /**
   * Add a basic where clause to the query.
   */
  where(
    field: WherePrimaryClosure | string,
    value?: WhereSecondaryClosure | any,
  ): this {
    this.wheres.push({ field, value, boolean: 'and' })

    return this
  }

  /**
   * Add a "where in" clause to the query.
   */
  whereIn(field: string, values: any[]): this {
    this.wheres.push({ field, value: values, boolean: 'and' })

    return this
  }

  /**
   * Add a where clause on the primary key to the query.
   */
  whereId(ids: string | number | (string | number)[]): this {
    return this.where(this.model.$getKeyName() as any, ids)
  }

  /**
   * Add an "or where" clause to the query.
   */
  orWhere(
    field: WherePrimaryClosure | string,
    value?: WhereSecondaryClosure | any,
  ): this {
    this.wheres.push({ field, value, boolean: 'or' })

    return this
  }

  /**
   * Add an "order by" clause to the query.
   */
  orderBy(field: OrderBy, direction: OrderDirection = 'asc'): Query<M> {
    this.orders.push({ field, direction })

    return this
  }

  /**
   * Set the "limit" value of the query.
   */
  limit(value: number): this {
    this.take = value

    return this
  }

  /**
   * Set the "offset" value of the query.
   */
  offset(value: number): this {
    this.skip = value

    return this
  }

  /**
   * Set the relationships that should be eager loaded.
   */
  with(name: string, callback: EagerLoadConstraint = () => {}): Query<M> {
    this.eagerLoad[name] = callback

    return this
  }

  /**
   * Set to eager load all top-level relationships. Constraint is set for all relationships.
   */
  withAll(callback: EagerLoadConstraint = () => {}): Query<M> {
    const fields = this.model.$fields()

    for (const name in fields)
      fields[name] instanceof Relation && this.with(name, callback)

    return this
  }

  /**
   * Set to eager load all relationships recursively.
   */
  withAllRecursive(depth = 3): Query<M> {
    this.withAll((query) => {
      depth > 0 && query.withAllRecursive(depth - 1)
    })

    return this
  }

  /**
   * Get raw elements from the store.
   */
  protected data(): Elements {
    return this.commit('get')
  }

  /**
   * Get all models from the store. The difference with the `get` is that this
   * method will not process any query chain. It'll always retrieve all models.
   */
  all(): Collection<M> {
    const records = this.commit('get')

    const collection = [] as Collection<M>

    for (const id in records) collection.push(this.hydrate(records[id]))

    return collection
  }

  /**
   * Retrieve models by processing whole query chain.
   */
  get(): Collection<M> {
    const models = this.select()

    if (!isEmpty(models))
      this.eagerLoadRelations(models)

    return models
  }

  /**
   * Execute the query and get the first result.
   */
  first(): Item<M> {
    return this.limit(1).get()[0] ?? null
  }

  /**
   * Find a model by its primary key.
   */
  find(id: string | number): Item<M>
  find(ids: (string | number)[]): Collection<M>
  find(ids: any): any {
    return isArray(ids) ? this.findIn(ids) : this.whereId(ids).first()
  }

  /**
   * Find multiple models by their primary keys.
   */
  findIn(ids: (string | number)[]): Collection<M> {
    return this.whereId(ids).get()
  }

  /**
   * Retrieve models by processing all filters set to the query chain.
   */
  select(): Collection<M> {
    let models = this.all()

    models = this.filterWhere(models)
    models = this.filterOrder(models)
    models = this.filterLimit(models)

    return models
  }

  /**
   * Filter the given collection by the registered where clause.
   */
  protected filterWhere(models: Collection<M>): Collection<M> {
    if (isEmpty(this.wheres))
      return models

    const comparator = this.getWhereComparator()

    return models.filter(model => comparator(model))
  }

  /**
   * Get comparator for the where clause.
   */
  protected getWhereComparator(): (model: any) => boolean {
    const { and, or } = groupBy(this.wheres, where => where.boolean)

    return (model) => {
      const results: boolean[] = []

      and && results.push(and.every(w => this.whereComparator(model, w)))
      or && results.push(or.some(w => this.whereComparator(model, w)))

      return results.includes(true)
    }
  }

  /**
   * The function to compare where clause to the given model.
   */
  protected whereComparator(model: M, where: Where): boolean {
    if (isFunction(where.field))
      return where.field(model)

    if (isArray(where.value))
      return where.value.includes(model[where.field])

    if (isFunction(where.value))
      return where.value(model[where.field])

    return model[where.field] === where.value
  }

  /**
   * Filter the given collection by the registered order conditions.
   */
  protected filterOrder(models: Collection<M>): Collection<M> {
    if (this.orders.length === 0)
      return models

    const fields = this.orders.map(order => order.field)
    const directions = this.orders.map(order => order.direction)

    return orderBy(models, fields, directions)
  }

  /**
   * Filter the given collection by the registered limit and offset values.
   */
  protected filterLimit(models: Collection<M>): Collection<M> {
    return this.take !== null
      ? models.slice(this.skip, this.skip + this.take)
      : models.slice(this.skip)
  }

  /**
   * Eager load relations on the model.
   */
  load(models: Collection<M>): void {
    this.eagerLoadRelations(models)
  }

  /**
   * Eager load the relationships for the models.
   */
  protected eagerLoadRelations(models: Collection<M>): void {
    for (const name in this.eagerLoad)
      this.eagerLoadRelation(models, name, this.eagerLoad[name])
  }

  /**
   * Eagerly load the relationship on a set of models.
   */
  protected eagerLoadRelation(
    models: Collection<M>,
    name: string,
    constraints: EagerLoadConstraint,
  ): void {
    // First we will "back up" the existing where conditions on the query so we can
    // add our eager constraints. Then we will merge the wheres that were on the
    // query back to it in order that any where conditions might be specified.
    const relation = this.getRelation(name)

    const query = this.newQueryForRelation(relation)

    relation.addEagerConstraints(query, models)

    constraints(query)

    // Once we have the results, we just match those back up to their parent models
    // using the relationship instance. Then we just return the finished arrays
    // of models which have been eagerly hydrated and are readied for return.
    relation.match(name, models, query)
  }

  /**
   * Get the relation instance for the given relation name.
   */
  protected getRelation(name: string): Relation {
    return this.model.$getRelation(name)
  }

  /*
   * Retrieves the models from the store by following the given
   * normalized schema.
   */
  revive(schema: Element[]): Collection<M>
  revive(schema: Element): Item<M>
  revive(schema: Element | Element[]): Item<M> | Collection<M> {
    return isArray(schema) ? this.reviveMany(schema) : this.reviveOne(schema)
  }

  /**
   * Revive single model from the given schema.
   */
  reviveOne(schema: Element): Item<M> {
    const id = this.model.$getIndexId(schema)

    const item = this.commit('get')[id] ?? null

    if (!item)
      return null

    const model = this.hydrate(item)

    this.reviveRelations(model, schema)

    return model
  }

  /**
   * Revive multiple models from the given schema.
   */
  reviveMany(schema: Element[]): Collection<M> {
    return schema.reduce<Collection<M>>((collection, item) => {
      const model = this.reviveOne(item)

      model && collection.push(model)

      return collection
    }, [])
  }

  /**
   * Revive relations for the given schema and entity.
   */
  protected reviveRelations(model: M, schema: Element) {
    const fields = this.model.$fields()

    for (const key in schema) {
      const attr = fields[key]

      if (!(attr instanceof Relation))
        continue

      const relatedSchema = schema[key]

      if (!relatedSchema)
        return

      // Inverse polymorphic relations have the same parent and child model
      // so we need to query using the type stored in the parent model.
      if (attr instanceof MorphTo) {
        const relatedType = model[attr.getType()]

        // @ts-expect-error Don't know why its necessary yet
        model[key] = this.newQuery(relatedType).reviveOne(relatedSchema)

        continue
      }

      // @ts-expect-error Don't know why its necessary yet
      model[key] = isArray(relatedSchema)
        ? this.newQueryForRelation(attr).reviveMany(relatedSchema)
        : this.newQueryForRelation(attr).reviveOne(relatedSchema)
    }
  }

  /**
   * Create and persist model with default values.
   */
  new(): M {
    const model = this.hydrate({})

    this.commit('insert', this.compile(model))

    return model
  }

  /**
   * Save the given records to the store with data normalization.
   */
  save(records: Element[]): M[]
  save(record: Element): M
  save(records: Element | Element[]): M | M[] {
    const [data, entities] = this.newInterpreter().process(records)

    for (const entity in entities) {
      const query = this.newQuery(entity)
      const elements = entities[entity]

      query.saveElements(elements)
    }

    return this.revive(data) as M | M[]
  }

  /**
   * Save the given elements to the store.
   */
  saveElements(elements: Elements): void {
    const newData = {} as Elements
    const currentData = this.data()
    const afterSavingHooks = []

    for (const id in elements) {
      const record = elements[id]
      const existing = currentData[id]
      const model = existing
        ? this.hydrate({ ...existing, ...record }, { mutator: 'set' })
        : this.hydrate(record, { mutator: 'set' })

      const isSaving = model.$self().saving(model)
      const isUpdatingOrCreating = existing ? model.$self().updating(model) : model.$self().creating(model)
      if (isSaving === false || isUpdatingOrCreating === false)
        continue

      afterSavingHooks.push(() => model.$self().saved(model))
      afterSavingHooks.push(() => existing ? model.$self().updated(model) : model.$self().created(model))
      newData[id] = model.$getAttributes()
    }
    if (Object.keys(newData).length > 0) {
      this.commit('save', newData)
      afterSavingHooks.forEach(hook => hook())
    }
  }

  /**
   * Insert the given record to the store.
   */
  insert(records: Element[]): Collection<M>
  insert(record: Element): M
  insert(records: Element | Element[]): M | Collection<M> {
    const models = this.hydrate(records)

    this.commit('insert', this.compile(models))

    return models
  }

  /**
   * Insert the given records to the store by replacing any existing records.
   */
  fresh(records: Element[]): Collection<M>
  fresh(record: Element): M
  fresh(records: Element | Element[]): M | Collection<M> {
    const models = this.hydrate(records)

    this.commit('fresh', this.compile(models))

    return models
  }

  /**
   * Update the reocrd matching the query chain.
   */
  update(record: Element): Collection<M> {
    const models = this.get()

    if (isEmpty(models))
      return []

    const newModels = models.map((model) => {
      return this.hydrate({ ...model.$getAttributes(), ...record })
    })

    this.commit('update', this.compile(newModels))

    return newModels
  }

  /**
   * Destroy the models for the given id.
   */
  destroy(ids: (string | number)[]): Collection<M>
  destroy(id: string | number): Item<M>
  destroy(ids: any): any {
    assert(!this.model.$hasCompositeKey(), [
      'You can\'t use the `destroy` method on a model with a composite key.',
      'Please use `delete` method instead.',
    ])

    return isArray(ids) ? this.destroyMany(ids) : this.destroyOne(ids)
  }

  protected destroyOne(id: string | number): Item<M> {
    const model = this.find(id)

    if (!model)
      return null

    const [afterHooks, removeIds] = this.dispatchDeleteHooks(model)
    if (!removeIds.includes(model.$getIndexId())) {
      this.commit('destroy', [model.$getIndexId()])
      afterHooks.forEach(hook => hook())
    }

    return model
  }

  protected destroyMany(ids: (string | number)[]): Collection<M> {
    const models = this.find(ids)

    if (isEmpty(models))
      return []

    const [afterHooks, removeIds] = this.dispatchDeleteHooks(models)
    const checkedIds = this.getIndexIdsFromCollection(models).filter(id => !removeIds.includes(id))

    if (isEmpty(checkedIds))
      return []

    this.commit('destroy', checkedIds)
    afterHooks.forEach(hook => hook())

    return models
  }

  /**
   * Delete records resolved by the query chain.
   */
  delete(): M[] {
    const models = this.get()

    if (isEmpty(models))
      return []

    const [afterHooks, removeIds] = this.dispatchDeleteHooks(models)
    const ids = this.getIndexIdsFromCollection(models).filter(id => !removeIds.includes(id))

    if (isEmpty(ids))
      return []

    this.commit('delete', ids)
    afterHooks.forEach(hook => hook())

    return models
  }

  /**
   * Delete all records in the store.
   */
  flush(): Collection<M> {
    const models = this.get()

    this.commit('flush')

    return models
  }

  protected dispatchDeleteHooks(models: M | Collection<M>): [{ (): void }[], string[]] {
    const afterHooks: { (): void }[] = []
    const notDeletableIds: string[] = []
    models = isArray(models) ? models : [models]
    models.forEach((currentModel) => {
      const isDeleting = currentModel.$self().deleting(currentModel)
      if (isDeleting === false)
        notDeletableIds.push(currentModel.$getIndexId())
      else
        afterHooks.push(() => currentModel.$self().deleted(currentModel))
    })

    return [afterHooks, notDeletableIds]
  }

  /**
   * Get an array of index ids from the given collection.
   */
  protected getIndexIdsFromCollection(models: Collection<M>): string[] {
    return models.map(model => model.$getIndexId())
  }

  /**
   * Instantiate new models with the given record.
   */
  protected hydrate(record: Element, options?: ModelOptions): M
  protected hydrate(records: Element[], options?: ModelOptions): Collection<M>
  protected hydrate(records: Element | Element[], options?: ModelOptions): M | Collection<M> {
    return isArray(records)
      ? records.map(record => this.hydrate(record), options)
      : this.model.$newInstance(records, { relations: false, ...(options || {}) })
  }

  /**
   * Convert given models into an indexed object that is ready to be saved to
   * the store.
   */
  protected compile(models: M | Collection<M>): Elements {
    const collection = isArray(models) ? models : [models]

    return collection.reduce<Elements>((records, model) => {
      records[model.$getIndexId()] = model.$getAttributes()
      return records
    }, {})
  }
}
