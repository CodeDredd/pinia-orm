'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function Attr(value) {
  return (target, propertyKey) => {
    const self = target.$self();
    self.setRegistry(propertyKey, () => self.attr(value));
  };
}

function Str(value, options = {}) {
  return (target, propertyKey) => {
    const self = target.$self();
    self.setRegistry(propertyKey, () => {
      const attr = self.string(value);
      if (options.notNullable)
        attr.notNullable();
      return attr;
    });
  };
}

function Num(value, options = {}) {
  return (target, propertyKey) => {
    const self = target.$self();
    self.setRegistry(propertyKey, () => {
      const attr = self.number(value);
      if (options.notNullable)
        attr.notNullable();
      return attr;
    });
  };
}

function Bool(value, options = {}) {
  return (target, propertyKey) => {
    const self = target.$self();
    self.setRegistry(propertyKey, () => {
      const attr = self.boolean(value);
      if (options.notNullable)
        attr.notNullable();
      return attr;
    });
  };
}

function Uid() {
  return (target, propertyKey) => {
    const self = target.$self();
    self.setRegistry(propertyKey, () => self.uid());
  };
}

function HasOne(related, foreignKey, localKey) {
  return (target, propertyKey) => {
    const self = target.$self();
    self.setRegistry(
      propertyKey,
      () => self.hasOne(related(), foreignKey, localKey)
    );
  };
}

function BelongsTo(related, foreignKey, ownerKey) {
  return (target, propertyKey) => {
    const self = target.$self();
    self.setRegistry(
      propertyKey,
      () => self.belongsTo(related(), foreignKey, ownerKey)
    );
  };
}

function BelongsToMany(related, pivot, foreignPivotKey, relatedPivotKey, parentKey, relatedKey) {
  return (target, propertyKey) => {
    const self = target.$self();
    self.setRegistry(
      propertyKey,
      () => self.belongsToMany(related(), pivot(), foreignPivotKey, relatedPivotKey, parentKey, relatedKey)
    );
  };
}

function HasMany(related, foreignKey, localKey) {
  return (target, propertyKey) => {
    const self = target.$self();
    self.setRegistry(
      propertyKey,
      () => self.hasMany(related(), foreignKey, localKey)
    );
  };
}

function HasManyBy(related, foreignKey, ownerKey) {
  return (target, propertyKey) => {
    const self = target.$self();
    self.setRegistry(
      propertyKey,
      () => self.hasManyBy(related(), foreignKey, ownerKey)
    );
  };
}

function MorphOne(related, id, type, localKey) {
  return (target, propertyKey) => {
    const self = target.$self();
    self.setRegistry(
      propertyKey,
      () => self.morphOne(related(), id, type, localKey)
    );
  };
}

function MorphTo(related, id, type, ownerKey) {
  return (target, propertyKey) => {
    const self = target.$self();
    self.setRegistry(
      propertyKey,
      () => self.morphTo(related(), id, type, ownerKey)
    );
  };
}

function MorphMany(related, id, type, localKey) {
  return (target, propertyKey) => {
    const self = target.$self();
    self.setRegistry(
      propertyKey,
      () => self.morphMany(related(), id, type, localKey)
    );
  };
}

function Cast(to) {
  return (target, propertyKey) => {
    const self = target.$self();
    self.setCast(propertyKey, to());
  };
}

function Mutate(get, set) {
  return (target, propertyKey) => {
    const self = target.$self();
    self.setMutator(propertyKey, { get, set });
  };
}

function Hidden() {
  return (target, propertyKey) => {
    const self = target.$self();
    self.setHidden(propertyKey);
  };
}

function NonEnumerable(target, propertyKey) {
  const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || /* @__PURE__ */ Object.create(null);
  if (descriptor.enumerable !== false) {
    Object.defineProperty(target, propertyKey, {
      enumerable: false,
      set(value) {
        Object.defineProperty(this, propertyKey, {
          enumerable: false,
          writable: true,
          value
        });
      }
    });
  }
}

exports.Attr = Attr;
exports.BelongsTo = BelongsTo;
exports.BelongsToMany = BelongsToMany;
exports.Bool = Bool;
exports.Cast = Cast;
exports.HasMany = HasMany;
exports.HasManyBy = HasManyBy;
exports.HasOne = HasOne;
exports.Hidden = Hidden;
exports.MorphMany = MorphMany;
exports.MorphOne = MorphOne;
exports.MorphTo = MorphTo;
exports.Mutate = Mutate;
exports.NonEnumerable = NonEnumerable;
exports.Num = Num;
exports.Str = Str;
exports.Uid = Uid;
