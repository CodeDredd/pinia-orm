---
title: 'where()'
description: 'Add a basic where clause to the query.'
---

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

console.log(userRepo.where('prename', 'John').get()) // User[] - with prename 'John'
// with value closure
console.log(useRepo(User).where('votes', (value) => {
  return value >= 100
}).get())
// with where closure
console.log(userRepo.where((user: User) => {
  return user.votes >= 100 && user.active
}).get()) // User[]
````

## Typescript Declarations

````ts
function where(
  field: WherePrimaryClosure | string,
  value?: WhereSecondaryClosure | any,
): Query
````
