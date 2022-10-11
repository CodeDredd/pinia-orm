import { j as getValue, o as orderBy } from './shared/pinia-orm.c0f71df4.mjs';

function useSum(models, field) {
  return models.reduce((sum, item) => {
    if (typeof item[field] === "number")
      sum += item[field];
    return sum;
  }, 0);
}

function usePluck(models, field) {
  return models.map((model) => getValue(model, field)).filter((item) => item);
}

function useMax(models, field) {
  const numbers = usePluck(models, field).filter((item) => typeof item === "number");
  return numbers.length === 0 ? 0 : Math.max(...numbers);
}

function useMin(models, field) {
  const numbers = usePluck(models, field).filter((item) => typeof item === "number");
  return numbers.length === 0 ? 0 : Math.min(...numbers);
}

function useKeys(models) {
  return models.map((model) => model[model.$getLocalKey()]);
}

function useGroupBy(models, fields) {
  const grouped = {};
  const props = Array.isArray(fields) ? fields : [fields];
  models.forEach((model) => {
    const key = props.length === 1 ? model[props[0]] : `[${props.map((field) => model[field]).toString()}]`;
    grouped[key] = (grouped[key] || []).concat(model);
  });
  return grouped;
}

function useSortBy(collection, sort) {
  const directions = [];
  const iteratees = [];
  typeof sort === "function" && iteratees.push(sort) && directions.push("asc");
  Array.isArray(sort) && sort.forEach((item) => iteratees.push(item[0]) && directions.push(item[1]));
  iteratees.length === 0 && iteratees.push(sort);
  return orderBy(collection, iteratees, directions);
}

function useCollect(models) {
  return {
    sum: (field) => useSum(models, field),
    min: (field) => useMin(models, field),
    max: (field) => useMax(models, field),
    pluck: (field) => usePluck(models, field),
    groupBy: (fields) => useGroupBy(models, fields),
    sortBy: (sort) => useSortBy(models, sort),
    keys: () => useKeys(models)
  };
}

export { useCollect, useGroupBy, useKeys, useMax, useMin, usePluck, useSum };
