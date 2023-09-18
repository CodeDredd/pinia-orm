---
title: 'useSortBy()'
description: 'Sorts the collection by a given key'
---

# `useSortBy()`

## Usage

````ts
import { useRepo } from 'pinia-orm'
import { useSortBy } from 'pinia-orm/helpers'
import User from './models/User'

const users = useRepo(User).all()

// sort by the 'name' attribute
useSortBy(users, 'name')

// sort by the `name` attribute case insensitive
useSortBy(users, 'name', 'SORT_FLAG_CASE')

// sorts the collection by 'name' descending and then by 'lastname' ascending
useSortBy(users, [
    ['name', 'desc'],
    ['lastname', 'asc'],
])

// sort by the 'age' attribute
useSortBy(users, (model) => model.age)

````

## Type Declaration

````ts
export type sorting<T> = ((record: T) => any) | string | [string, 'asc' | 'desc'][]
export type SortFlags = 'SORT_REGULAR' | 'SORT_FLAG_CASE'

export function useSortBy<T>(collection: T[], sort: sorting<T>, flags?: SortFlags): T[]
````
