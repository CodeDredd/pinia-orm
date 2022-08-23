---
title: 'whereIn()'
description: 'Add a "where in" clause to the query.'
---

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

console.log(userRepo.whereIn('commentIds', [1,2,5]).get()) // User[]

````

## Typescript Declarations

````ts
function whereIn(field: string, values: any[]): Query
````
