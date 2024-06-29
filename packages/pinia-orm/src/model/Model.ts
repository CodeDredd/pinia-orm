import { assert, equals, isArray, isDate, isNullish, throwError } from '../support/Utils'
import type { Collection, Element, Item } from '../data/Data'
import type { MutatorFunctions, Mutators } from '../types'
import type { ModelConfigOptions } from '../store/Store'
import { config } from '../store/Config'
import type { Attribute } from './attributes/Attribute'
import { Attr } from './attributes/types/Attr'
import { String as Str } from './attributes/types/String'
import { Number as Num } from './attributes/types/Number'
import { Boolean as Bool } from './attributes/types/Boolean'
import { Uid } from './attributes/types/Uid'
import type { deleteModes } from './attributes/relations/Relation'
import { Relation } from './attributes/relations/Relation'
import { HasOne } from './attributes/relations/HasOne'
import { BelongsTo } from './attributes/relations/BelongsTo'
import { BelongsToMany } from './attributes/relations/BelongsToMany'
import { HasMany } from './attributes/relations/HasMany'
import { HasManyBy } from './attributes/relations/HasManyBy'
import { MorphOne } from './attributes/relations/MorphOne'
import { MorphTo } from './attributes/relations/MorphTo'
import { MorphMany } from './attributes/relations/MorphMany'
import type { CastAttribute, Casts } from './casts/CastAttribute'
import type { TypeDefault } from './attributes/types/Type'
import { HasManyThrough } from './attributes/relations/HasManyThrough'
import { MorphToMany } from './attributes/relations/MorphToMany'
import type { UidOptions } from './decorators/Contracts'

export type ModelFields = Record<string, Attribute>
export type ModelSchemas = Record<string, ModelFields>
export type ModelRegistries = Record<string, ModelRegistry>
export type ModelRegistry = Record<string, () => Attribute>
export type PrimaryKey = string | string[]

export interface ModelOptions {
  config?: ModelConfigOptions
  fill?: boolean
  relations?: boolean
  operation?: 'set' | 'get'
  visible?: string[]
  hidden?: string[]
  action?: 'save' | 'update' | 'insert'
}

export interface MetaValues {
  createdAt: number
  updatedAt: number
}

export interface BeforeHook {
  (model: typeof Model & any, record?: Element): void | boolean
}

export interface AfterHook {
  (model: typeof Model & any, record?: Element): void
}

export interface InheritanceTypes {
  [key: string]: typeof Model
}

export type WithKeys<T> = { [P in keyof T]: T[P] extends (Model | null) | Model[] ? P & string : never }[keyof T]
// export type WithKeys<T> = { [P in keyof T]: T[P] extends Model[] ? P : never }[keyof T];

export class Model {
  // [s: keyof ModelFields]: any
  pivot?: any

  declare _meta: undefined | MetaValues
  /**
   * The name of the model.
   */
  static entity: string

  /**
   * The reference to the base entity name if the class extends a base entity.
   */
  static baseEntity: string

  /**
   * The reference to the base namespace if the class extends a base with a different namespace.
   */
  static baseNamespace: string

  /**
   * Define a namespace if you have multiple equal entity names.
   * Resulting in "{namespace}/{entity}"
   */
  static namespace: string

  /**
   * The primary key for the model.
   */
  static primaryKey: string | string[] = 'id'

  /**
   * The meta key for the model.
   */
  static metaKey = '_meta'

  /**
   * Hidden properties
   */
  static hidden: [keyof ModelFields] | string[] = ['_meta']

  /**
   * Visible properties
   */
  static visible: [keyof ModelFields] | string[] = []

  /**
   * The global install options
   */
  static config: ModelConfigOptions & { [key: string]: any }

  /**
   * The type key for the model.
   */
  static typeKey = 'type'

  /**
   * Behaviour for relational fields on delete.
   */
  static fieldsOnDelete: Record<string, any> = {}

  /**
   * Original model data.
   */
  protected static original: Record<string, any> = {}

  /**
   * The schema for the model. It contains the result of the `fields`
   * method or the attributes defined by decorators.
   */
  protected static schemas: ModelSchemas = {}

  /**
   * The registry for the model. It contains predefined model schema generated
   * by the property decorators and gets evaluated, and stored, on the `schema`
   * property when registering models to the database.
   */
  protected static registries: ModelRegistries = {}

  /**
   * The pinia options for the model. It can contain options which will passed
   * to the 'defineStore' function of pinia.
   */
  protected static piniaOptions = {}

  /**
   * The mutators for the model.
   */
  protected static fieldMutators: Mutators = {}

  /**
   * The casts for the model.
   */
  protected static fieldCasts: Record<string, any> = {}

  /**
   * The array of booted models.
   */
  protected static booted: Record<string, boolean> = {}

  /**
   * Create a new model instance.
   */
  constructor (attributes?: Element, options: ModelOptions = { operation: 'set' }) {
    this.$boot()

    const fill = options.fill ?? true

    fill && this.$fill(attributes, options)
  }

  /**
   * Create a new model fields definition.
   */
  static fields (): ModelFields {
    return {}
  }

  static usedNamespace (): string {
    return this.namespace ?? config.model.namespace
  }

  static modelEntity (): string {
    return (this.usedNamespace() ? this.usedNamespace() + '/' : '') + this.entity
  }

  /**
   * Build the schema by evaluating fields and registry.
   */
  protected static initializeSchema (): void {
    const entity = this.modelEntity()
    this.schemas[entity] = {}
    this.fieldsOnDelete[entity] = this.fieldsOnDelete[entity] ?? {}

    const registry = {
      ...this.fields(),
      ...this.registries[entity],
    }

    for (const key in registry) {
      const attribute = registry[key]

      this.schemas[entity][key] =
        typeof attribute === 'function' ? attribute() : attribute

      if (this.fieldsOnDelete[entity][key]) { this.schemas[entity][key] = (this.schemas[entity][key] as Relation).onDelete(this.fieldsOnDelete[entity][key]) }
    }
  }

  /**
   * Set the attribute to the registry.
   */
  static setRegistry<M extends typeof Model> (
    this: M,
    key: string,
    attribute: () => Attribute,
  ): M {
    if (!this.registries[this.modelEntity()]) { this.registries[this.modelEntity()] = {} }

    this.registries[this.modelEntity()][key] = attribute

    return this
  }

  /**
   * Set delete behaviour for relation field
   */
  static setFieldDeleteMode<M extends typeof Model> (
    this: M,
    key: string,
    mode: deleteModes,
  ): M {
    this.fieldsOnDelete[this.modelEntity()] = this.fieldsOnDelete[this.modelEntity()] ?? {}
    this.fieldsOnDelete[this.modelEntity()][key] = mode

    return this
  }

  /**
   * Set an mutator for a field
   */
  static setMutator<M extends typeof Model> (
    this: M,
    key: string,
    mutator: MutatorFunctions<any>,
  ): M {
    this.fieldMutators[key] = mutator

    return this
  }

  /**
   * Set a cast for a field
   */
  static setCast<M extends typeof Model> (
    this: M,
    key: string,
    to: typeof CastAttribute,
  ): M {
    this.fieldCasts[key] = to

    return this
  }

  /**
   * Set a field to hidden
   */
  static setHidden<M extends typeof Model> (
    this: M,
    key: keyof ModelFields,
  ): M {
    this.hidden.push(key)

    return this
  }

  /**
   * Clear the list of booted models so they can be re-booted.
   */
  static clearBootedModels (): void {
    this.booted = {}
    this.original = {}
    this.schemas = {}
    this.fieldMutators = {}
    this.fieldCasts = {}
    this.hidden = []
    this.visible = []
  }

  /**
   * Clear registries.
   */
  static clearRegistries (): void {
    this.registries = {}
  }

  /**
   * Create a new model instance without field values being populated.
   *
   * This method is mainly for the internal use when registering models to the
   * database. Since all pre-registered models are for referencing its model
   * setting during the various process, but the fields are not required.
   *
   * Use this method when you want create a new model instance for:
   * - Registering model to a component (eg. Repository, Query, etc.)
   * - Registering model to attributes (String, Has Many, etc.)
   */
  static newRawInstance<M extends typeof Model> (this: M): InstanceType<M> {
    return new this(undefined, { fill: false }) as InstanceType<M>
  }

  /**
   * Create a new Attr attribute instance.
   */
  static attr (value: TypeDefault<any>): Attr {
    return new Attr(this.newRawInstance(), value)
  }

  /**
   * Create a new String attribute instance.
   */
  static string (value: TypeDefault<string>): Str {
    return new Str(this.newRawInstance(), value)
  }

  /**
   * Create a new Number attribute instance.
   */
  static number (value: TypeDefault<number>): Num {
    return new Num(this.newRawInstance(), value)
  }

  /**
   * Create a new Boolean attribute instance.
   */
  static boolean (value: TypeDefault<boolean>): Bool {
    return new Bool(this.newRawInstance(), value)
  }

  /**
   * Create a new Uid attribute instance.
   */
  static uid (options?: UidOptions): Uid {
    return new Uid(this.newRawInstance(), options)
  }

  /**
   * Create a new HasOne relation instance.
   */
  static hasOne (
    related: typeof Model,
    foreignKey: PrimaryKey,
    localKey?: PrimaryKey,
  ): HasOne {
    const model = this.newRawInstance()

    localKey = localKey ?? model.$getKeyName()

    return new HasOne(model, related.newRawInstance(), foreignKey, localKey)
  }

  /**
   * Create a new BelongsTo relation instance.
   */
  static belongsTo (
    related: typeof Model,
    foreignKey: PrimaryKey,
    ownerKey?: PrimaryKey,
  ): BelongsTo {
    const instance = related.newRawInstance()

    ownerKey = ownerKey ?? instance.$getKeyName()

    return new BelongsTo(this.newRawInstance(), instance, foreignKey, ownerKey)
  }

  /**
   * Create a new HasMany relation instance.
   */
  static belongsToMany (
    related: typeof Model,
    pivot: typeof Model,
    foreignPivotKey: string,
    relatedPivotKey: string,
    parentKey?: string,
    relatedKey?: string,
  ): BelongsToMany {
    const instance = related.newRawInstance()
    const model = this.newRawInstance()
    const pivotInstance = pivot.newRawInstance()

    parentKey = parentKey ?? model.$getLocalKey()
    relatedKey = relatedKey ?? instance.$getLocalKey()

    this.schemas[related.modelEntity()][`pivot_${relatedPivotKey}_${pivotInstance.$entity()}`] = new HasOne(instance, pivotInstance, relatedPivotKey, relatedKey)

    return new BelongsToMany(
      model,
      instance,
      pivotInstance,
      foreignPivotKey,
      relatedPivotKey,
      parentKey,
      relatedKey,
    )
  }

  /**
   * Create a new MorphToMany relation instance.
   */
  static morphToMany (
    related: typeof Model,
    pivot: typeof Model,
    relatedId: string,
    id: string,
    type: string,
    parentKey?: string,
    relatedKey?: string,
  ): MorphToMany {
    const instance = related.newRawInstance()
    const model = this.newRawInstance()
    const pivotInstance = pivot.newRawInstance()

    parentKey = parentKey ?? model.$getLocalKey()
    relatedKey = relatedKey ?? instance.$getLocalKey()

    this.schemas[related.modelEntity()][`pivot_${relatedId}_${pivotInstance.$entity()}`] = new MorphOne(instance, pivotInstance, relatedId, model.$entity(), relatedKey)

    return new MorphToMany(
      model,
      instance,
      pivotInstance,
      relatedId,
      id,
      type,
      parentKey,
      relatedKey,
    )
  }

  /**
   * Create a new HasMany relation instance.
   */
  static hasMany (
    related: typeof Model,
    foreignKey: PrimaryKey,
    localKey?: PrimaryKey,
  ): HasMany {
    const model = this.newRawInstance()

    localKey = localKey ?? model.$getKeyName()

    return new HasMany(model, related.newRawInstance(), foreignKey, localKey)
  }

  /**
   * Create a new HasManyBy relation instance.
   */
  static hasManyBy (
    related: typeof Model,
    foreignKey: string,
    ownerKey?: string,
  ): HasManyBy {
    const instance = related.newRawInstance()

    ownerKey = ownerKey ?? instance.$getLocalKey()

    return new HasManyBy(this.newRawInstance(), instance, foreignKey, ownerKey)
  }

  /**
   * Create a new HasMany relation instance.
   */
  static hasManyThrough (
    related: typeof Model,
    through: typeof Model,
    firstKey: string,
    secondKey: string,
    localKey?: string,
    secondLocalKey?: string,
  ): HasManyThrough {
    const model = this.newRawInstance()
    const throughModel = through.newRawInstance()

    localKey = localKey ?? model.$getLocalKey()
    secondLocalKey = secondLocalKey ?? throughModel.$getLocalKey()

    return new HasManyThrough(model, related.newRawInstance(), throughModel, firstKey, secondKey, localKey, secondLocalKey)
  }

  /**
   * Create a new MorphOne relation instance.
   */
  static morphOne (
    related: typeof Model,
    id: string,
    type: string,
    localKey?: string,
  ): MorphOne {
    const model = this.newRawInstance()

    localKey = localKey ?? model.$getLocalKey()

    return new MorphOne(model, related.newRawInstance(), id, type, localKey)
  }

  /**
   * Create a new MorphTo relation instance.
   */
  static morphTo (
    related: typeof Model[],
    id: string,
    type: string,
    ownerKey = '',
  ): MorphTo {
    const instance = this.newRawInstance()
    const relatedModels = related.map(model => model.newRawInstance())

    return new MorphTo(instance, relatedModels, id, type, ownerKey)
  }

  /**
   * Create a new MorphMany relation instance.
   */
  static morphMany (
    related: typeof Model,
    id: string,
    type: string,
    localKey?: string,
  ): MorphMany {
    const model = this.newRawInstance()

    localKey = localKey ?? model.$getLocalKey()

    return new MorphMany(model, related.newRawInstance(), id, type, localKey)
  }

  /**
   * Lifecycle hook for before saving
   */
  static saving: BeforeHook = () => { }

  /**
   * Lifecycle hook for before updating
   */
  static updating: BeforeHook = () => { }

  /**
   * Lifecycle hook for before creating
   */
  static creating: BeforeHook = () => { }

  /**
   * Lifecycle hook for before deleting
   */
  static deleting: BeforeHook = () => { }

  /**
   * Lifecycle hook for after getting data
   */
  static retrieved: AfterHook = () => { }

  /**
   * Lifecycle hook for after saved
   */
  static saved: AfterHook = () => { }

  /**
   * Lifecycle hook for after updated
   */
  static updated: AfterHook = () => { }

  /**
   * Lifecycle hook for after created
   */
  static created: AfterHook = () => { }

  /**
   * Lifecycle hook for after deleted
   */
  static deleted: AfterHook = () => { }

  /**
   * Mutators to mutate matching fields when instantiating the model.
   */
  static mutators (): Mutators {
    return {}
  }

  /**
   * Casts to cast matching fields when instantiating the model.
   */
  static casts (): Casts {
    return {}
  }

  /**
   * Types mapping used to dispatch entities based on their discriminator field
   */
  static types (): InheritanceTypes {
    return {}
  }

  /**
   * Get the constructor for this model.
   */
  $self (): typeof Model {
    return this.constructor as typeof Model
  }

  /**
   * Get the entity for this model.
   */
  $entity (): string {
    return this.$self().entity
  }

  /**
   * Get the model config.
   */
  $config (): ModelConfigOptions & { [key: string]: any } {
    return this.$self().config
  }

  /**
   * Get the namespace.
   */
  $namespace (): String {
    return this.$self().usedNamespace()
  }

  /**
   * Get the store name.
   */
  $storeName (): string {
    return (this.$namespace() ? this.$namespace() + '/' : '') + this.$baseEntity()
  }

  /**
   * Get the base entity for this model.
   */
  $baseEntity (): string {
    return this.$self().baseEntity ?? this.$entity()
  }

  /**
   * Get the base namespace for this model.
   */
  $baseNamespace (): string {
    return this.$self().baseNamespace ?? this.$namespace()
  }

  /**
   * Get the model entity for this model.
   */
  $modelEntity (): string {
    return this.$self().modelEntity()
  }

  /**
   * Get the type key for this model.
   */
  $typeKey (): string {
    return this.$self().typeKey
  }

  /**
   * Get the types for this model.
   */
  $types (): InheritanceTypes {
    return this.$self().types()
  }

  /**
   * Get the pinia options for this model.
   */
  $piniaOptions () {
    return this.$self().piniaOptions
  }

  /**
   * Get the primary key for this model.
   */
  $primaryKey (): string | string[] {
    return this.$self().primaryKey
  }

  /**
   * Get the model fields for this model.
   */
  $fields (): ModelFields {
    return this.$self().schemas[this.$modelEntity()]
  }

  /**
   * Get the model hidden fields
   */
  $hidden (): string[] {
    return this.$self().hidden
  }

  /**
   * Get the model visible fields
   */
  $visible (): string[] {
    return this.$self().visible
  }

  /**
   * Create a new instance of this model. This method provides a convenient way
   * to re-generate a fresh instance of this model. It's particularly useful
   * during hydration through Query operations.
   */
  $newInstance (attributes?: Element, options?: ModelOptions): this {
    const Self = this.$self()

    return new Self(attributes, options) as this
  }

  /**
   * Bootstrap this model.
   */
  protected $boot (): void {
    if (!this.$self().booted[this.$modelEntity()]) {
      this.$self().booted[this.$modelEntity()] = true

      this.$initializeSchema()
    }
  }

  /**
   * Build the schema by evaluating fields and registry.
   */
  protected $initializeSchema (): void {
    this.$self().initializeSchema()
  }

  $casts (): Casts {
    return {
      ...this.$getCasts(),
      ...this.$self().fieldCasts,
    }
  }

  /**
   * Fill this model by the given attributes. Missing fields will be populated
   * by the attributes default value.
   */
  $fill (attributes: Element = {}, options: ModelOptions = {}): this {
    const operation = options.operation ?? 'get'

    const modelConfig = {
      ...config.model,
      ...this.$config(),
    }
    modelConfig.withMeta && (this.$self().schemas[this.$entity()][this.$self().metaKey] = this.$self().attr({}))

    const fields = this.$fields()
    const fillRelation = options.relations ?? true
    const mutators: Mutators = {
      ...this.$getMutators(),
      ...this.$self().fieldMutators,
    }

    for (const key in fields) {
      if (operation === 'get' && !this.isFieldVisible(key, this.$hidden(), this.$visible(), options as Required<ModelOptions>)) { continue }

      const attr = fields[key]
      let value = attributes[key]

      if (attr instanceof Relation && !fillRelation) { continue }

      const mutator = mutators?.[key]
      const cast = this.$casts()[key]?.newRawInstance(fields)
      if (mutator && operation === 'get') {
        value = typeof mutator === 'function'
          ? mutator(value)
          : typeof mutator.get === 'function' ? mutator.get(value) : value
      }

      if (cast && operation === 'get') { value = cast.get(value) }

      let keyValue = this.$fillField(key, attr, value)

      if (mutator && typeof mutator !== 'function' && operation === 'set' && mutator.set) { keyValue = mutator.set(keyValue) }

      if (cast && operation === 'set') {
        keyValue = options.action === 'update' ? cast.get(keyValue) : cast.set(keyValue)
      }

      this[key as keyof this] = this[key as keyof this] ?? keyValue
    }

    operation === 'set' && (this.$self().original[this.$getKey(this, true) as string] = this.$getAttributes())

    modelConfig.withMeta && operation === 'set' && this.$fillMeta(options.action)

    return this
  }

  public $fillMeta (action = 'save') {
    const timestamp = Math.floor(Date.now() / 1000)
    if (action === 'save') {
      // @ts-expect-error Setting an object
      this[this.$self().metaKey as keyof this] = {
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    }
    // @ts-expect-error Setting an object
    if (action === 'update') { this[this.$self().metaKey as keyof this].updatedAt = timestamp }
  }

  /**
   * Fill the given attribute with a given value specified by the given key.
   */
  protected $fillField (key: string, attr: Attribute, value: any): any {
    if (value !== undefined) {
      return attr instanceof MorphTo
        ? attr.setKey(key).make(value, this[attr.getType() as keyof this] as string)
        : attr.setKey(key).make(value)
    }

    if (this[key as keyof this] === undefined) { return attr.setKey(key).make() }
  }

  protected isFieldVisible (key: string, modelHidden: string[], modelVisible: string[], options: ModelOptions): boolean {
    const hidden = modelHidden.length > 0 ? modelHidden : config.model.hidden
    const visible = [...(modelVisible.length > 0 ? modelVisible : config.model.visible), String(this.$primaryKey())]
    const optionsVisible = options.visible ?? []
    const optionsHidden = options.hidden ?? []
    if (((hidden.includes('*') || hidden.includes(key)) && !optionsVisible.includes(key)) || optionsHidden.includes(key)) { return false }

    return ((visible.includes('*') || visible.includes(key)) && !optionsHidden.includes(key)) || optionsVisible.includes(key)
  }

  /**
   * Get the primary key field name.
   */
  $getKeyName (): string | string[] {
    return this.$primaryKey()
  }

  /**
   * Get primary key value for the model. If the model has the composite key,
   * it will return an array of ids.
   */
  $getKey (record?: Element, concatCompositeKey = false): string | number | (string | number)[] | null {
    record = record ?? this

    if (this.$hasCompositeKey()) {
      const compositeKey = this.$getCompositeKey(record)
      return concatCompositeKey ? '[' + compositeKey?.join(',') + ']' : compositeKey
    }

    const id = record[this.$getKeyName() as string]

    return isNullish(id) ? null : id
  }

  /**
   * Check whether the model has composite key.
   */
  $hasCompositeKey (): boolean {
    return isArray(this.$getKeyName())
  }

  /**
   * Get the composite key values for the given model as an array of ids.
   */
  protected $getCompositeKey (record: Element): (string | number)[] | null {
    let ids = [] as (string | number)[] | null;
    (this.$getKeyName() as string[]).every((key) => {
      const id = record[key]

      if (isNullish(id)) {
        ids = null
        return false
      }

      (ids as (string | number)[]).push(id)
      return true
    })

    return ids === null ? null : ids
  }

  /**
   * Get the index id of this model or for a given record.
   */
  $getIndexId (record?: Element): string {
    const target = record ?? this

    const id = this.$getKey(target)

    assert(id !== null, [
      'The record is missing the primary key. If you want to persist record',
      'without the primary key, please define the primary key field with the',
      '`uid` attribute.',
    ])

    return this.$stringifyId(id)
  }

  /**
   * Stringify the given id.
   */
  protected $stringifyId (id: string | number | (string | number)[]): string {
    return isArray(id) ? JSON.stringify(id) : String(id)
  }

  /**
   * Get the local key name for the model.
   */
  $getLocalKey (): string {
    // If the model has a composite key, we can't use it as a local key for the
    // relation. The user must provide the key name explicitly, so we'll throw
    // an error here.
    assert(!this.$hasCompositeKey(), [
      'Please provide the local key for the relationship. The model with the',
      'composite key can\'t infer its local key.',
    ])

    return this.$getKeyName() as string
  }

  /**
   * Get the relation instance for the given relation name.
   */
  $getRelation (name: string): Relation {
    let relation = this.$fields()[name]
    const typeModels = Object.values(this.$types())
    typeModels.forEach((typeModel) => {
      if (relation === undefined) { relation = typeModel.fields()[name] }
    })

    assert(relation instanceof Relation, [
      `Relationship [${name}] on model [${this.$entity()}] not found.`,
    ])

    return relation
  }

  /**
   * Set the given relationship on the model.
   */
  $setRelation (relation: string, model: Model | Model[] | null): this {
    if (relation.includes('pivot')) {
      this.pivot = model
      return this
    }
    // @ts-expect-error Setting model as field
    if (this.$fields()[relation]) { this[relation as keyof this] = model }

    return this
  }

  /**
   * Get the mutators of the model
   */
  $getMutators (): Mutators {
    return this.$self().mutators()
  }

  /**
   * Get the casts of the model
   */
  $getCasts () {
    return this.$self().casts()
  }

  /**
   * Get the original values of the model instance
   */
  $getOriginal (): Element {
    return this.$self().original[this.$getKey(this, true) as string]
  }

  /**
   * Return the model instance with its original state
   */
  $refresh (): this {
    if (this.$isDirty()) {
      Object.entries(this.$getOriginal()).forEach((entry) => {
        this[entry[0] as keyof this] = entry[1]
      })
    }
    return this
  }

  /**
   * Checks if attributes were changed
   */
  $isDirty ($attribute?: keyof ModelFields): Boolean {
    const original = this.$getOriginal()
    if ($attribute) {
      if (!Object.keys(original).includes($attribute)) { throwError(['The property"', $attribute, '"does not exit in the model "', this.$entity(), '"']) }
      return !equals(this[$attribute as keyof this], original[$attribute])
    }

    return !equals(original, this.$getAttributes())
  }

  /**
   * Get the serialized model attributes.
   */
  $getAttributes (): Element {
    return this.$toJson(this, { relations: false })
  }

  /**
   * Serialize this model, or the given model, as POJO.
   */
  $toJson (model?: Model, options: ModelOptions = {}): Element {
    model = model ?? this

    const fields = model.$fields()
    const withRelation = options.relations ?? true
    const record: Element = {}

    for (const key in fields) {
      const attr = fields[key]
      const value = model[key as keyof Model]

      if (!(attr instanceof Relation)) {
        record[key] = this.serializeValue(value)
        continue
      }

      if (withRelation) { record[key] = this.serializeRelation(value as any) }
    }

    return record
  }

  /**
   * Serialize the given value.
   */
  protected serializeValue (value: any): any {
    if (value === null) { return null }

    if (isArray(value)) { return this.serializeArray(value) }

    if (typeof value === 'object') {
      // If the value is an object, check if it's an instance of Date and that it has
      // a time value with its getTime() method, and that its toISOString() method exists
      if (isDate(value)) { return value.toISOString() } else {
        // If it's not a Date object, serialize the object using the default method
        return this.serializeObject(value)
      }
    }

    return value
  }

  /**
   * Serialize the given array to JSON.
   */
  protected serializeArray (value: any[]): any[] {
    return value.map(v => this.serializeValue(v))
  }

  /**
   * Serialize the given object to JSON.
   */
  protected serializeObject (value: any): object {
    const obj: { [index: string]: number | string } = {}

    if (value.serialize && typeof value.serialize === 'function') {
      return value.serialize(value)
    }

    for (const key in value) {
      obj[key] = this.serializeValue(value[key])
    }

    return obj
  }

  /**
   * Serialize the given relation to JSON.
   */
  protected serializeRelation (relation: Item): Element | null
  protected serializeRelation (relation: Collection): Element[]
  protected serializeRelation (relation: any): any {
    if (relation === undefined) { return undefined }

    if (relation === null) { return null }

    return isArray(relation)
      ? relation.map(model => model.$toJson())
      : relation.$toJson()
  }
}
