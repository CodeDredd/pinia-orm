---
title: 'whereNull()'
description: 'Add a where clause to get all results where `field` is null'
---

# `where()`

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

console.log(userRepo.whereNull('age').get()) // User[] - with age set to null

````

## Typescript Declarations

````ts
function whereNull(
  field: string,
): Query
````
