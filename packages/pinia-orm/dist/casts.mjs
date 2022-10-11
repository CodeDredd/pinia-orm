import { C as CastAttribute } from './shared/pinia-orm.4d1655c0.mjs';

class ArrayCast extends CastAttribute {
  constructor(attributes) {
    super(attributes);
  }
  get(value) {
    return typeof value !== "string" ? value : JSON.parse(value);
  }
  set(value) {
    return JSON.stringify(value);
  }
}

class StringCast extends CastAttribute {
  constructor(attributes) {
    super(attributes);
  }
  get(value) {
    return typeof value === "string" || value === void 0 || value === null ? value : `${value}`;
  }
  set(value) {
    return this.get(value);
  }
}

class BooleanCast extends CastAttribute {
  constructor(attributes) {
    super(attributes);
  }
  get(value) {
    if (typeof value === "boolean" || value === void 0 || value === null)
      return value;
    if (typeof value === "string") {
      if (value.length === 0)
        return false;
      const int = parseInt(value, 0);
      return isNaN(int) ? true : !!int;
    }
    if (typeof value === "number")
      return !!value;
    return false;
  }
  set(value) {
    return this.get(value);
  }
}

class NumberCast extends CastAttribute {
  constructor(attributes) {
    super(attributes);
  }
  get(value) {
    if (typeof value === "number" || value === void 0 || value === null)
      return value;
    if (typeof value === "string")
      return parseFloat(value);
    if (typeof value === "boolean")
      return value ? 1 : 0;
    return 0;
  }
  set(value) {
    return this.get(value);
  }
}

export { ArrayCast, BooleanCast, NumberCast, StringCast };
