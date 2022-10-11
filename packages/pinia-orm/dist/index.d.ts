import { M as Model, C as Constructor, D as Database, W as WeakCache, a as DataStoreState, E as Elements, Q as Query, b as WherePrimaryClosure, c as WhereSecondaryClosure, d as EagerLoadConstraint, G as GroupByFields, O as OrderBy, e as OrderDirection, f as Collection, I as Item, g as Element, h as DataStore } from './Data-95444d16.js';
export { A as AfterHook, w as Attribute, B as BeforeHook, k as CacheConfigOptions, y as CastAttribute, x as Casts, f as Collection, h as DataStore, a as DataStoreState, D as Database, R as EagerLoad, d as EagerLoadConstraint, g as Element, E as Elements, F as FilledInstallOptions, L as Group, P as GroupBy, G as GroupByFields, i as GroupedCollection, v as InheritanceTypes, l as InstallOptions, z as Interpreter, I as Item, t as MetaValues, M as Model, j as ModelConfigOptions, o as ModelFields, s as ModelOptions, q as ModelRegistries, r as ModelRegistry, p as ModelSchemas, N as NormalizedData, K as Order, O as OrderBy, e as OrderDirection, Q as Query, n as Schema, S as Schemas, T as Type, H as Where, J as WhereGroup, b as WherePrimaryClosure, c as WhereSecondaryClosure, m as createORM, u as useDataStore } from './Data-95444d16.js';
import * as pinia from 'pinia';
import { Pinia } from 'pinia';
import '@/composables';
import '@pinia-orm/normalizr';

interface ModelConstructor<M extends Model> extends Constructor<M> {
    newRawInstance(): M;
}

declare class Repository<M extends Model = Model> {
    /**
     * A special flag to indicate if this is the repository class or not. It's
     * used when retrieving repository instance from `store.$repo()` method to
     * determine whether the passed in class is either a repository or a model.
     */
    static _isRepository: boolean;
    /**
     * The database instance.
     */
    database: Database;
    /**
     * The model instance.
     */
    protected model: M;
    /**
     * The pinia instance
     */
    protected pinia?: Pinia;
    /**
     * The cache instance
     */
    queryCache?: WeakCache<string, M[]>;
    /**
     * The model object to be used for the custom repository.
     */
    use?: typeof Model;
    /**
     * Create a new Repository instance.
     */
    constructor(database: Database, pinia?: Pinia);
    /**
     * Initialize the repository by setting the model instance.
     */
    initialize(model?: ModelConstructor<M>): this;
    /**
     * Get the model instance. If the model is not registered to the repository,
     * it will throw an error. It happens when users use a custom repository
     * without setting `use` property.
     */
    getModel(): M;
    /**
     * Returns the pinia store used with this model
     */
    piniaStore(): pinia.Store<string, DataStoreState<M>, {}, {
        save(this: any, records: Elements): void;
        insert(this: any, records: Elements): void;
        update(this: any, records: Elements): void;
        fresh(this: any, records: Elements): void;
        destroy(this: any, ids: string[]): void;
        delete(this: any, ids: string[]): void;
        flush(this: any): void;
    }>;
    /**
     * Create a new repository with the given model.
     */
    repo<M extends Model>(model: Constructor<M>): Repository<M>;
    repo<R extends Repository<any>>(repository: Constructor<R>): R;
    /**
     * Create a new Query instance.
     */
    query(): Query<M>;
    /**
     * Create a new Query instance.
     */
    cache(): WeakCache<string, M[]> | undefined;
    /**
     * Add a basic where clause to the query.
     */
    where(field: WherePrimaryClosure | string, value?: WhereSecondaryClosure | any): Query<M>;
    /**
     * Add an "or where" clause to the query.
     */
    orWhere(field: WherePrimaryClosure | string, value?: WhereSecondaryClosure | any): Query<M>;
    /**
     * Add a "where has" clause to the query.
     */
    whereHas(relation: string, callback?: EagerLoadConstraint, operator?: string | number, count?: number): Query<M>;
    /**
     * Add an "or where has" clause to the query.
     */
    orWhereHas(relation: string, callback?: EagerLoadConstraint, operator?: string | number, count?: number): Query<M>;
    /**
     * Add a "has" clause to the query.
     */
    has(relation: string, operator?: string | number, count?: number): Query<M>;
    /**
     * Add an "or has" clause to the query.
     */
    orHas(relation: string, operator?: string | number, count?: number): Query<M>;
    /**
     * Add a "doesn't have" clause to the query.
     */
    doesntHave(relation: string): Query<M>;
    /**
     * Add a "doesn't have" clause to the query.
     */
    orDoesntHave(relation: string): Query<M>;
    /**
     * Add a "where doesn't have" clause to the query.
     */
    whereDoesntHave(relation: string, callback?: EagerLoadConstraint): Query<M>;
    /**
     * Add an "or where doesn't have" clause to the query.
     */
    orWhereDoesntHave(relation: string, callback?: EagerLoadConstraint): Query<M>;
    /**
     * Make meta field visible
     */
    withMeta(): Query<M>;
    /**
     * Make hidden fields visible
     */
    makeVisible(fields: string[]): Query<M>;
    /**
     * Make visible fields hidden
     */
    makeHidden(fields: string[]): Query<M>;
    /**
     * Add a "group by" clause to the query.
     */
    groupBy(...fields: GroupByFields): Query<M>;
    /**
     * Add an "order by" clause to the query.
     */
    orderBy(field: OrderBy, direction?: OrderDirection): Query<M>;
    /**
     * Set the "limit" value of the query.
     */
    limit(value: number): Query<M>;
    /**
     * Set the "offset" value of the query.
     */
    offset(value: number): Query<M>;
    /**
     * Set the relationships that should be eager loaded.
     */
    with(name: string, callback?: EagerLoadConstraint): Query<M>;
    /**
     * Set to eager load all top-level relationships. Constraint is set for all relationships.
     */
    withAll(callback?: EagerLoadConstraint): Query<M>;
    /**
     * Set to eager load all top-level relationships. Constraint is set for all relationships.
     */
    withAllRecursive(depth?: number): Query<M>;
    /**
     * Define to use the cache for a query
     */
    useCache(key?: string, params?: Record<string, any>): Query<M>;
    /**
     * Get all models from the store.
     */
    all(): Collection<M>;
    /**
     * Find the model with the given id.
     */
    find(id: string | number): Item<M>;
    find(ids: (string | number)[]): Collection<M>;
    /**
     * Retrieves the models from the store by following the given
     * normalized schema.
     */
    revive(schema: Element[]): Collection<M>;
    revive(schema: Element): Item<M>;
    /**
     * Create a new model instance. This method will not save the model to the
     * store. It's pretty much the alternative to `new Model()`, but it injects
     * the store instance to support model instance methods in SSR environment.
     */
    make(records: Element[]): M[];
    make(record?: Element): M;
    save(records: Element[]): M[];
    save(record: Element): M;
    /**
     * Create and persist model with default values.
     */
    new(): M;
    /**
     * Insert the given records to the store.
     */
    insert(records: Element[]): Collection<M>;
    insert(record: Element): M;
    /**
     * Insert the given records to the store by replacing any existing records.
     */
    fresh(records: Element[]): Collection<M>;
    fresh(record: Element): M;
    /**
     * Destroy the models for the given id.
     */
    destroy(ids: (string | number)[]): Collection<M>;
    destroy(id: string | number): Item<M>;
    /**
     * Delete all records in the store.
     */
    flush(): M[];
}

declare function useRepo<M extends Model>(model: Constructor<M>, pinia?: Pinia): Repository<M>;
declare function useRepo<R extends Repository>(repository: Constructor<R>, pinia?: Pinia): R;

declare function useStoreActions(): {
    save(this: DataStore, records: Elements): void;
    insert(this: DataStore, records: Elements): void;
    update(this: DataStore, records: Elements): void;
    fresh(this: DataStore, records: Elements): void;
    destroy(this: DataStore, ids: string[]): void;
    /**
     * Commit `delete` change to the store.
     */
    delete(this: DataStore, ids: string[]): void;
    flush(this: DataStore): void;
};

declare type ModelOrRepository<M extends typeof Model, R extends typeof Repository> = M | R;
declare type ModelsOrRepositories<M extends typeof Model = any, R extends typeof Repository = any> = Record<string, ModelOrRepository<M, R>>;
declare type MappedRepositories<MR extends ModelsOrRepositories> = {
    [K in keyof MR]: MR[K] extends typeof Model ? () => Repository<InstanceType<MR[K]>> : () => InstanceType<MR[K]>;
};
/**
 * Map given models or repositories to the Vue Component.
 */
declare function mapRepos<MR extends ModelsOrRepositories>(modelsOrRepositories: MR): MappedRepositories<MR>;

export { MappedRepositories, ModelOrRepository, ModelsOrRepositories, Repository, mapRepos, useRepo, useStoreActions };
