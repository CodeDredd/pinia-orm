import type { Store } from 'pinia'
import { Database } from '../database/Database'
import { Model } from '../model/Model'
import { Attribute } from '../model/attributes/Attribute'
import { Type } from '../model/attributes/types/Type'
import { Attr } from '../model/attributes/types/Attr'
import { String } from '../model/attributes/types/String'
import { Number } from '../model/attributes/types/Number'
import { Boolean } from '../model/attributes/types/Boolean'
import { Uid } from '../model/attributes/types/Uid'
import { Relation } from '../model/attributes/relations/Relation'
import { HasOne } from '../model/attributes/relations/HasOne'
import { BelongsTo } from '../model/attributes/relations/BelongsTo'
import { HasMany } from '../model/attributes/relations/HasMany'
import { HasManyBy } from '../model/attributes/relations/HasManyBy'
import { MorphOne } from '../model/attributes/relations/MorphOne'
import { Repository } from '../repository/Repository'
import { Interpreter } from '../interpreter/Interpreter'
import { Query } from '../query/Query'
import { Connection } from '../connection/Connection'

export interface VuexORMPlugin {
  install(
    store: Store<any>,
    components: VuexORMPluginComponents,
    options: any
  ): void
}

export interface VuexORMPluginRegistry {
  func: VuexORMPlugin
  options: any
}

export interface VuexORMPluginComponents {
  Database: typeof Database
  Model: typeof Model
  Attribute: typeof Attribute
  Type: typeof Type
  Attr: typeof Attr
  String: typeof String
  Number: typeof Number
  Boolean: typeof Boolean
  Uid: typeof Uid
  Relation: typeof Relation
  HasOne: typeof HasOne
  BelongsTo: typeof BelongsTo
  HasMany: typeof HasMany
  HasManyBy: typeof HasManyBy
  MorphOne: typeof MorphOne
  Repository: typeof Repository
  Interpreter: typeof Interpreter
  Query: typeof Query
  Connection: typeof Connection
}

/**
 * The plugin registry. All plugins registered through `VuexORM.use` method
 * is going to be stored here and then executed during the Vuex ORM
 * installation process.
 */
export const plugins: VuexORMPluginRegistry[] = []

/**
 * The components to be passed to the plugin `install` method.
 */
export const components: VuexORMPluginComponents = {
  Database,
  Model,
  Attribute,
  Type,
  Attr,
  String,
  Number,
  Boolean,
  Uid,
  Relation,
  HasOne,
  BelongsTo,
  HasMany,
  HasManyBy,
  MorphOne,
  Repository,
  Interpreter,
  Query,
  Connection
}

/**
 * Plugin additional feature to the Vuex ORM.
 */
export function use(plugin: VuexORMPlugin, options?: any): void {
  plugins.push({ func: plugin, options })
}
