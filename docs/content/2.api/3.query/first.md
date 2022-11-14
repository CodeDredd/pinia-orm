---
title: 'first()'
description: 'Execute the query and get the first result.'
---

# `first()`

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

console.log(userRepo.where('prename', 'John').first()) // User - with prename 'John'

````

## Typescript Declarations

````ts
function first(): Item<M>
````
