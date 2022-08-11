---
title: 'with()'
description: 'Set the relationships that should be eager loaded.'
---

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

const usersWithComments = userRepo.with('comments').get() // User[] with comments relations
// with closure
const usersWithCommentsOnlyActive = userRepo.with('comments', (query) => {
    query.where('active', true)
}).get() // User[] with comments which are active. Don't forget that you still get all Users just with less comments

````

## Typescript Declarations

````ts
function with(name: string, callback: EagerLoadConstraint = () => {}): Query
````
