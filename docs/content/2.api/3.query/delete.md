---
title: 'delete()'
description: 'Delete a model by query'
---

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

console.log(userRepo.where('name', 'John').delete()) // User

````

::alert{type='info'}
If you want also relations to be deleted the the deleted record look at [Deleting Relationships](/guide/relationships/getting-started#deleting-relationships)
::

## Typescript Declarations

````ts
function delete(): Model[]
````
