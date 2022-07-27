---
title: 'whereDoesntHave()'
description: 'Add a "where doesnt have" clause to the query.'
---

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

// Retrieve all posts that doesnt have comment from userId 1.
useRepo(Post).whereDoesntHave('comments', (query) => {
  query.where('userId', 1)
}).get()
````

## Typescript Declarations

````ts
function whereDoesntHave(
    relation: string, 
    callback: EagerLoadConstraint = () => {}
): Query
````
