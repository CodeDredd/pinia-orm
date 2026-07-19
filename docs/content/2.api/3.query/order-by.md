---
title: 'orderBy()'
description: 'Set the "orderBy" value of the query.'
---

# `orderBy()`

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

// Order users by name.
useRepo(User).orderBy('name').get()

// You may also chain orderBy.
useRepo(User)
  .orderBy('name')
  .orderBy('age', 'desc')
  .get()

// Sort user name by its third character.
useRepo(User).orderBy(user => user.name[2]).get()

// Sort user names case insensitive.
useRepo(User).orderBy('name', 'asc', 'SORT_FLAG_CASE').get()

// Sort user names locale aware with an Intl.Collator,
// e.g. for Lithuanian: A, B, Š, T, U instead of A, B, T, U, Š.
useRepo(User).orderBy('name', 'asc', new Intl.Collator('lt')).get()
````

The optional third argument accepts either one of the sort flags (`'SORT_REGULAR'`, `'SORT_FLAG_CASE'`) or any [`Intl.Collator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator) instance. A collator is used to compare string values, which enables locale aware sorting as well as options like numeric ordering (`new Intl.Collator(undefined, { numeric: true })`).

## Typescript Declarations

````ts
function orderBy(field: OrderBy, direction: OrderDirection = 'asc', flags: SortComparator = 'SORT_REGULAR'): Query

type SortComparator = 'SORT_REGULAR' | 'SORT_FLAG_CASE' | Intl.Collator
````
