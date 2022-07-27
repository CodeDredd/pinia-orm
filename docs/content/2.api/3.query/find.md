---
title: 'find()'
description: 'Find a model by its primary key.'
---

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

console.log(userRepo.find(1)) // User
console.log(userRepo.find([1,2,5])) // User[]

````

## Typescript Declarations

````ts
function find(id: string | number): Item<M>
function find(ids: (string | number)[]): Collection<M>
````
