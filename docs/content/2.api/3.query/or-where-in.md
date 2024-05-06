---
title: 'orWhereIn()'
description: 'Add a "or where in" clause to the query.'
---

# `orWhereIn()`

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

// Filter by array
console.log(userRepo.orWhereIn('commentIds', [1,2,5]).get())
// Filter by Set
console.log(userRepo.orWhereIn('commentIds', new Set([1,2,5])).get())

````

## Typescript Declarations

````ts
function orWhereIn(field: string, values: any[]|Set): Query
````
