---
title: 'whereNotNull()'
description: 'Add a where clause to get all results where `field` is not null'
---

# `where()`

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

console.log(userRepo.whereNotNull('age').get()) // User[] - where age property is not null

````

## Typescript Declarations

````ts
function whereNotNull(
  field: string,
): Query
````
