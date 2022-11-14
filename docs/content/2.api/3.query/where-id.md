---
title: 'whereId()'
description: 'Add a where clause on the primary key to the query.'
---

# `whereId()`

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

console.log(userRepo.whereId(1).get()) // User[]
console.log(userRepo.whereId([1,2,5]).get()) // User[]

````

## Typescript Declarations

````ts
function whereId(ids: string | number | (string | number)[]): Query
````
