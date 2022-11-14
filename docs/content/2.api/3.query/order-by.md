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
````

## Typescript Declarations

````ts
function orderBy(field: OrderBy, direction: OrderDirection = 'asc'): Query
````
