import { a as assert, g as generateId, i as isNullish, b as isArray, c as compareWithOperator, t as throwError, d as generateKey, e as isEmpty, f as groupBy, h as isFunction, o as orderBy } from './shared/pinia-orm.c0f71df4.mjs';
import { schema, normalize } from '@pinia-orm/normalizr';
import { defineStore } from 'pinia';
import _ from 'lodash';
export { C as CastAttribute } from './shared/pinia-orm.4d1655c0.mjs';

class Attribute {
  constructor(model) {
    this.model = model;
    this.key = "";
  }
  setKey(key) {
    this.key = key;
    return this;
  }
}

class Relation extends Attribute {
  constructor(parent, related) {
    super(parent);
    this.parent = parent;
    this.related = related;
  }
  getRelated() {
    return this.related;
  }
  getKeys(models, key) {
    return models.map((model) => model[key]);
  }
  mapToDictionary(models, callback) {
    return models.reduce((dictionary, model) => {
      const [key, value] = callback(model);
      if (!dictionary[key])
        dictionary[key] = [];
      dictionary[key].push(value);
      return dictionary;
    }, {});
  }
}

class MorphTo extends Relation {
  constructor(parent, relatedModels, morphId, morphType, ownerKey) {
    super(parent, parent);
    this.relatedModels = relatedModels;
    this.relatedTypes = this.createRelatedTypes(relatedModels);
    this.morphId = morphId;
    this.morphType = morphType;
    this.ownerKey = ownerKey;
  }
  createRelatedTypes(models) {
    return models.reduce((types, model) => {
      types[model.$entity()] = model;
      return types;
    }, {});
  }
  getType() {
    return this.morphType;
  }
  getRelateds() {
    return this.relatedModels;
  }
  define(schema) {
    return schema.union(this.relatedModels, (value, parent, _key) => {
      const type = parent[this.morphType];
      const model = this.relatedTypes[type];
      const key = this.ownerKey || model.$getKeyName();
      parent[this.morphId] = value[key];
      return type;
    });
  }
  attach(_record, _child) {
  }
  addEagerConstraints(_query, _models) {
  }
  match(relation, models, query) {
    const dictionary = this.buildDictionary(query, models);
    models.forEach((model) => {
      const type = model[this.morphType];
      const id = model[this.morphId];
      const related = dictionary[type]?.[id] ?? null;
      model.$setRelation(relation, related);
    });
  }
  make(element, type) {
    if (!element || !type)
      return null;
    return this.relatedTypes[type].$newInstance(element);
  }
  buildDictionary(query, models) {
    const keys = this.getKeysByEntity(models);
    const dictionary = {};
    for (const entity in keys) {
      const model = this.relatedTypes[entity];
      assert(!!model, [
        `Trying to load "morph to" relation of \`${entity}\``,
        "but the model could not be found."
      ]);
      const ownerKey = this.ownerKey || model.$getKeyName();
      const results = query.newQueryWithConstraints(entity).whereIn(ownerKey, keys[entity]).get(false);
      dictionary[entity] = results.reduce(
        (dic, result) => {
          dic[result[ownerKey]] = result;
          return dic;
        },
        {}
      );
    }
    return dictionary;
  }
  getKeysByEntity(models) {
    return models.reduce((keys, model) => {
      const type = model[this.morphType];
      const id = model[this.morphId];
      if (id !== null && this.relatedTypes[type] !== void 0) {
        if (!keys[type])
          keys[type] = [];
        keys[type].push(id);
      }
      return keys;
    }, {});
  }
}

class Type extends Attribute {
  constructor(model, value = null) {
    super(model);
    this.isNullable = true;
    this.value = value;
  }
  notNullable() {
    this.isNullable = false;
    return this;
  }
  makeReturn(type, value) {
    if (value === void 0)
      return this.value;
    if (value === null) {
      if (!this.isNullable)
        this.throwWarning(["is set as non nullable!"]);
      return value;
    }
    if (typeof value !== type)
      this.throwWarning([value, "is not a", type]);
    return value;
  }
  throwWarning(message) {
    console.warn(["[Pinia ORM]"].concat([`Field ${this.model.$entity()}:${this.key} - `, ...message]).join(" "));
  }
}

class Uid extends Type {
  constructor(model, size = 21) {
    super(model);
    this.urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
    this.size = 21;
    this.size = size;
  }
  make(value) {
    const uidCast = this.model.$casts()[this.model.$getKeyName()];
    if (uidCast)
      return value ?? uidCast.newRawInstance(this.model.$fields()).set(value);
    return value ?? generateId(this.size, this.urlAlphabet);
  }
}

class Schema {
  constructor(model) {
    this.schemas = {};
    this.model = model;
  }
  one(model, parent) {
    model = model || this.model;
    parent = parent || this.model;
    const entity = `${model.$entity()}${parent.$entity()}`;
    if (this.schemas[entity])
      return this.schemas[entity];
    const schema = this.newEntity(model, parent);
    this.schemas[entity] = schema;
    const definition = this.definition(model);
    schema.define(definition);
    return schema;
  }
  many(model, parent) {
    return new schema.Array(this.one(model, parent));
  }
  union(models, callback) {
    const schemas = models.reduce((schemas2, model) => {
      schemas2[model.$entity()] = this.one(model);
      return schemas2;
    }, {});
    return new schema.Union(schemas, callback);
  }
  newEntity(model, parent) {
    const entity = model.$entity();
    const idAttribute = this.idAttribute(model, parent);
    return new schema.Entity(entity, {}, { idAttribute });
  }
  idAttribute(model, parent) {
    const uidFields = this.getUidPrimaryKeyPairs(model);
    return (record, parentRecord, key) => {
      if (key !== null)
        parent.$fields()[key].attach(parentRecord, record);
      for (const key2 in uidFields) {
        if (isNullish(record[key2]))
          record[key2] = uidFields[key2].setKey(key2).make(record[key2]);
      }
      const id = model.$getIndexId(record);
      return id;
    };
  }
  getUidPrimaryKeyPairs(model) {
    const fields = model.$fields();
    const key = model.$getKeyName();
    const keys = isArray(key) ? key : [key];
    const attributes = {};
    keys.forEach((k) => {
      const attr = fields[k];
      if (attr instanceof Uid)
        attributes[k] = attr;
    });
    return attributes;
  }
  definition(model) {
    const fields = model.$fields();
    const definition = {};
    for (const key in fields) {
      const field = fields[key];
      if (field instanceof Relation)
        definition[key] = field.define(this);
    }
    return definition;
  }
}

class Interpreter {
  constructor(model) {
    this.model = model;
  }
  process(data) {
    const normalizedData = this.normalize(data);
    return [data, normalizedData];
  }
  normalize(data) {
    const schema = isArray(data) ? [this.getSchema()] : this.getSchema();
    return normalize(data, schema).entities;
  }
  getSchema() {
    return new Schema(this.model).one();
  }
}

function useStoreActions() {
  return {
    save(records) {
      this.data = { ...this.data, ...records };
    },
    insert(records) {
      this.data = { ...this.data, ...records };
    },
    update(records) {
      this.data = { ...this.data, ...records };
    },
    fresh(records) {
      this.data = records;
    },
    destroy(ids) {
      const data = {};
      for (const id in this.data) {
        if (!ids.includes(id))
          data[id] = this.data[id];
      }
      this.data = data;
    },
    delete(ids) {
      const data = {};
      for (const id in this.data) {
        if (!ids.includes(id))
          data[id] = this.data[id];
      }
      this.data = data;
    },
    flush() {
      this.data = {};
    }
  };
}

function useDataStore(id, options = null) {
  return defineStore(id, {
    state: () => ({ data: {} }),
    actions: useStoreActions(),
    ...options
  });
}

class Query {
  constructor(database, model, cache, pinia) {
    this.wheres = [];
    this.orders = [];
    this.groups = [];
    this.take = null;
    this.skip = 0;
    this.visible = ["*"];
    this.hidden = [];
    this.eagerLoad = {};
    this.fromCache = false;
    this.cacheConfig = {};
    this.database = database;
    this.model = model;
    this.pinia = pinia;
    this.cache = cache;
  }
  newQuery(model) {
    return new Query(this.database, this.database.getModel(model), this.cache, this.pinia);
  }
  newQueryWithConstraints(model) {
    const newQuery = new Query(this.database, this.database.getModel(model), this.cache, this.pinia);
    newQuery.eagerLoad = { ...this.eagerLoad };
    newQuery.wheres = [...this.wheres];
    newQuery.orders = [...this.orders];
    newQuery.take = this.take;
    newQuery.skip = this.skip;
    newQuery.fromCache = this.fromCache;
    newQuery.cacheConfig = this.cacheConfig;
    return newQuery;
  }
  newQueryForRelation(relation) {
    return new Query(this.database, relation.getRelated(), this.cache, this.pinia);
  }
  newInterpreter() {
    return new Interpreter(this.model);
  }
  commit(name, payload) {
    const store = useDataStore(this.model.$baseEntity(), this.model.$piniaOptions())(this.pinia);
    if (name && typeof store[name] === "function")
      store[name](payload);
    if (this.cache && ["get", "all", "insert", "flush", "delete", "update", "destroy"].includes(name))
      this.cache.clear();
    return store.$state.data;
  }
  withMeta() {
    return this.makeVisible(["_meta"]);
  }
  makeVisible(fields) {
    this.visible = fields;
    return this;
  }
  makeHidden(fields) {
    this.hidden = fields;
    return this;
  }
  where(field, value) {
    this.wheres.push({ field, value, boolean: "and" });
    return this;
  }
  whereIn(field, values) {
    this.wheres.push({ field, value: values, boolean: "and" });
    return this;
  }
  whereId(ids) {
    return this.where(this.model.$getKeyName(), ids);
  }
  orWhere(field, value) {
    this.wheres.push({ field, value, boolean: "or" });
    return this;
  }
  whereHas(relation, callback = () => {
  }, operator, count) {
    return this.where(this.getFieldWhereForRelations(relation, callback, operator, count));
  }
  orWhereHas(relation, callback = () => {
  }, operator, count) {
    return this.orWhere(this.getFieldWhereForRelations(relation, callback, operator, count));
  }
  has(relation, operator, count) {
    return this.where(this.getFieldWhereForRelations(relation, () => {
    }, operator, count));
  }
  orHas(relation, operator, count) {
    return this.orWhere(this.getFieldWhereForRelations(relation, () => {
    }, operator, count));
  }
  doesntHave(relation) {
    return this.where(this.getFieldWhereForRelations(relation, () => {
    }, "=", 0));
  }
  orDoesntHave(relation) {
    return this.orWhere(this.getFieldWhereForRelations(relation, () => {
    }, "=", 0));
  }
  whereDoesntHave(relation, callback = () => {
  }) {
    return this.where(this.getFieldWhereForRelations(relation, callback, "=", 0));
  }
  orWhereDoesntHave(relation, callback = () => {
  }) {
    return this.orWhere(this.getFieldWhereForRelations(relation, callback, "=", 0));
  }
  groupBy(...fields) {
    fields.forEach((field) => {
      this.groups.push({ field });
    });
    return this;
  }
  orderBy(field, direction = "asc") {
    this.orders.push({ field, direction });
    return this;
  }
  limit(value) {
    this.take = value;
    return this;
  }
  offset(value) {
    this.skip = value;
    return this;
  }
  with(name, callback = () => {
  }) {
    this.eagerLoad[name] = callback;
    return this;
  }
  withAll(callback = () => {
  }) {
    let fields = this.model.$fields();
    const typeModels = Object.values(this.model.$types());
    typeModels.forEach((typeModel) => {
      fields = { ...fields, ...typeModel.fields() };
    });
    for (const name in fields)
      fields[name] instanceof Relation && this.with(name, callback);
    return this;
  }
  withAllRecursive(depth = 3) {
    return this.withAll((query) => {
      depth > 0 && query.withAllRecursive(depth - 1);
    });
  }
  useCache(key, params) {
    this.fromCache = true;
    this.cacheConfig = {
      key,
      params
    };
    return this;
  }
  getFieldWhereForRelations(relation, callback = () => {
  }, operator, count) {
    const modelIdsByRelation = this.newQuery(this.model.$entity()).with(relation, callback).get(false).filter((model) => compareWithOperator(
      model[relation] !== void 0 ? isArray(model[relation]) ? model[relation].length : model[relation] === null ? 0 : 1 : throwError(["Relation", relation, "not found in model: ", model.$entity()]),
      typeof operator === "number" ? operator : count ?? 1,
      typeof operator === "number" || count === void 0 ? ">=" : operator
    )).map((model) => model.$getIndexId());
    return (model) => modelIdsByRelation.includes(model.$getIndexId());
  }
  all() {
    const data = this.commit("all");
    const collection = [];
    for (const id in data)
      collection.push(this.hydrate(data[id], { visible: this.visible, hidden: this.hidden }));
    return collection;
  }
  get(triggerHook = true) {
    if (!this.fromCache || !this.cache)
      return this.internalGet(triggerHook);
    const key = this.cacheConfig.key ? this.cacheConfig.key + JSON.stringify(this.cacheConfig.params) : generateKey(this.model.$entity(), {
      where: this.wheres,
      groups: this.groups,
      orders: this.orders,
      eagerLoads: this.eagerLoad,
      skip: this.skip,
      take: this.take,
      hidden: this.hidden,
      visible: this.visible
    });
    const result = this.cache.get(key);
    if (result)
      return result;
    const queryResult = this.internalGet(triggerHook);
    this.cache.set(key, queryResult);
    return queryResult;
  }
  internalGet(triggerHook) {
    if (this.model.$entity() !== this.model.$baseEntity())
      this.where(this.model.$typeKey(), this.model.$fields()[this.model.$typeKey()].make());
    const models = this.select();
    if (!isEmpty(models))
      this.eagerLoadRelations(models);
    if (triggerHook)
      models.forEach((model) => model.$self().retrieved(model));
    if (this.groups.length > 0)
      return this.filterGroup(models);
    return models;
  }
  first() {
    return this.limit(1).get()[0] ?? null;
  }
  find(ids) {
    return this.whereId(ids)[isArray(ids) ? "get" : "first"]();
  }
  select() {
    let models = this.all();
    models = this.filterWhere(models);
    models = this.filterOrder(models);
    models = this.filterLimit(models);
    return models;
  }
  filterWhere(models) {
    if (isEmpty(this.wheres))
      return models;
    const comparator = this.getWhereComparator();
    return models.filter((model) => comparator(model));
  }
  getWhereComparator() {
    const { and, or } = groupBy(this.wheres, (where) => where.boolean);
    return (model) => {
      const results = [];
      and && results.push(and.every((w) => this.whereComparator(model, w)));
      or && results.push(or.some((w) => this.whereComparator(model, w)));
      return results.includes(true);
    };
  }
  whereComparator(model, where) {
    if (isFunction(where.field))
      return where.field(model);
    if (isArray(where.value))
      return where.value.includes(model[where.field]);
    if (isFunction(where.value))
      return where.value(model[where.field]);
    return model[where.field] === where.value;
  }
  filterOrder(models) {
    if (this.orders.length === 0)
      return models;
    const fields = this.orders.map((order) => order.field);
    const directions = this.orders.map((order) => order.direction);
    return orderBy(models, fields, directions);
  }
  filterGroup(models) {
    const grouped = {};
    const fields = this.groups.map((group) => group.field);
    models.forEach((model) => {
      const key = fields.length === 1 ? model[fields[0]] : `[${fields.map((field) => model[field]).toString()}]`;
      grouped[key] = (grouped[key] || []).concat(model);
    });
    return grouped;
  }
  filterLimit(models) {
    return this.take !== null ? models.slice(this.skip, this.skip + this.take) : models.slice(this.skip);
  }
  load(models) {
    this.eagerLoadRelations(models);
  }
  eagerLoadRelations(models) {
    for (const name in this.eagerLoad)
      this.eagerLoadRelation(models, name, this.eagerLoad[name]);
  }
  eagerLoadRelation(models, name, constraints) {
    const relation = this.getRelation(name);
    const query = this.newQueryForRelation(relation);
    relation.addEagerConstraints(query, models);
    constraints(query);
    relation.match(name, models, query);
  }
  getRelation(name) {
    return this.model.$getRelation(name);
  }
  revive(schema) {
    return isArray(schema) ? this.reviveMany(schema) : this.reviveOne(schema);
  }
  reviveOne(schema) {
    const id = this.model.$getIndexId(schema);
    const item = this.commit("get")[id] ?? null;
    if (!item)
      return null;
    const model = this.hydrate(item);
    this.reviveRelations(model, schema);
    return model;
  }
  reviveMany(schema) {
    return schema.reduce((collection, item) => {
      const model = this.reviveOne(item);
      model && collection.push(model);
      return collection;
    }, []);
  }
  reviveRelations(model, schema) {
    const fields = this.model.$fields();
    for (const key in schema) {
      const attr = fields[key];
      if (!(attr instanceof Relation))
        continue;
      const relatedSchema = schema[key];
      if (!relatedSchema)
        return;
      if (attr instanceof MorphTo) {
        const relatedType = model[attr.getType()];
        model[key] = this.newQuery(relatedType).reviveOne(relatedSchema);
        continue;
      }
      model[key] = isArray(relatedSchema) ? this.newQueryForRelation(attr).reviveMany(relatedSchema) : this.newQueryForRelation(attr).reviveOne(relatedSchema);
    }
  }
  new() {
    const model = this.hydrate({});
    this.commit("insert", this.compile(model));
    return model;
  }
  save(records) {
    let processedData = this.newInterpreter().process(records);
    const modelTypes = this.model.$types();
    if (Object.values(modelTypes).length > 0) {
      const modelTypesKeys = Object.keys(modelTypes);
      const recordsByTypes = {};
      records = isArray(records) ? records : [records];
      records.forEach((record) => {
        const recordType = modelTypesKeys.includes(`${record[this.model.$typeKey()]}`) ? record[this.model.$typeKey()] : modelTypesKeys[0];
        if (!recordsByTypes[recordType])
          recordsByTypes[recordType] = [];
        recordsByTypes[recordType].push(record);
      });
      for (const entry in recordsByTypes) {
        const typeModel = modelTypes[entry];
        if (typeModel.entity === this.model.$entity())
          processedData = this.newInterpreter().process(recordsByTypes[entry]);
        else
          this.newQueryWithConstraints(typeModel.entity).save(recordsByTypes[entry]);
      }
    }
    const [data, entities] = processedData;
    for (const entity in entities) {
      const query = this.newQuery(entity);
      const elements = entities[entity];
      query.saveElements(elements);
    }
    return this.revive(data);
  }
  saveElements(elements) {
    const newData = {};
    const currentData = this.commit("all");
    const afterSavingHooks = [];
    for (const id in elements) {
      const record = elements[id];
      const existing = currentData[id];
      const model = existing ? this.hydrate({ ...existing, ...record }, { operation: "set", action: "update" }) : this.hydrate(record, { operation: "set", action: "save" });
      const isSaving = model.$self().saving(model);
      const isUpdatingOrCreating = existing ? model.$self().updating(model) : model.$self().creating(model);
      if (isSaving === false || isUpdatingOrCreating === false)
        continue;
      afterSavingHooks.push(() => model.$self().saved(model));
      afterSavingHooks.push(() => existing ? model.$self().updated(model) : model.$self().created(model));
      newData[id] = model.$getAttributes();
      if (Object.values(model.$types()).length > 0 && !newData[id][model.$typeKey()])
        newData[id][model.$typeKey()] = record[model.$typeKey()];
    }
    if (Object.keys(newData).length > 0) {
      this.commit("save", newData);
      afterSavingHooks.forEach((hook) => hook());
    }
  }
  insert(records) {
    const models = this.hydrate(records);
    this.commit("insert", this.compile(models));
    return models;
  }
  fresh(records) {
    const models = this.hydrate(records);
    this.commit("fresh", this.compile(models));
    return models;
  }
  update(record) {
    const models = this.get(false);
    if (isEmpty(models))
      return [];
    const newModels = models.map((model) => {
      return this.hydrate({ ...model.$getAttributes(), ...record });
    });
    this.commit("update", this.compile(newModels));
    return newModels;
  }
  destroy(ids) {
    assert(!this.model.$hasCompositeKey(), [
      "You can't use the `destroy` method on a model with a composite key.",
      "Please use `delete` method instead."
    ]);
    return isArray(ids) ? this.destroyMany(ids) : this.destroyOne(ids);
  }
  destroyOne(id) {
    const model = this.find(id);
    if (!model)
      return null;
    const [afterHooks, removeIds] = this.dispatchDeleteHooks(model);
    if (!removeIds.includes(model.$getIndexId())) {
      this.commit("destroy", [model.$getIndexId()]);
      afterHooks.forEach((hook) => hook());
    }
    return model;
  }
  destroyMany(ids) {
    const models = this.find(ids);
    if (isEmpty(models))
      return [];
    const [afterHooks, removeIds] = this.dispatchDeleteHooks(models);
    const checkedIds = this.getIndexIdsFromCollection(models).filter((id) => !removeIds.includes(id));
    this.commit("destroy", checkedIds);
    afterHooks.forEach((hook) => hook());
    return models;
  }
  delete() {
    const models = this.get(false);
    if (isEmpty(models))
      return [];
    const [afterHooks, removeIds] = this.dispatchDeleteHooks(models);
    const ids = this.getIndexIdsFromCollection(models).filter((id) => !removeIds.includes(id));
    this.commit("delete", ids);
    afterHooks.forEach((hook) => hook());
    return models;
  }
  flush() {
    this.commit("flush");
    return this.get(false);
  }
  dispatchDeleteHooks(models) {
    const afterHooks = [];
    const notDeletableIds = [];
    models = isArray(models) ? models : [models];
    models.forEach((currentModel) => {
      const isDeleting = currentModel.$self().deleting(currentModel);
      if (isDeleting === false)
        notDeletableIds.push(currentModel.$getIndexId());
      else
        afterHooks.push(() => currentModel.$self().deleted(currentModel));
    });
    return [afterHooks, notDeletableIds];
  }
  getIndexIdsFromCollection(models) {
    return models.map((model) => model.$getIndexId());
  }
  hydrate(records, options) {
    return isArray(records) ? records.map((record) => this.hydrate(record), options) : this.checkAndGetSTI(records, { relations: false, ...options || {} });
  }
  compile(models) {
    const collection = isArray(models) ? models : [models];
    return collection.reduce((records, model) => {
      records[model.$getIndexId()] = model.$getAttributes();
      return records;
    }, {});
  }
  checkAndGetSTI(record, options) {
    const modelByType = this.model.$types()[record[this.model.$typeKey()]];
    return (modelByType ? modelByType.newRawInstance() : this.model).$newInstance(record, { relations: false, ...options || {} });
  }
}

var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var _map;
class WeakCache {
  constructor() {
    __privateAdd(this, _map, /* @__PURE__ */ new Map());
  }
  has(key) {
    return !!(__privateGet(this, _map).has(key) && __privateGet(this, _map).get(key)?.deref());
  }
  get(key) {
    const weakRef = __privateGet(this, _map).get(key);
    if (!weakRef)
      return void 0;
    const value = weakRef.deref();
    if (value)
      return value;
    __privateGet(this, _map).delete(key);
    return void 0;
  }
  set(key, value) {
    __privateGet(this, _map).set(key, new WeakRef(value));
    return this;
  }
  get size() {
    return __privateGet(this, _map).size;
  }
  clear() {
    __privateGet(this, _map).clear();
  }
  delete(key) {
    __privateGet(this, _map).delete(key);
    return false;
  }
  forEach(cb) {
    for (const [key, value] of this)
      cb(value, key, this);
  }
  *[(Symbol.iterator)]() {
    for (const [key, weakRef] of __privateGet(this, _map)) {
      const ref = weakRef.deref();
      if (!ref) {
        __privateGet(this, _map).delete(key);
        continue;
      }
      yield [key, ref];
    }
  }
  *entries() {
    for (const [key, value] of this)
      yield [key, value];
  }
  *keys() {
    for (const [key] of this)
      yield key;
  }
  *values() {
    for (const [, value] of this)
      yield value;
  }
}
_map = new WeakMap();

const cache = new WeakCache();

const CONFIG_DEFAULTS = {
  model: {
    withMeta: false,
    hidden: ["_meta"],
    visible: ["*"]
  },
  cache: {
    shared: true,
    provider: WeakCache
  }
};
const config = { ...CONFIG_DEFAULTS };

class Repository {
  constructor(database, pinia) {
    this.database = database;
    this.pinia = pinia;
  }
  initialize(model) {
    if (config.cache && config.cache !== true)
      this.queryCache = config.cache.shared ? cache : new config.cache.provider();
    if (model) {
      this.model = model.newRawInstance();
      return this;
    }
    if (this.use) {
      this.model = this.use.newRawInstance();
      return this;
    }
    return this;
  }
  getModel() {
    assert(!!this.model, [
      "The model is not registered. Please define the model to be used at",
      "`use` property of the repository class."
    ]);
    return this.model;
  }
  piniaStore() {
    return useDataStore(this.model.$entity(), this.model.$piniaOptions())(this.pinia);
  }
  repo(modelOrRepository) {
    return useRepo(modelOrRepository);
  }
  query() {
    return new Query(this.database, this.getModel(), this.queryCache, this.pinia);
  }
  cache() {
    return this.queryCache;
  }
  where(field, value) {
    return this.query().where(field, value);
  }
  orWhere(field, value) {
    return this.query().orWhere(field, value);
  }
  whereHas(relation, callback = () => {
  }, operator, count) {
    return this.query().whereHas(relation, callback, operator, count);
  }
  orWhereHas(relation, callback = () => {
  }, operator, count) {
    return this.query().orWhereHas(relation, callback, operator, count);
  }
  has(relation, operator, count) {
    return this.query().has(relation, operator, count);
  }
  orHas(relation, operator, count) {
    return this.query().orHas(relation, operator, count);
  }
  doesntHave(relation) {
    return this.query().doesntHave(relation);
  }
  orDoesntHave(relation) {
    return this.query().orDoesntHave(relation);
  }
  whereDoesntHave(relation, callback = () => {
  }) {
    return this.query().whereDoesntHave(relation, callback);
  }
  orWhereDoesntHave(relation, callback = () => {
  }) {
    return this.query().orWhereDoesntHave(relation, callback);
  }
  withMeta() {
    return this.query().withMeta();
  }
  makeVisible(fields) {
    return this.query().makeVisible(fields);
  }
  makeHidden(fields) {
    return this.query().makeHidden(fields);
  }
  groupBy(...fields) {
    return this.query().groupBy(...fields);
  }
  orderBy(field, direction) {
    return this.query().orderBy(field, direction);
  }
  limit(value) {
    return this.query().limit(value);
  }
  offset(value) {
    return this.query().offset(value);
  }
  with(name, callback) {
    return this.query().with(name, callback);
  }
  withAll(callback) {
    return this.query().withAll(callback);
  }
  withAllRecursive(depth) {
    return this.query().withAllRecursive(depth);
  }
  useCache(key, params) {
    return this.query().useCache(key, params);
  }
  all() {
    return this.query().get();
  }
  find(ids) {
    return this.query().find(ids);
  }
  revive(schema) {
    return this.query().revive(schema);
  }
  make(records) {
    if (isArray(records)) {
      return records.map((record) => this.getModel().$newInstance(record, {
        relations: true
      }));
    }
    return this.getModel().$newInstance(records, {
      relations: true
    });
  }
  save(records) {
    return this.query().save(records);
  }
  new() {
    return this.query().new();
  }
  insert(records) {
    return this.query().insert(records);
  }
  fresh(records) {
    return this.query().fresh(records);
  }
  destroy(ids) {
    return this.query().destroy(ids);
  }
  flush() {
    return this.query().flush();
  }
}
Repository._isRepository = true;

class Database {
  constructor() {
    this.models = {};
  }
  register(model) {
    const entity = model.$entity();
    if (!this.models[entity]) {
      this.models[entity] = model;
      this.registerRelatedModels(model);
    }
  }
  registerRelatedModels(model) {
    const fields = model.$fields();
    for (const name in fields) {
      const attr = fields[name];
      if (attr instanceof Relation) {
        attr.getRelateds().forEach((m) => {
          this.register(m);
        });
      }
    }
  }
  getModel(name) {
    return this.models[name];
  }
}

function useRepo(ModelOrRepository, pinia) {
  const database = new Database();
  const repository = ModelOrRepository._isRepository ? new ModelOrRepository(database, pinia).initialize() : new Repository(database, pinia).initialize(ModelOrRepository);
  try {
    const typeModels = Object.values(repository.getModel().$types());
    if (typeModels.length > 0)
      typeModels.forEach((typeModel) => database.register(typeModel.newRawInstance()));
    else
      database.register(repository.getModel());
  } catch (e) {
  }
  return repository;
}

function mapRepos(modelsOrRepositories) {
  const repositories = {};
  for (const name in modelsOrRepositories) {
    repositories[name] = function() {
      return useRepo(modelsOrRepositories[name]);
    };
  }
  return repositories;
}

function createORM(options) {
  config.model = { ...CONFIG_DEFAULTS.model, ...options?.model };
  config.cache = options?.cache === false ? false : { ...CONFIG_DEFAULTS.cache, ...options?.cache !== true && options?.cache };
  return () => {
  };
}

class Attr extends Type {
  make(value) {
    return value === void 0 ? this.value : value;
  }
}

class String$1 extends Type {
  constructor(model, value) {
    super(model, value);
  }
  make(value) {
    return this.makeReturn("string", value);
  }
}

class Number extends Type {
  constructor(model, value) {
    super(model, value);
  }
  make(value) {
    return this.makeReturn("number", value);
  }
}

class Boolean extends Type {
  constructor(model, value) {
    super(model, value);
  }
  make(value) {
    return this.makeReturn("boolean", value);
  }
}

class HasOne extends Relation {
  constructor(parent, related, foreignKey, localKey) {
    super(parent, related);
    this.foreignKey = foreignKey;
    this.localKey = localKey;
  }
  getRelateds() {
    return [this.related];
  }
  define(schema) {
    return schema.one(this.related, this.parent);
  }
  attach(record, child) {
    child[this.foreignKey] = record[this.localKey];
  }
  addEagerConstraints(query, models) {
    query.whereIn(this.foreignKey, this.getKeys(models, this.localKey));
  }
  match(relation, models, query) {
    const dictionary = this.buildDictionary(query.get(false));
    models.forEach((model) => {
      const key = model[this.localKey];
      dictionary[key] ? model.$setRelation(relation, dictionary[key][0]) : model.$setRelation(relation, null);
    });
  }
  buildDictionary(results) {
    return this.mapToDictionary(results, (result) => {
      return [result[this.foreignKey], result];
    });
  }
  make(element) {
    return element ? this.related.$newInstance(element) : null;
  }
}

class BelongsTo extends Relation {
  constructor(parent, child, foreignKey, ownerKey) {
    super(parent, child);
    this.foreignKey = foreignKey;
    this.ownerKey = ownerKey;
    this.child = child;
  }
  getRelateds() {
    return [this.child];
  }
  define(schema) {
    return schema.one(this.child, this.parent);
  }
  attach(record, child) {
    record[this.foreignKey] = child[this.ownerKey];
  }
  addEagerConstraints(query, models) {
    query.whereIn(this.ownerKey, this.getEagerModelKeys(models));
  }
  getEagerModelKeys(models) {
    return models.reduce((keys, model) => {
      if (model[this.foreignKey] !== null)
        keys.push(model[this.foreignKey]);
      return keys;
    }, []);
  }
  match(relation, models, query) {
    const dictionary = this.buildDictionary(query.get(false));
    models.forEach((model) => {
      const key = model[this.foreignKey];
      dictionary[key] ? model.$setRelation(relation, dictionary[key]) : model.$setRelation(relation, null);
    });
  }
  buildDictionary(models) {
    return models.reduce((dictionary, model) => {
      dictionary[model[this.ownerKey]] = model;
      return dictionary;
    }, {});
  }
  make(element) {
    return element ? this.child.$newInstance(element) : null;
  }
}

class BelongsToMany extends Relation {
  constructor(parent, related, pivot, foreignPivotKey, relatedPivotKey, parentKey, relatedKey) {
    super(parent, related);
    this.pivotKey = "pivot";
    this.pivot = pivot;
    this.foreignPivotKey = foreignPivotKey;
    this.relatedPivotKey = relatedPivotKey;
    this.parentKey = parentKey;
    this.relatedKey = relatedKey;
  }
  getRelateds() {
    return [this.related];
  }
  define(schema) {
    return schema.many(this.related, this.parent);
  }
  attach(record, child) {
    const pivot = child.pivot ?? {};
    pivot[this.foreignPivotKey] = record[this.parentKey];
    pivot[this.relatedPivotKey] = child[this.relatedKey];
    child[`pivot_${this.pivot.$entity()}`] = pivot;
  }
  make(elements) {
    return elements ? elements.map((element) => this.related.$newInstance(element)) : [];
  }
  match(relation, models, query) {
    const relatedModels = query.get(false);
    models.forEach((parentModel) => {
      const relationResults = [];
      relatedModels.forEach((relatedModel) => {
        const key = relatedModel[this.relatedKey];
        const pivot = query.newQuery(this.pivot.$entity()).where(this.relatedPivotKey, key).where(this.foreignPivotKey, parentModel[this.parentKey]).first();
        const relatedModelCopy = _.cloneDeep(relatedModel);
        relatedModelCopy.$setRelation("pivot", pivot);
        if (pivot)
          relationResults.push(relatedModelCopy);
      });
      parentModel.$setRelation(relation, relationResults);
    });
  }
  addEagerConstraints(query, collection) {
    query.database.register(this.pivot);
    const pivotKeys = query.newQuery(this.pivot.$entity()).where(this.foreignPivotKey, this.getKeys(collection, this.parentKey)).get(false).map((item) => item[this.relatedPivotKey]);
    query.whereIn(this.relatedKey, pivotKeys);
  }
}

class HasMany extends Relation {
  constructor(parent, related, foreignKey, localKey) {
    super(parent, related);
    this.foreignKey = foreignKey;
    this.localKey = localKey;
  }
  getRelateds() {
    return [this.related];
  }
  define(schema) {
    return schema.many(this.related, this.parent);
  }
  attach(record, child) {
    child[this.foreignKey] = record[this.localKey];
  }
  addEagerConstraints(query, models) {
    query.whereIn(this.foreignKey, this.getKeys(models, this.localKey));
  }
  match(relation, models, query) {
    const dictionary = this.buildDictionary(query.get(false));
    models.forEach((model) => {
      const key = model[this.localKey];
      dictionary[key] ? model.$setRelation(relation, dictionary[key]) : model.$setRelation(relation, []);
    });
  }
  buildDictionary(results) {
    return this.mapToDictionary(results, (result) => {
      return [result[this.foreignKey], result];
    });
  }
  make(elements) {
    return elements ? elements.map((element) => this.related.$newInstance(element)) : [];
  }
}

class HasManyBy extends Relation {
  constructor(parent, child, foreignKey, ownerKey) {
    super(parent, child);
    this.foreignKey = foreignKey;
    this.ownerKey = ownerKey;
    this.child = child;
  }
  getRelateds() {
    return [this.child];
  }
  define(schema) {
    return schema.many(this.child, this.parent);
  }
  attach(record, child) {
    if (child[this.ownerKey] === void 0)
      return;
    if (!record[this.foreignKey])
      record[this.foreignKey] = [];
    this.attachIfMissing(record[this.foreignKey], child[this.ownerKey]);
  }
  attachIfMissing(foreignKey, ownerKey) {
    if (!foreignKey.includes(ownerKey))
      foreignKey.push(ownerKey);
  }
  addEagerConstraints(query, models) {
    query.whereIn(this.ownerKey, this.getEagerModelKeys(models));
  }
  getEagerModelKeys(models) {
    return models.reduce((keys, model) => {
      return [...keys, ...model[this.foreignKey]];
    }, []);
  }
  match(relation, models, query) {
    const dictionary = this.buildDictionary(query.get(false));
    models.forEach((model) => {
      const relatedModels = this.getRelatedModels(
        dictionary,
        model[this.foreignKey]
      );
      model.$setRelation(relation, relatedModels);
    });
  }
  buildDictionary(models) {
    return models.reduce((dictionary, model) => {
      dictionary[model[this.ownerKey]] = model;
      return dictionary;
    }, {});
  }
  getRelatedModels(dictionary, keys) {
    return keys.reduce((items, key) => {
      const item = dictionary[key];
      item && items.push(item);
      return items;
    }, []);
  }
  make(elements) {
    return elements ? elements.map((element) => this.child.$newInstance(element)) : [];
  }
}

class MorphOne extends Relation {
  constructor(parent, related, morphId, morphType, localKey) {
    super(parent, related);
    this.morphId = morphId;
    this.morphType = morphType;
    this.localKey = localKey;
  }
  getRelateds() {
    return [this.related];
  }
  define(schema) {
    return schema.one(this.related, this.parent);
  }
  attach(record, child) {
    child[this.morphId] = record[this.localKey];
    child[this.morphType] = this.parent.$entity();
  }
  addEagerConstraints(query, models) {
    query.where(this.morphType, this.parent.$entity()).whereIn(this.morphId, this.getKeys(models, this.localKey));
  }
  match(relation, models, query) {
    const dictionary = this.buildDictionary(query.get(false));
    models.forEach((model) => {
      const key = model[this.localKey];
      dictionary[key] ? model.$setRelation(relation, dictionary[key]) : model.$setRelation(relation, null);
    });
  }
  buildDictionary(models) {
    return models.reduce((dictionary, model) => {
      dictionary[model[this.morphId]] = model;
      return dictionary;
    }, {});
  }
  make(element) {
    return element ? this.related.$newInstance(element) : null;
  }
}

class MorphMany extends Relation {
  constructor(parent, related, morphId, morphType, localKey) {
    super(parent, related);
    this.morphId = morphId;
    this.morphType = morphType;
    this.localKey = localKey;
  }
  getRelateds() {
    return [this.related];
  }
  define(schema) {
    return schema.many(this.related, this.parent);
  }
  attach(record, child) {
    child[this.morphId] = record[this.localKey];
    child[this.morphType] = this.parent.$entity();
  }
  addEagerConstraints(query, models) {
    query.where(this.morphType, this.parent.$entity());
    query.whereIn(this.morphId, this.getKeys(models, this.localKey));
  }
  match(relation, models, query) {
    const dictionary = this.buildDictionary(query.get(false));
    models.forEach((model) => {
      const key = model[this.localKey];
      dictionary[key] ? model.$setRelation(relation, dictionary[key]) : model.$setRelation(relation, []);
    });
  }
  buildDictionary(results) {
    return this.mapToDictionary(results, (result) => {
      return [result[this.morphId], result];
    });
  }
  make(elements) {
    return elements ? elements.map((element) => this.related.$newInstance(element)) : [];
  }
}

class Model {
  constructor(attributes, options = { operation: "set" }) {
    this.$boot();
    const fill = options.fill ?? true;
    fill && this.$fill(attributes, options);
  }
  static fields() {
    return {};
  }
  static initializeSchema() {
    this.schemas[this.entity] = {};
    const registry = {
      ...this.fields(),
      ...this.registries[this.entity]
    };
    for (const key in registry) {
      const attribute = registry[key];
      this.schemas[this.entity][key] = typeof attribute === "function" ? attribute() : attribute;
    }
  }
  static setRegistry(key, attribute) {
    if (!this.registries[this.entity])
      this.registries[this.entity] = {};
    this.registries[this.entity][key] = attribute;
    return this;
  }
  static setMutator(key, mutator) {
    this.fieldMutators[key] = mutator;
    return this;
  }
  static setCast(key, to) {
    this.fieldCasts[key] = to;
    return this;
  }
  static setHidden(key) {
    this.hidden.push(key);
    return this;
  }
  static clearBootedModels() {
    this.booted = {};
    this.schemas = {};
    this.fieldMutators = {};
    this.fieldCasts = {};
    this.hidden = [];
    this.visible = [];
  }
  static clearRegistries() {
    this.registries = {};
  }
  static newRawInstance() {
    return new this(void 0, { fill: false });
  }
  static attr(value) {
    return new Attr(this.newRawInstance(), value);
  }
  static string(value) {
    return new String$1(this.newRawInstance(), value);
  }
  static number(value) {
    return new Number(this.newRawInstance(), value);
  }
  static boolean(value) {
    return new Boolean(this.newRawInstance(), value);
  }
  static uid(size) {
    return new Uid(this.newRawInstance(), size);
  }
  static hasOne(related, foreignKey, localKey) {
    const model = this.newRawInstance();
    localKey = localKey ?? model.$getLocalKey();
    return new HasOne(model, related.newRawInstance(), foreignKey, localKey);
  }
  static belongsTo(related, foreignKey, ownerKey) {
    const instance = related.newRawInstance();
    ownerKey = ownerKey ?? instance.$getLocalKey();
    return new BelongsTo(this.newRawInstance(), instance, foreignKey, ownerKey);
  }
  static belongsToMany(related, pivot, foreignPivotKey, relatedPivotKey, parentKey, relatedKey) {
    const instance = related.newRawInstance();
    const model = this.newRawInstance();
    const pivotInstance = pivot.newRawInstance();
    parentKey = parentKey ?? model.$getLocalKey();
    relatedKey = relatedKey ?? instance.$getLocalKey();
    this.schemas[related.entity][`pivot_${pivotInstance.$entity()}`] = new HasOne(instance, pivotInstance, relatedPivotKey, relatedKey);
    return new BelongsToMany(
      model,
      instance,
      pivotInstance,
      foreignPivotKey,
      relatedPivotKey,
      parentKey,
      relatedKey
    );
  }
  static hasMany(related, foreignKey, localKey) {
    const model = this.newRawInstance();
    localKey = localKey ?? model.$getLocalKey();
    return new HasMany(model, related.newRawInstance(), foreignKey, localKey);
  }
  static hasManyBy(related, foreignKey, ownerKey) {
    const instance = related.newRawInstance();
    ownerKey = ownerKey ?? instance.$getLocalKey();
    return new HasManyBy(this.newRawInstance(), instance, foreignKey, ownerKey);
  }
  static morphOne(related, id, type, localKey) {
    const model = this.newRawInstance();
    localKey = localKey ?? model.$getLocalKey();
    return new MorphOne(model, related.newRawInstance(), id, type, localKey);
  }
  static morphTo(related, id, type, ownerKey = "") {
    const instance = this.newRawInstance();
    const relatedModels = related.map((model) => model.newRawInstance());
    return new MorphTo(instance, relatedModels, id, type, ownerKey);
  }
  static morphMany(related, id, type, localKey) {
    const model = this.newRawInstance();
    localKey = localKey ?? model.$getLocalKey();
    return new MorphMany(model, related.newRawInstance(), id, type, localKey);
  }
  static mutators() {
    return {};
  }
  static casts() {
    return {};
  }
  static types() {
    return {};
  }
  $self() {
    return this.constructor;
  }
  $entity() {
    return this.$self().entity;
  }
  $config() {
    return this.$self().config;
  }
  $baseEntity() {
    return this.$self().baseEntity ?? this.$entity();
  }
  $typeKey() {
    return this.$self().typeKey;
  }
  $types() {
    return this.$self().types();
  }
  $piniaOptions() {
    return this.$self().piniaOptions;
  }
  $primaryKey() {
    return this.$self().primaryKey;
  }
  $fields() {
    return this.$self().schemas[this.$entity()];
  }
  $hidden() {
    return this.$self().hidden;
  }
  $visible() {
    return this.$self().visible;
  }
  $newInstance(attributes, options) {
    const Self = this.$self();
    return new Self(attributes, options);
  }
  $boot() {
    if (!this.$self().booted[this.$entity()]) {
      this.$self().booted[this.$entity()] = true;
      this.$initializeSchema();
    }
  }
  $initializeSchema() {
    this.$self().initializeSchema();
  }
  $casts() {
    return {
      ...this.$getCasts(),
      ...this.$self().fieldCasts
    };
  }
  $fill(attributes = {}, options = {}) {
    const operation = options.operation ?? "get";
    const modelConfig = {
      ...config.model,
      ...this.$config()
    };
    modelConfig.withMeta && (this.$self().schemas[this.$entity()][this.$self().metaKey] = this.$self().attr({}));
    const fields = this.$fields();
    const fillRelation = options.relations ?? true;
    const mutators = {
      ...this.$getMutators(),
      ...this.$self().fieldMutators
    };
    for (const key in fields) {
      if (operation === "get" && !this.isFieldVisible(key, this.$hidden(), this.$visible(), options))
        continue;
      const attr = fields[key];
      let value = attributes[key];
      if (attr instanceof Relation && !fillRelation)
        continue;
      const mutator = mutators?.[key];
      const cast = this.$casts()[key]?.newRawInstance(fields);
      if (mutator && operation === "get") {
        value = typeof mutator === "function" ? mutator(value) : typeof mutator.get === "function" ? mutator.get(value) : value;
      }
      if (cast && operation === "get")
        value = cast.get(value);
      let keyValue = this.$fillField(key, attr, value);
      if (mutator && typeof mutator !== "function" && operation === "set" && mutator.set)
        keyValue = mutator.set(keyValue);
      if (cast && operation === "set")
        keyValue = cast.set(keyValue);
      this[key] = this[key] ?? keyValue;
    }
    modelConfig.withMeta && operation === "set" && this.$fillMeta(options.action);
    return this;
  }
  $fillMeta(action = "save") {
    const timestamp = Math.floor(Date.now() / 1e3);
    if (action === "save") {
      this[this.$self().metaKey] = {
        createdAt: timestamp,
        updatedAt: timestamp
      };
    }
    if (action === "update")
      this[this.$self().metaKey].updatedAt = timestamp;
  }
  $fillField(key, attr, value) {
    if (value !== void 0) {
      return attr instanceof MorphTo ? attr.setKey(key).make(value, this[attr.getType()]) : attr.setKey(key).make(value);
    }
    if (this[key] === void 0)
      return attr.setKey(key).make();
  }
  isFieldVisible(key, modelHidden, modelVisible, options) {
    const hidden = modelHidden.length > 0 ? modelHidden : config.model.hidden ?? [];
    const visible = [...modelVisible.length > 0 ? modelVisible : config.model.visible ?? ["*"], String(this.$primaryKey())];
    const optionsVisible = options.visible ?? [];
    const optionsHidden = options.hidden ?? [];
    if ((hidden.includes("*") || hidden.includes(key)) && !optionsVisible.includes(key) || optionsHidden.includes(key))
      return false;
    return (visible.includes("*") || visible.includes(key)) && !optionsHidden.includes(key) || optionsVisible.includes(key);
  }
  $getKeyName() {
    return this.$primaryKey();
  }
  $getKey(record) {
    record = record ?? this;
    if (this.$hasCompositeKey())
      return this.$getCompositeKey(record);
    const id = record[this.$getKeyName()];
    return isNullish(id) ? null : id;
  }
  $hasCompositeKey() {
    return isArray(this.$getKeyName());
  }
  $getCompositeKey(record) {
    let ids = [];
    this.$getKeyName().every((key) => {
      const id = record[key];
      if (isNullish(id)) {
        ids = null;
        return false;
      }
      ids.push(id);
      return true;
    });
    return ids === null ? null : ids;
  }
  $getIndexId(record) {
    const target = record ?? this;
    const id = this.$getKey(target);
    assert(id !== null, [
      "The record is missing the primary key. If you want to persist record",
      "without the primary key, please define the primary key field with the",
      "`uid` attribute."
    ]);
    return this.$stringifyId(id);
  }
  $stringifyId(id) {
    return isArray(id) ? JSON.stringify(id) : String(id);
  }
  $getLocalKey() {
    assert(!this.$hasCompositeKey(), [
      "Please provide the local key for the relationship. The model with the",
      "composite key can't infer its local key."
    ]);
    return this.$getKeyName();
  }
  $getRelation(name) {
    let relation = this.$fields()[name];
    const typeModels = Object.values(this.$types());
    typeModels.forEach((typeModel) => {
      if (relation === void 0)
        relation = typeModel.fields()[name];
    });
    assert(relation instanceof Relation, [
      `Relationship [${name}] on model [${this.$entity()}] not found.`
    ]);
    return relation;
  }
  $setRelation(relation, model) {
    if (relation.includes("pivot")) {
      this.pivot = model;
      return this;
    }
    if (this.$fields()[relation])
      this[relation] = model;
    return this;
  }
  $getMutators() {
    return this.$self().mutators();
  }
  $getCasts() {
    return this.$self().casts();
  }
  $getAttributes() {
    return this.$toJson(this, { relations: false });
  }
  $toJson(model, options = {}) {
    model = model ?? this;
    const fields = model.$fields();
    const withRelation = options.relations ?? true;
    const record = {};
    for (const key in fields) {
      const attr = fields[key];
      const value = model[key];
      if (!(attr instanceof Relation)) {
        record[key] = this.serializeValue(value);
        continue;
      }
      if (withRelation)
        record[key] = this.serializeRelation(value);
    }
    return record;
  }
  serializeValue(value) {
    if (value === null)
      return null;
    if (isArray(value))
      return this.serializeArray(value);
    if (typeof value === "object")
      return this.serializeObject(value);
    return value;
  }
  serializeArray(value) {
    return value.map((v) => this.serializeValue(v));
  }
  serializeObject(value) {
    const obj = {};
    for (const key in value)
      obj[key] = this.serializeValue(value[key]);
    return obj;
  }
  serializeRelation(relation) {
    if (relation === void 0)
      return void 0;
    if (relation === null)
      return null;
    return isArray(relation) ? relation.map((model) => model.$toJson()) : relation.$toJson();
  }
}
Model.primaryKey = "id";
Model.metaKey = "_meta";
Model.hidden = ["_meta"];
Model.visible = [];
Model.typeKey = "type";
Model.schemas = {};
Model.registries = {};
Model.piniaOptions = {};
Model.fieldMutators = {};
Model.fieldCasts = {};
Model.booted = {};
Model.saving = () => {
};
Model.updating = () => {
};
Model.creating = () => {
};
Model.deleting = () => {
};
Model.retrieved = () => {
};
Model.saved = () => {
};
Model.updated = () => {
};
Model.created = () => {
};
Model.deleted = () => {
};

export { Attribute, Database, Interpreter, Model, Query, Repository, Schema, Type, createORM, mapRepos, useDataStore, useRepo, useStoreActions };
