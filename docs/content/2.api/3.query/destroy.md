---
title: 'destroy()'
description: 'Delete a model by its primary key.'
---

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

console.log(userRepo.destroy(1)) // User
console.log(userRepo.destroy([1,2,5])) // User[]

````

::alert{type='info'}
If you want also relations to be deleted the the deleted record look at [Deleting Relationships](/guide/relationships/getting-started#deleting-relationships)
::

## Typescript Declarations

````ts
function destroy(id: string | number): Item<M>
function destroy(ids: (string | number)[]): Collection<M>
````
