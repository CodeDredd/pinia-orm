---
title: 'load()'
description: 'Eager load relations on the model.'
---

# `load()`

Attaches relations to models that were **already retrieved** from the store. Use it when you fetched a collection without `with()` — e.g. because the relations weren't needed at that point, or the data comes from a cached query — and you want to add relations afterwards without re-running the whole query. This is the lazy-loading counterpart to eager loading with [`with()`](with).

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

const users = userRepo.all()

// eager load "comments" relation  for all users
userRepo.with('comments').load(users) 
// eager load "comments" relation with closure  for all users
userRepo.with('comments', (query) => {
    query.where('active', true)
}).load(users)

````

## Typescript Declarations

````ts
function load(models: Collection<M>): void 
````
