---
title: 'withAllRecursive()'
description: 'Set to eager load all relationships recursively.'
---

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

const users = userRepo.withAllRecursive().get() // User[] with all its nested relations 3 levels deep
const usersWithRelations = userRepo.withAllRecursive(2).get() // User[] with all its nested relations 2 levels deep

````

## Typescript Declarations

````ts
function withAllRecursive(depth = 3): Query<M>
````
