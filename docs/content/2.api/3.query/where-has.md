---
title: 'whereHas()'
description: 'Add a "where has" clause to the query.'
---

# `whereHas()`

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

// Retrieve all posts that have comment from userId 1.
useRepo(Post).whereHas('comments', (query) => {
  query.where('userId', 1)
}).get()
````

## Typescript Declarations

````ts
function whereHas(
    relation: string, 
    callback: EagerLoadConstraint = () => {}, 
    operator?: string | number, 
    count?: number
): Query
````
