---
title: 'all()'
description: 'Get all models from the store.'
---

# `all()`

::alert{type='warning'}
The difference with the `get` is that this
method will not process any query chain. It'll always retrieve all models.
::

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

const users = userRepo.query().all() // User[] - all 
const usersPreName = userRepo.where('prename', 'John').all() // User[] - still all User !
````

## Typescript Declarations

````ts
function all(): Collection<M>
````
