---
title: 'useCollect()'
description: 'This wrapper gives a collection a lot of helper functions'
---

# `useCollect()`

For Details what each function can do, look at the separate composable for it e.g. `min` -> `useMin`

## Usage

````ts
import { useRepo } from 'pinia-orm'
import { useCollect } from 'pinia-orm/dist/helpers'
import User from './models/User'

const users = useRepo(User).all()

// order a collection by 'name' attributes
useCollect(users).orderBy('name')
// get the min of the 'age' attribute
useCollect(users).min('age')
// get the max of the 'age' attribute
useCollect(users).max('age')
// get the sum of the 'age' attribute
useCollect(users).sum('age')
// sort by 'age' attribute
useCollect(users).sortBy('age')
// get all values in 'age' attribute
useCollect(users).pluck('age')
// get all primary keys
useCollect(users).keys()
````

## Type Declaration

````ts
export interface UseCollect<M extends Model = Model> {
  sum: (field: string) => number
  min: (field: string) => number
  max: (field: string) => number
  pluck: (field: string) => any[]
  groupBy: (fields: string[] | string) => Record<string, Collection<M>>
  sortBy: (sort: sorting<M>, flags?: SortFlags) => M[]
  keys: () => string[]
}

export function useCollect<M extends Model = Model>(models: Collection<M>): UseCollect<M>
````
