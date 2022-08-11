---
title: 'withAll()'
description: 'Set to eager load all top-level relationships. Constraint is set for all relationships.'
---

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

const usersWithComments = userRepo.withAll().get() // User[] with all its relations loaded
// with closure
const usersWithCommentsOnlyActive = userRepo.withAll((query) => {
    query.where('active', true)
}).get() // User[] with comments which are active. Don't forget that you still get all Users just with less relations

````

## Typescript Declarations

````ts
function withAll(callback: EagerLoadConstraint = () => {}): Query
````
