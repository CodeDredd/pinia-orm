---
title: 'whereNotIn()'
description: 'Add a "where not in" clause to the query.'
---

# `whereNotIn()`

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

// Filter by array
console.log(userRepo.whereNotIn('commentIds', [1,2,5]).get())
// Filter by Set
console.log(userRepo.whereNotIn('commentIds', new Set([1,2,5])).get())

````

## Typescript Declarations

````ts
function whereNotIn(field: string, values: any[]|Set): Query
````
