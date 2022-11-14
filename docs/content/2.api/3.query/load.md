---
title: 'load()'
description: 'Eager load relations on the model.'
---

# `load()`

## Usage

````ts
import { useRepo } from 'pinia-orm'
import User from './models/User'

const userRepo = useRepo(User)

const users = userRepo.all()

// eager load "coomments" relation  for all users
userRepo.with('comments').load(users) 
// eager load "coomments" relation with closure  for all users
userRepo.with('comments', (query) => {
    query.where('active', true)
}).load(users)

````

## Typescript Declarations

````ts
function load(models: Collection<M>): void 
````
