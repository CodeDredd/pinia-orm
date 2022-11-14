---
title: 'doesntHave()'
description: 'Add a "doesnt have" clause to the query.'
---

# `doesntHave()`

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

// Retrieve all posts that have no comments
useRepo(User).doesntHave('comments').get()
````

## Typescript Declarations

````ts
function doesntHave(relation: string): Query
````
