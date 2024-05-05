import type { Pinia } from 'pinia'
import { acceptHMRUpdate } from 'pinia'
import {
  compareWithOperator,
  generateKey,
  groupBy,
  isArray,
  isEmpty,
  isFunction,
  orderBy,
} from '../support/Utils'
import type { Collection, Element, Elements, GroupedCollection, Item, NormalizedData } from '../data/Data'
import type { Database } from '../database/Database'
import { Relation } from '../model/attributes/relations/Relation'
import { MorphTo } from '../model/attributes/relations/MorphTo'
import type { Model, ModelFields, ModelOptions } from '../model/Model'
import { Interpreter } from '../interpreter/Interpreter'
import { useDataStore } from '../composables/useDataStore'
import type { DataStore } from '../composables/useDataStore'
import type { WeakCache } from '../cache/WeakCache'
import type { CacheConfig } from '../types'
import type { HasMany } from '../model/attributes/relations/HasMany'
import type { MorphMany } from '../model/attributes/relations/MorphMany'
import type { Type } from '../model/attributes/types/Type'
import { BelongsToMany } from '../model/attributes/relations/BelongsToMany'
import type {
  EagerLoad,
  EagerLoadConstraint,
  Group,
  GroupByFields,
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
   * The orderings for the query.
   */
  protected groups: Group[] = []

  /**
   * The maximum number of records to return.
   */
  protected take: number | null = null

  /**
   * The number of records to skip.
   */
  protected skip = 0

  /**
   * Fields that should be visible.
   */
  protected visible = ['*']

  /**
   * Fields that should be hidden.
   */
  protected hidden: string[] = []

  /**
   * The cache object.
   */
  protected cache?: WeakCache<string, Collection<M> | GroupedCollection<M>> | undefined

  /**
   * The relationships that should be eager loaded.
   */
  protected eagerLoad: EagerLoad = {}

  /**
   * The pinia store.
   */
  protected pinia?: Pinia

  protected fromCache = false

  protected cacheConfig: CacheConfig = {}

  protected getNewHydrated = false

  /**
   * Hydrated models. They are stored to prevent rerendering of child components.
   */
  hydratedDataCache: Map<string, M>

  /**
   * Create a new query instance.
   */
  constructor (database: Database, model: M, cache: WeakCache<string, Collection<M> | GroupedCollection<M>> | undefined, hydratedData: Map<string, M>, pinia?: Pinia) {
    this.database = database
    this.model = model
    this.pinia = pinia
    this.cache = cache
    this.hydratedDataCache = hydratedData
    this.getNewHydrated = false
  }

  /**
   * Create a new query instance for the given model.
   */
  newQuery (model: string): Query {
    this.getNewHydrated = true
    return new Query(this.database, this.database.getModel(model), this.cache, this.hydratedDataCache, this.pinia)
  }

  /**
   * Create a new query instance with constraints for the given model.
   */
  newQueryWithConstraints (model: string): Query {
    const newQuery = new Query(this.database, this.database.getModel(model), this.cache, this.hydratedDataCache, this.pinia)

    // Copy query constraints
    newQuery.eagerLoad = { ...this.eagerLoad }
    newQuery.wheres = [...this.wheres]
    newQuery.orders = [...this.orders]
    newQuery.take = this.take
    newQuery.skip = this.skip
    newQuery.fromCache = this.fromCache
    newQuery.cacheConfig = this.cacheConfig

    return newQuery
  }

  /**
   * Create a new query instance from the given relation.
   */
  newQueryForRelation (relation: Relation): Query {
    return new Query(this.database, relation.getRelated(), this.cache, new Map<string, M>(), this.pinia)
  }

  /**
   * Create a new interpreter instance.
   */
  protected newInterpreter (): Interpreter {
    return new Interpreter(this.model)
  }

  /**
   * Commit a store action and get the data
   */
  protected commit (name: string, payload?: any) {
    const store = useDataStore(this.model.$storeName(), this.model.$piniaOptions(), this)(this.pinia)

    if (import.meta.hot) {
      import.meta.hot.accept(acceptHMRUpdate(store as DataStore, import.meta.hot))
    }

    if (name && typeof store[name] === 'function') { store[name](payload, false) }

    if (this.cache && ['get', 'all', 'insert', 'flush', 'delete', 'update', 'destroy'].includes(name)) { this.cache.clear() }

    return store.$state.data
  }

  /**
   * Make meta field visible
   */
  withMeta (): this {
    return this.makeVisible(['_meta'])
  }

  /**
   * Make hidden fields visible
   */
  makeVisible (fields: string[]): this {
    this.visible = fields
    this.getNewHydrated = true

    return this
  }

  /**
   * Make visible fields hidden
   */
  makeHidden (fields: string[]): this {
    this.hidden = fields
    this.getNewHydrated = true

    return this
  }

  /**
   * Add a basic where clause to the query.
   */
  where (
    field: WherePrimaryClosure | string,
    value?: WhereSecondaryClosure | any,
  ): this {
    this.wheres.push({ field, value, boolean: 'and' })

    return this
  }

  /**
   * Add a "where in" clause to the query.
   */
  whereIn (field: string, values: any[] | Set<any>): this {
    if (values instanceof Set) { values = Array.from(values) }
    return this.where(field, values)
  }

  /**
   * Add a "where not in" clause to the query.
   */
  whereNotIn (field: string, values: any[] | Set<any>): this {
    if (values instanceof Set) { values = Array.from(values) }
    return this.where(query => !values.includes(query[field]))
  }

  /**
   * Add a "where not in" clause to the query.
   */
  orWhereIn (field: string, values: any[] | Set<any>): this {
    if (values instanceof Set) { values = Array.from(values) }
    return this.orWhere(field, values)
  }

  /**
   * Add a "where not in" clause to the query.
   */
  orWhereNotIn (field: string, values: any[] | Set<any>): this {
    if (values instanceof Set) { values = Array.from(values) }
    return this.orWhere(query => !values.includes(query[field]))
  }

  /**
   * Add a where clause on the primary key to the query.
   */
  whereId (ids: string | number | (string | number)[]): this {
    return this.where(this.model.$getKeyName() as any, ids)
  }

  /**
   * Add an "or where" clause to the query.
   */
  orWhere (
    field: WherePrimaryClosure | string,
    value?: WhereSecondaryClosure | any,
  ): this {
    this.wheres.push({ field, value, boolean: 'or' })

    return this
  }

  /**
   * Add a "whereNULL" clause to the query.
   */
  whereNull (field: string): this {
    return this.where(field, null)
  }

  /**
   * Add a "whereNotNULL" clause to the query.
   */
  whereNotNull (field: string): this {
    return this.where(query => query[field] != null)
  }

  /**
   * Add a "where has" clause to the query.
   */
  whereHas (relation: string, callback: EagerLoadConstraint = () => {}, operator?: string | number, count?: number): this {
    return this.where(this.getFieldWhereForRelations(relation, callback, operator, count))
  }

  /**
   * Add an "or where has" clause to the query.
   */
  orWhereHas (relation: string, callback: EagerLoadConstraint = () => {}, operator?: string | number, count?: number): this {
    return this.orWhere(this.getFieldWhereForRelations(relation, callback, operator, count))
  }

  /**
   * Add a "has" clause to the query.
   */
  has (relation: string, operator?: string | number, count?: number): this {
    return this.where(this.getFieldWhereForRelations(relation, () => {}, operator, count))
  }

  /**
   * Add an "or has" clause to the query.
   */
  orHas (relation: string, operator?: string | number, count?: number): this {
    return this.orWhere(this.getFieldWhereForRelations(relation, () => {}, operator, count))
  }

  /**
   * Add a "doesn't have" clause to the query.
   */
  doesntHave (relation: string): this {
    return this.where(this.getFieldWhereForRelations(relation, () => {}, '=', 0))
  }

  /**
   * Add a "doesn't have" clause to the query.
   */
  orDoesntHave (relation: string): this {
    return this.orWhere(this.getFieldWhereForRelations(relation, () => {}, '=', 0))
  }

  /**
   * Add a "where doesn't have" clause to the query.
   */
  whereDoesntHave (relation: string, callback: EagerLoadConstraint = () => {}): this {
    return this.where(this.getFieldWhereForRelations(relation, callback, '=', 0))
  }

  /**
   * Add an "or where doesn't have" clause to the query.
   */
  orWhereDoesntHave (relation: string, callback: EagerLoadConstraint = () => {}): this {
    return this.orWhere(this.getFieldWhereForRelations(relation, callback, '=', 0))
  }

  /**
   * Add a "group by" clause to the query.
   */
  groupBy (...fields: GroupByFields): this {
    fields.forEach((field) => {
      this.groups.push({ field })
    })

    return this
  }

  /**
   * Add an "order by" clause to the query.
   */
  orderBy (field: OrderBy, direction: OrderDirection = 'asc'): this {
    this.orders.push({ field, direction })

    return this
  }

  /**
   * Set the "limit" value of the query.
   */
  limit (value: number): this {
    this.take = value

    return this
  }

  /**
   * Set the "offset" value of the query.
   */
  offset (value: number): this {
    this.skip = value

    return this
  }

  /**
   * Set the relationships that should be eager loaded.
   */
  with (name: string, callback: EagerLoadConstraint = () => {}): this {
    this.getNewHydrated = true
    this.eagerLoad[name] = callback

    return this
  }

  /**
   * Set to eager load all top-level relationships. Constraint is set for all relationships.
   */
  withAll (callback: EagerLoadConstraint = () => {}): this {
    let fields: ModelFields = this.model.$fields()
    const typeModels = Object.values(this.model.$types())
    typeModels.forEach((typeModel) => {
      fields = { ...fields, ...typeModel.fields() }
    })

    for (const name in fields) { fields[name] instanceof Relation && this.with(name, callback) }

    return this
  }

  /**
   * Set to eager load all relationships recursively.
   */
  withAllRecursive (depth = 3): this {
    return this.withAll((query) => {
      depth > 0 && query.withAllRecursive(depth - 1)
    })
  }

  /**
   * Define to use the cache for a query
   */
  useCache (key?: string, params?: Record<string, any>): this {
    this.fromCache = true
    this.cacheConfig = {
      key,
      params,
    }

    return this
  }

  /**
   * Get where closure for relations
   */
  protected getFieldWhereForRelations (relation: string, callback: EagerLoadConstraint = () => {}, operator?: string | number, count?: number): WherePrimaryClosure {
    const modelIdsByRelation = this.newQuery(this.model.$entity()).with(relation, callback).get(false)
      .filter(model => compareWithOperator(
        isArray(model[relation]) ? model[relation].length : model[relation] === null ? 0 : 1,
        typeof operator === 'number' ? operator : count ?? 1,
        (typeof operator === 'number' || count === undefined) ? '>=' : operator,
      ))
      .map(model => model.$getIndexId())

    return model => modelIdsByRelation.includes(model.$getIndexId())
  }

  /**
   * Get all models by id from the store. The difference with the `get` is that this
   * method will not process any query chain.
   */
  protected storeFind (ids: string[] = []): Collection<M> {
    const data = this.commit('all')
    const collection = [] as Collection<M>

    const deduplicatedIds = new Set(ids)

    if (deduplicatedIds.size > 0) {
      deduplicatedIds.forEach((id) => {
        if (data[id]) { collection.push(this.hydrate(data[id], { visible: this.visible, hidden: this.hidden, operation: 'get' })) }
      })
    } else {
      Object.values(data)
        .forEach((value: any) => collection.push(this.hydrate(value, { visible: this.visible, hidden: this.hidden, operation: 'get' })))
    }

    return collection
  }

  /**
   * Get all models from the store. The difference with the `get` is that this
   * method will not process any query chain. It'll always retrieve all models.
   */
  all (): Collection<M> {
    return this.storeFind()
  }

  /**
   * Retrieve models by processing whole query chain.
   */
  get<T extends 'group' | 'collection' = 'collection'>(triggerHook?: boolean): T extends 'group' ? GroupedCollection<M> : Collection<M>
  get (triggerHook = true): Collection<M> | GroupedCollection<M> {
    if (!this.fromCache || !this.cache) { return this.internalGet(triggerHook) }

    const key = this.cacheConfig.key
      ? this.cacheConfig.key + JSON.stringify(this.cacheConfig.params)
      : generateKey(this.model.$entity(), {
        where: this.wheres,
        groups: this.groups,
        orders: this.orders,
        eagerLoads: this.eagerLoad,
        skip: this.skip,
        take: this.take,
        hidden: this.hidden,
        visible: this.visible,
      })
    const result = this.cache.get(key)

    if (result) { return result }

    const queryResult = this.internalGet(triggerHook)
    this.cache.set(key, queryResult)
    return queryResult
  }

  private internalGet (triggerHook: boolean): Collection<M> | GroupedCollection<M> {
    if (this.model.$entity() !== this.model.$baseEntity()) { this.where(this.model.$typeKey(), this.model.$fields()[this.model.$typeKey()].make()) }

    let models = this.select()

    if (!this.orders) {
      models = this.filterLimit(models)
    }

    if (!isEmpty(models)) { this.eagerLoadRelations(models) }

    if (this.orders) {
      models = this.filterOrder(models)
      models = this.filterLimit(models)
    }

    if (triggerHook) { models.forEach(model => model.$self().retrieved(model)) }

    if (this.groups.length > 0) { return this.filterGroup(models) }

    return models
  }

  /**
   * Execute the query and get the first result.
   */
  first (): Item<M> {
    return this.limit(1).get()[0] ?? null
  }

  /**
   * Find a model by its primary key.
   */
  find (id: string | number): Item<M>
  find (ids: (string | number)[]): Collection<M>
  find (ids: any): any {
    return this.whereId(ids)[isArray(ids) ? 'get' : 'first']()
  }

  /**
   * Retrieve models by processing all filters set to the query chain.
   */

  select (): Collection<M> {
    let ids: string[] = []
    // store the original wheres so multiple selects don't alter the result
    const originalWheres = this.wheres
    const whereIdsIndex = this.wheres.findIndex(where => where.field === this.model.$getKeyName())
    if (whereIdsIndex > -1) {
      const whereIds = this.wheres[whereIdsIndex].value
      ids = ((isFunction(whereIds) ? [] : isArray(whereIds) ? whereIds : [whereIds]) || []).map(String) || []
      if (ids.length > 0) { this.wheres = [...this.wheres.slice(0, whereIdsIndex), ...this.wheres.slice(whereIdsIndex + 1)] }
    }

    let models = this.storeFind(ids)

    models = this.filterWhere(models)

    this.wheres = originalWheres

    return models
  }

  /**
   * Filter the given collection by the registered where clause.
   */
  protected filterWhere (models: Collection<M>): Collection<M> {
    if (isEmpty(this.wheres)) { return models }

    const comparator = this.getWhereComparator()

    return models.filter(model => comparator(model))
  }

  /**
   * Get comparator for the where clause.
   */
  protected getWhereComparator (): (model: any) => boolean {
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
  protected whereComparator (model: M, where: Where): boolean {
    if (isFunction(where.field)) { return where.field(model) }

    if (isArray(where.value)) { return where.value.includes(model[where.field]) }

    if (isFunction(where.value)) { return where.value(model[where.field]) }

    return model[where.field] === where.value
  }

  /**
   * Filter the given collection by the registered order conditions.
   */
  protected filterOrder (models: Collection<M>): Collection<M> {
    if (this.orders.length === 0) { return models }

    const fields = this.orders.map(order => order.field)
    const directions = this.orders.map(order => order.direction)

    return orderBy(models, fields, directions)
  }

  /**
   * Filter the given collection by the registered group conditions.
   */
  protected filterGroup (models: Collection<M>): Record<string, Collection<M>> {
    const grouped: Record<string, Collection<M>> = {}
    const fields = this.groups.map(group => group.field)

    models.forEach((model) => {
      const key = fields.length === 1 ? model[fields[0]] : `[${fields.map(field => model[field]).toString()}]`
      grouped[key] = (grouped[key] || []).concat(model)
    })

    return grouped
  }

  /**
   * Filter the given collection by the registered limit and offset values.
   */
  protected filterLimit (models: Collection<M>): Collection<M> {
    return this.take !== null
      ? models.slice(this.skip, this.skip + this.take)
      : models.slice(this.skip)
  }

  /**
   * Eager load relations on the model.
   */
  load (models: Collection<M>): void {
    this.eagerLoadRelations(models)
  }

  /**
   * Eager load the relationships for the models.
   */
  protected eagerLoadRelations (models: Collection<M>): void {
    for (const name in this.eagerLoad) { this.eagerLoadRelation(models, name, this.eagerLoad[name]) }
  }

  /**
   * Eagerly load the relationship on a set of models.
   */
  protected eagerLoadRelation (
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
  protected getRelation (name: string): Relation {
    return this.model.$getRelation(name)
  }

  /*
   * Retrieves the models from the store by following the given
   * normalized schema.
   */
  revive (schema: Element[]): Collection<M>
  revive (schema: Element): Item<M>
  revive (schema: Element | Element[]): Item<M> | Collection<M> {
    return isArray(schema) ? this.reviveMany(schema) : this.reviveOne(schema)
  }

  /**
   * Revive single model from the given schema.
   */
  reviveOne (schema: Element): Item<M> {
    this.getNewHydrated = false

    const id = this.model.$getIndexId(schema)
    const item = this.commit('get')[id] ?? null

    if (!item) { return null }

    const model = this.hydrate(item, { visible: this.visible, hidden: this.hidden, operation: 'get' })

    this.reviveRelations(model, schema)

    return model
  }

  /**
   * Revive multiple models from the given schema.
   */
  reviveMany (schema: Element[]): Collection<M> {
    return schema.reduce<Collection<M>>((collection, item) => {
      const model = this.reviveOne(item)

      model && collection.push(model)

      return collection
    }, [])
  }

  /**
   * Revive relations for the given schema and entity.
   */
  protected reviveRelations (model: M, schema: Element) {
    const fields = this.model.$fields()

    for (const key in schema) {
      const attr = fields[key]

      if (!(attr instanceof Relation)) { continue }

      const relatedSchema = schema[key]

      if (!relatedSchema) { return }

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
  new (persist = true): M | null {
    let model = this.hydrate({}, { operation: persist ? 'set' : 'get' })
    const isCreating = model.$self().creating(model)
    const isSaving = model.$self().saving(model)
    if (isCreating === false || isSaving === false) { return null }

    if (model.$isDirty()) { model = this.hydrate(model.$getAttributes(), { operation: persist ? 'set' : 'get' }) }

    if (persist) {
      this.hydratedDataCache.set(this.model.$entity() + model.$getKey(undefined, true), this.hydrate(model.$getAttributes(), { operation: 'get' }))
      model.$self().created(model)
      model.$self().saved(model)
      this.commit('insert', this.compile(model))
    }

    return model
  }

  /**
   * Save the given records to the store with data normalization.
   */
  save (records: Element[]): M[]
  save (record: Element): M
  save (records: Element | Element[]): M | M[] {
    let processedData: [Element | Element[], NormalizedData] = this.newInterpreter().process(records)
    const modelTypes = this.model.$types()
    const isChildEntity = this.model.$baseEntity() !== this.model.$entity()

    if (Object.values(modelTypes).length > 0 || isChildEntity) {
      const modelTypesKeys = Object.keys(modelTypes)
      const recordsByTypes: Record<string, Element> = {}
      records = isArray(records) ? records : [records]

      records.forEach((record: Element) => {
        const recordType = (modelTypesKeys.includes(`${record[this.model.$typeKey()]}`) || isChildEntity)
          ? record[this.model.$typeKey()] ?? (this.model.$fields()[this.model.$typeKey()] as Type).value
          : modelTypesKeys[0]
        if (!recordsByTypes[recordType]) { recordsByTypes[recordType] = [] }
        recordsByTypes[recordType].push(record)
      })
      for (const entry in recordsByTypes) {
        const typeModel = modelTypes[entry]
        if (typeModel.entity === this.model.$entity()) { processedData = this.newInterpreter().process(recordsByTypes[entry]) } else { this.newQueryWithConstraints(typeModel.entity).save(recordsByTypes[entry]) }
      }
    }

    const [data, entities] = processedData

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
  saveElements (elements: Elements): void {
    const newData = {} as Elements
    const currentData = this.commit('all')
    const afterSavingHooks = []

    for (const id in elements) {
      const record = elements[id]
      const existing = currentData[id]
      let model = existing
        ? this.hydrate({ ...existing, ...record }, { operation: 'set', action: 'update' })
        : this.hydrate(record, { operation: 'set', action: 'save' })

      const isSaving = model.$self().saving(model, existing ?? {})
      const isUpdatingOrCreating = existing ? model.$self().updating(model, existing ?? {}) : model.$self().creating(model, existing ?? {})
      if (isSaving === false || isUpdatingOrCreating === false) { continue }

      if (model.$isDirty()) { model = this.hydrate(model.$getAttributes(), { operation: 'set', action: existing ? 'update' : 'save' }) }

      afterSavingHooks.push(() => model.$self().saved(model, existing ?? {}))
      afterSavingHooks.push(() => existing ? model.$self().updated(model, existing ?? {}) : model.$self().created(model, existing ?? {}))
      newData[id] = model.$getAttributes()
      if (Object.values(model.$types()).length > 0 && !newData[id][model.$typeKey()]) { newData[id][model.$typeKey()] = record[model.$typeKey()] }
    }
    if (Object.keys(newData).length > 0) {
      this.commit('save', newData)
      afterSavingHooks.forEach(hook => hook())
    }
  }

  /**
   * Insert the given record to the store.
   */
  insert (records: Element[]): Collection<M>
  insert (record: Element): M
  insert (records: Element | Element[]): M | Collection<M> {
    const models = this.hydrate(records, { operation: 'set', action: 'insert' })

    this.commit('insert', this.compile(models))

    return models
  }

  /**
   * Insert the given records to the store by replacing any existing records.
   */
  fresh (records: Element[]): Collection<M>
  fresh (record: Element): M
  fresh (records: Element | Element[]): M | Collection<M> {
    this.hydratedDataCache.clear()
    const models = this.hydrate(records, { action: 'update' })

    this.commit('fresh', this.compile(models))

    return models
  }

  /**
   * Update the reocrd matching the query chain.
   */
  update (record: Element): Collection<M> {
    const models = this.get(false)

    if (isEmpty(models)) { return [] }

    const newModels = models.map((model) => {
      const newModel = this.hydrate({ ...model.$getAttributes(), ...record }, { action: 'update', operation: 'set' })
      if (model.$self().updating(model, record) === false) { return model }
      newModel.$self().updated(newModel)
      return newModel
    })

    this.commit('update', this.compile(newModels))

    return newModels
  }

  /**
   * Destroy the models for the given id.
   */
  destroy (ids: (string | number)[]): Collection<M>
  destroy (id: string | number): Item<M>
  destroy (ids: any): any {
    return isArray(ids) ? this.destroyMany(ids) : this.destroyOne(ids)
  }

  protected destroyOne (id: string | number): Item<M> {
    const model = this.find(id)

    if (!model) { return null }

    const [afterHooks, removeIds] = this.dispatchDeleteHooks(model)
    if (!removeIds.includes(model.$getIndexId())) {
      this.commit('destroy', [model.$getIndexId()])
      afterHooks.forEach(hook => hook())
    }

    return model
  }

  protected destroyMany (ids: (string | number)[]): Collection<M> {
    const models = this.find(ids)

    if (isEmpty(models)) { return [] }

    const [afterHooks, removeIds] = this.dispatchDeleteHooks(models)
    const checkedIds = this.getIndexIdsFromCollection(models).filter(id => !removeIds.includes(id))

    this.commit('destroy', checkedIds)
    afterHooks.forEach(hook => hook())

    return models
  }

  /**
   * Delete records resolved by the query chain.
   */
  delete (): M[] {
    const models = this.get(false)

    if (isEmpty(models)) { return [] }

    const [afterHooks, removeIds] = this.dispatchDeleteHooks(models)
    const ids = this.getIndexIdsFromCollection(models).filter(id => !removeIds.includes(id))

    this.commit('delete', ids)
    afterHooks.forEach(hook => hook())

    return models
  }

  /**
   * Delete all records in the store.
   */
  flush (): Collection<M> {
    this.commit('flush')
    this.hydratedDataCache.clear()
    return this.get(false)
  }

  protected checkAndDeleteRelations (model: M) {
    const fields = model.$fields()
    for (const name in fields) {
      const relation = fields[name] as Relation
      if (fields[name] instanceof Relation && relation.onDeleteMode && model[name]) {
        const models = isArray(model[name]) ? model[name] : [model[name]]
        const relationIds = models.map((relation: M) => {
          return relation.$getKey(undefined, true)
        })
        const record: Record<string, any> = {}

        if (relation instanceof BelongsToMany) {
          this.newQuery(relation.pivot.$entity()).where(relation.foreignPivotKey, model[model.$getLocalKey()]).delete()
          continue
        }

        switch (relation.onDeleteMode) {
          case 'cascade': {
            this.newQueryForRelation(relation).destroy(relationIds)
            break
          }
          case 'set null': {
            if ((relation as HasMany).foreignKey) { record[(relation as HasMany).foreignKey as string] = null }

            if ((relation as MorphMany).morphId) {
              record[(relation as MorphMany).morphId] = null
              record[(relation as MorphMany).morphType] = null
            }

            this.newQueryForRelation(relation).whereId(relationIds).update(record)
            break
          }
        }
      }
    }
  }

  protected dispatchDeleteHooks (models: M | Collection<M>): [{ (): void }[], string[]] {
    const afterHooks: { (): void }[] = []
    const notDeletableIds: string[] = []
    models = isArray(models) ? models : [models]

    // This is needed to be able to cascade delete relations.
    this.withAll().load(models)

    models.forEach((currentModel) => {
      const isDeleting = currentModel.$self().deleting(currentModel)

      if (isDeleting === false) { notDeletableIds.push(currentModel.$getIndexId()) } else {
        this.hydratedDataCache.delete('set' + this.model.$entity() + currentModel.$getIndexId())
        this.hydratedDataCache.delete('get' + this.model.$entity() + currentModel.$getIndexId())
        afterHooks.push(() => currentModel.$self().deleted(currentModel))
        this.checkAndDeleteRelations(currentModel)
      }
    })

    return [afterHooks, notDeletableIds]
  }

  /**
   * Get an array of index ids from the given collection.
   */
  protected getIndexIdsFromCollection (models: Collection<M>): string[] {
    return models.map(model => model.$getIndexId())
  }

  /**
   * Instantiate new models with the given record.
   */
  protected hydrate (record: Element, options?: ModelOptions): M
  protected hydrate (records: Element[], options?: ModelOptions): Collection<M>
  protected hydrate (records: Element | Element[], options?: ModelOptions): M | Collection<M> {
    return isArray(records)
      ? records.map(record => this.hydrate(record, options))
      : this.getHydratedModel(records, { relations: false, ...(options || {}) })
  }

  /**
   * Convert given models into an indexed object that is ready to be saved to
   * the store.
   */
  protected compile (models: M | Collection<M>): Elements {
    const collection = isArray(models) ? models : [models]

    return collection.reduce<Elements>((records, model) => {
      records[model.$getIndexId()] = model.$getAttributes()
      return records
    }, {})
  }

  /**
   * Save already existing models and return them if they exist to prevent
   * an update event trigger in vue if the object is used.
   */
  protected getHydratedModel (record: Element, options?: ModelOptions): M {
    const id = this.model.$entity() + this.model.$getKey(record, true)
    const operationId = options?.operation + id
    let savedHydratedModel = this.hydratedDataCache.get(operationId)

    if (options?.action === 'update') {
      this.hydratedDataCache.delete('get' + id)
      savedHydratedModel = undefined
    }

    if (
      !this.getNewHydrated &&
      savedHydratedModel
    ) { return savedHydratedModel }

    const modelByType = this.model.$types()[record[this.model.$typeKey()]]
    const getNewInsance = (newOptions?: ModelOptions) => (modelByType ? modelByType.newRawInstance() as M : this.model)
      .$newInstance(record, { relations: false, ...(options || {}), ...newOptions })
    const hydratedModel = getNewInsance()

    if (isEmpty(this.eagerLoad) && options?.operation !== 'set') { this.hydratedDataCache.set(operationId, hydratedModel) }

    return hydratedModel
  }
}
