---
title: 'has()'
description: 'Add a "has" clause to the query.'
---

# `has()`

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

// Retrieve all posts that have at least one comment.
useRepo(User).has('comments').get()
// Retrieve all posts that have at least 2 comments.
useRepo(User).has('comments', 2).get()
// Retrieve all posts that have more than 2 comments.
useRepo(User).has('comments', '>', 2).get()
````

## Typescript Declarations

````ts
function has(relation: string, operator?: string | number, count?: number): Query
````
