---
title: 'whereIn()'
description: 'Add a "where in" clause to the query.'
---

# `whereIn()`

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

// Filter by array
console.log(userRepo.query().whereIn('commentIds', [1,2,5]).get())
// Filter by Set
console.log(userRepo.query().whereIn('commentIds', new Set([1,2,5])).get())

````

## Typescript Declarations

````ts
function whereIn(field: string, values: any[]|Set): Query
````
