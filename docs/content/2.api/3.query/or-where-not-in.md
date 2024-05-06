---
title: 'orWhereNotIn()'
description: 'Add a "or where not in" clause to the query.'
---

# `orWhereNotIn()`

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

// Filter by array
console.log(userRepo.orWhereNotIn('commentIds', [1,2,5]).get())
// Filter by Set
console.log(userRepo.orWhereNotIn('commentIds', new Set([1,2,5])).get())

````

## Typescript Declarations

````ts
function orWhereNotIn(field: string, values: any[]|Set): Query
````
