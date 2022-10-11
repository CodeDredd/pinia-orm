function compareWithOperator(leftValue, rightValue, operator) {
  switch (operator) {
    case ">":
      return leftValue > rightValue;
    case ">=":
      return leftValue >= rightValue;
    case "<":
      return leftValue < rightValue;
    case "<=":
      return leftValue <= rightValue;
    case "=":
      return leftValue === rightValue;
    case "!=":
      return leftValue !== rightValue;
    default:
      return leftValue === rightValue;
  }
}
function isNullish(value) {
  return value === void 0 || value === null;
}
function isArray(value) {
  return Array.isArray(value);
}
function isFunction(value) {
  return typeof value === "function";
}
function isEmpty(collection) {
  return size(collection) === 0;
}
function size(collection) {
  return isArray(collection) ? collection.length : Object.keys(collection).length;
}
function orderBy(collection, iteratees, directions) {
  let index = -1;
  const result = collection.map((value) => {
    const criteria = iteratees.map((iteratee) => {
      return typeof iteratee === "function" ? iteratee(value) : value[iteratee];
    });
    return { criteria, index: ++index, value };
  });
  return baseSortBy(result, (object, other) => {
    return compareMultiple(object, other, directions);
  });
}
function baseSortBy(array, comparer) {
  let length = array.length;
  array.sort(comparer);
  const newArray = [];
  while (length--)
    newArray[length] = array[length].value;
  return newArray;
}
function compareMultiple(object, other, directions) {
  let index = -1;
  const objCriteria = object.criteria;
  const othCriteria = other.criteria;
  const length = objCriteria.length;
  while (++index < length) {
    const result = compareAscending(objCriteria[index], othCriteria[index]);
    if (result) {
      const direction = directions[index];
      return result * (direction === "desc" ? -1 : 1);
    }
  }
  return object.index - other.index;
}
function compareAscending(value, other) {
  if (value !== other) {
    const valIsDefined = value !== void 0;
    const valIsNull = value === null;
    const valIsReflexive = value === value;
    const othIsDefined = other !== void 0;
    const othIsNull = other === null;
    if (typeof value !== "number" || typeof other !== "number") {
      value = String(value);
      other = String(other);
    }
    if (!othIsNull && value > other || valIsNull && othIsDefined || !valIsDefined || !valIsReflexive)
      return 1;
    return -1;
  }
  return 0;
}
function groupBy(collection, iteratee) {
  return collection.reduce((records, record) => {
    const key = iteratee(record);
    if (records[key] === void 0)
      records[key] = [];
    records[key].push(record);
    return records;
  }, {});
}
function throwError(message) {
  throw new Error(["[Pinia ORM]"].concat(message).join(" "));
}
function assert(condition, message) {
  if (!condition)
    throwError(message);
}
function generateId(size2, urlAlphabet) {
  let id = "";
  let i = size2;
  while (i--) {
    id += urlAlphabet[Math.random() * 64 | 0];
  }
  return id;
}
function generateKey(key, params) {
  const keyValues = params ? { key, params } : { key };
  const stringifiedKey = JSON.stringify(keyValues);
  return typeof process === "undefined" ? btoa(stringifiedKey) : Buffer !== void 0 ? Buffer.from(stringifiedKey, "utf8").toString("base64") : stringifiedKey;
}
function getValue(obj, keys) {
  keys = typeof keys === "string" ? keys.split(".") : keys;
  const key = keys.shift();
  if (obj && obj.hasOwnProperty(key) && keys.length === 0)
    return obj[key];
  else if (!obj || !obj.hasOwnProperty(key))
    return obj;
  else
    return getValue(obj[key], keys);
}

export { assert as a, isArray as b, compareWithOperator as c, generateKey as d, isEmpty as e, groupBy as f, generateId as g, isFunction as h, isNullish as i, getValue as j, orderBy as o, throwError as t };
