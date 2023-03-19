---
title: 'update()'
description: 'Update the record matching the query chain.'
---

# `update()`

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

// update all records by query with the given properties
userRepo.where('name', 'Jane Doe').update({ age: 50 })
````

## Typescript Declarations

````ts
function update(record: Element): Collection<M>
````
